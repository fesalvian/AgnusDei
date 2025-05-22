from src.database import get_connection, set_cache_data
from src.database import get_cached_data  # Para evitar sobrescrever
import html

def prewarm_personagens():
    cache_key = "personagens"
    if get_cached_data(cache_key):
        print(f"✅ Cache já preenchido: {cache_key}")
        return

    with get_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, subtitulo, texto, img FROM mais_sobre")
        personagens = cursor.fetchall()
        set_cache_data(cache_key, personagens)
        print(f"✅ Cache preenchido: {cache_key}")

def prewarm_personagens_individuais():
    from src.database import get_connection, set_cache_data

    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, nome, subtitulo, texto, img FROM mais_sobre LIMIT 50;")
            personagens = cursor.fetchall()
            cursor.close()
            conn.close()

            for personagem in personagens:
                cache_key = f"personagem_{personagem['id']}"
                set_cache_data(cache_key, personagem)
                print(f"✅ Prewarmed: {cache_key}")
        except Exception as e:
            print(f"❌ Erro no prewarm de personagens individuais: {e}")


def prewarm_artigos():
    categorias = ['todos', 'tradicoes', 'estudos', 'reflexoes']  # Ajuste conforme suas categorias

    for categoria in categorias:
        cache_key = f"artigos_{categoria}"
        if get_cached_data(cache_key):
            print(f"✅ Cache já preenchido: {cache_key}")
            continue

        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT id, titulo, resumo, categoria, imagem_capa, data_postagem,
                       tempo_estimado_leitura, conteudo, slug
                FROM artigos
                WHERE status = 'publicado'
            """
            params = []

            if categoria != 'todos':
                query += " AND categoria = %s"
                params.append(categoria)

            query += " ORDER BY data_postagem DESC"

            cursor.execute(query, params)
            artigos = cursor.fetchall()

            processed = []
            for artigo in artigos:
                processed.append({
                    'id': artigo['id'],
                    'titulo': html.escape(artigo['titulo']) if artigo['titulo'] else '',
                    'resumo': html.escape(artigo['resumo']) if artigo['resumo'] else '',
                    'categoria': artigo['categoria'],
                    'imagem_capa': artigo['imagem_capa'] or '',
                    'data_postagem': artigo['data_postagem'].isoformat() if artigo['data_postagem'] else None,
                    'tempo_estimado_leitura': artigo['tempo_estimado_leitura'],
                    'conteudo': artigo['conteudo'] or 'Erro ao carregar conteúdo',
                    'slug': artigo['slug']
                })

            set_cache_data(cache_key, processed)
            print(f"✅ Cache preenchido: {cache_key}")

def prewarm_artigos_individuais():
    from src.database import get_connection, set_cache_data

    try:
        conn = get_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT id, titulo, resumo, categoria, imagem_capa, data_postagem, 
                       tempo_estimado_leitura, conteudo, slug
                FROM artigos
                WHERE status = 'publicado';
            """)
            artigos = cursor.fetchall()
            cursor.close()
            conn.close()

            for artigo in artigos:
                cache_key = f"artigo_{artigo['slug']}"
                set_cache_data(cache_key, artigo)
                print(f"✅ Prewarm: {cache_key}")
        else:
            print("⚠️ Não foi possível conectar ao banco para prewarm de artigos.")
    except Exception as e:
        print(f"❌ Erro no prewarm_artigos_individuais: {e}")


def prewarm_oracoes():
    cache_key = "oracoes"
    if get_cached_data(cache_key):
        print(f"✅ Cache já preenchido: {cache_key}")
        return

    with get_connection() as conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, titulo, conteudo, categoria_id FROM oracoes")
        oracoes = cursor.fetchall()
        set_cache_data(cache_key, oracoes)
        print(f"✅ Cache preenchido: {cache_key}")

def prewarm_oracoes_individuais():
    from src.database import get_connection, set_cache_data

    try:
        conn = get_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, titulo, conteudo, categoria_id FROM oracoes;")
            oracoes = cursor.fetchall()
            cursor.close()
            conn.close()

            for oracao in oracoes:
                cache_key = f"oracao_{oracao['id']}"
                set_cache_data(cache_key, oracao)
                print(f"✅ Prewarm: {cache_key}")
        else:
            print("⚠️ Não foi possível conectar ao banco para prewarm de orações.")
    except Exception as e:
        print(f"❌ Erro no prewarm_oracoes_individuais: {e}")


def prewarm_video_destaque():
    """Pré-carrega o vídeo destaque no cache."""
    try:
        conn = get_connection()
        if conn:
            cursor = conn.cursor(dictionary=True)
            query = """
                SELECT titulo, descricao, url_video 
                FROM videos_destacados 
                WHERE ativo = 1 
                ORDER BY id DESC 
                LIMIT 1;
            """
            cursor.execute(query)
            video = cursor.fetchone()
            cursor.close()
            conn.close()

            if video:
                set_cache_data('video_destaque', video)
                print("✅ Vídeo destaque pré-carregado no cache!")
            else:
                print("⚠️ Nenhum vídeo destaque encontrado para pré-carregar.")
        else:
            print("⚠️ Erro de conexão para pré-carregar vídeo destaque.")
    except Exception as e:
        print(f"❌ Erro ao pré-carregar vídeo destaque: {e}")


if __name__ == "__main__":
    prewarm_personagens()
    prewarm_artigos()
    prewarm_oracoes()
