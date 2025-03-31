
from flask import Flask, jsonify, request
from database import get_connection, get_cached_data, set_cache_data
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/api/artigos', methods=['GET'])
def get_artigos():
    categoria = request.args.get('categoria', 'todos')
    
    # Verifica cache primeiro
    cache_key = f'artigos_{categoria}'
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Se não tem no cache, busca no MySQL
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Query base
        query = """
            SELECT a.id, a.titulo, a.resumo, a.categoria, a.imagem_capa, 
                a.data_postagem, a.tempo_estimado_leitura, a.slug
            FROM artigos a
            WHERE a.status = 'publicado'
        """
        
        # Adiciona filtro de categoria se necessário
        params = ()
        if categoria != 'todos':
            query += " AND a.categoria = %s"
            params = (categoria,)
        
        query += " ORDER BY a.data_postagem DESC"
        
        cursor.execute(query, params)
        artigos = cursor.fetchall()
        
        # Formata os dados para resposta
        result = []
        for artigo in artigos:
            result.append({
                'id': artigo['id'],
                'titulo': artigo['titulo'],
                'resumo': artigo['resumo'],
                'categoria': artigo['categoria'],
                'imagem_capa': artigo['imagem_capa'],
                'data_postagem': artigo['data_postagem'].strftime('%Y-%m-%d') if artigo['data_postagem'] else None,
                'tempo_estimado_leitura': artigo['tempo_estimado_leitura'],
                'slug': artigo['slug']
            })
        
        # Armazena no cache
        set_cache_data(cache_key, result)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/artigo/<int:artigo_id>', methods=['GET'])
def get_artigo_completo(artigo_id):
    # Verifica cache primeiro
    cache_key = f'artigo_{artigo_id}'
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return jsonify(cached_data)
    
    # Se não tem no cache, busca no MySQL
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Busca o artigo principal
        cursor.execute("""
            SELECT a.id, a.titulo, a.categoria, a.imagem_capa, a.data_postagem, 
                a.tempo_estimado_leitura, a.conteudo, a.slug
            FROM artigos a
            WHERE a.id = %s AND a.status = 'publicado'
        """, (artigo_id,))
        artigo = cursor.fetchone()
        
        if not artigo:
            return jsonify({'error': 'Artigo não encontrado'}), 404
        
        # Busca as imagens do artigo
        cursor.execute("""
            SELECT caminho_imagem, legenda, ordem
            FROM artigo_imagens
            WHERE artigo_id = %s
            ORDER BY ordem
        """, (artigo_id,))
        imagens = cursor.fetchall()
        
        # Formata os dados para resposta
        result = {
            'id': artigo['id'],
            'titulo': artigo['titulo'],
            'categoria': artigo['categoria'],
            'imagem_capa': artigo['imagem_capa'],
            'data_postagem': artigo['data_postagem'].strftime('%Y-%m-%d') if artigo['data_postagem'] else None,
            'tempo_estimado_leitura': artigo['tempo_estimado_leitura'],
            'conteudo': artigo['conteudo'],
            'slug': artigo['slug'],
            'imagens': imagens
        }
        
        # Armazena no cache
        set_cache_data(cache_key, result)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)