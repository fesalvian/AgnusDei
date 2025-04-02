from flask import jsonify, request
from src.database import get_connection, get_cached_data, set_cache_data
import html
from flask import Flask

app = Flask(__name__)

def create_articles_blueprint():
    from flask import Blueprint
    bp = Blueprint('articles', __name__)

    @bp.route('/api/artigos', methods=['GET'])
    def get_artigos():
        return jsonify({'message': 'Endpoint de artigos'})

    @bp.route('/api/artigo/<string:slug>', methods=['GET'])
    def get_artigo_completo(slug):
        return jsonify({'message': f'Endpoint do artigo com slug {slug}'})

    return bp

def configure_artigos_routes(app):
    @app.route('/api/artigos', methods=['GET'])
    def get_artigos():
        try:
            categoria = request.args.get('categoria', 'todos')
            cache_key = f'artigos_{categoria}'
            
            if cached := get_cached_data(cache_key):
                return jsonify(cached)
            
            with get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                
                query = """
                    SELECT 
                        id, titulo, resumo, categoria, 
                        imagem_capa, data_postagem, 
                        tempo_estimado_leitura,conteudo, slug
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
                
                # Processamento seguro
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
                return jsonify(processed)
            
        except Exception as e:
            app.logger.error(f"ERRO: {str(e)}")
            return jsonify({
                'error': 'Erro interno',
                'details': str(e)
            }), 500
        
@app.route('/api/artigo/<string:slug>', methods=['GET'])
def get_artigo_completo(slug):
    try:
        with get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT titulo, conteudo, imagem_capa 
                FROM artigos 
                WHERE slug = %s AND status = 'publicado'
            """, (slug,))
            
            artigo = cursor.fetchone()
            if not artigo:
                return jsonify({'error': 'Artigo não encontrado'}), 404
            
            return jsonify({
                'titulo': artigo['titulo'],
                'conteudo': artigo['conteudo'],
                'imagem_capa': artigo['imagem_capa']
            })
            
    except Exception as e:
        app.logger.error(f"ERRO Artigo Completo: {str(e)}")
        return jsonify({'error': str(e)}), 500            