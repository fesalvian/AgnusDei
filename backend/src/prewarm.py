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

if __name__ == "__main__":
    prewarm_personagens()
    prewarm_artigos()
    prewarm_oracoes()
