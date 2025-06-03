# app.py
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from src.database import get_connection  # Importa de dentro da pasta src/
from src.database import get_cached_data, set_cache_data  # Importa as funções de cache
from src.oracoes import oracoes_bp      # Importa o Blueprint de orações
from src.artigos import  create_articles_blueprint
import requests
import xml.etree.ElementTree as ET
from src.contato import relatar_bug
from dotenv import load_dotenv
import os
import json
import redis
from src.prewarm import prewarm_personagens, prewarm_video_destaque, prewarm_personagens_individuais, prewarm_oracoes_individuais, prewarm_artigos_individuais


app = Flask(__name__)
CORS(app)

#Carergamentos de cache automaticos
prewarm_video_destaque()
prewarm_personagens_individuais()
prewarm_oracoes_individuais()
prewarm_oracoes_individuais()

articles_bp = create_articles_blueprint()
app.register_blueprint(articles_bp, url_prefix='/api')
# Registra o Blueprint de orações
app.register_blueprint(oracoes_bp)


load_dotenv() # Carrega as variáveis de ambiente do arquivo .env
# Configuração do Redis
cache = redis.StrictRedis.from_url(os.getenv("REDIS_URL"), decode_responses=True)


# Rota para a página de personagens
@app.route("/personagens", methods=["GET"])
def personagens():
    prewarm_personagens()
    return render_template("cards.html")

# Rota para buscar todos os personagens (API)
@app.route("/api/personagens", methods=["GET"])
def get_personagens():
    """Retorna todos os personagens do banco de dados com cache."""
    try:
        # 1. Tenta pegar do cache
        cached_data = cache.get("personagens")

        if cached_data:
            print("🔁 Cache HIT: personagens")
            personagens = json.loads(cached_data)
            return jsonify(personagens)

        print("🚀 Cache MISS: buscando no MySQL")

        # 2. Se não tiver no cache, busca no banco
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT id, nome, subtitulo, texto, img FROM mais_sobre;"
        cursor.execute(query)
        personagens = cursor.fetchall()

        cursor.close()
        conn.close()

        # 3. Salva no cache por 5 minutos (300 segundos)
        cache.setex("personagens", 300, json.dumps(personagens))

        return jsonify(personagens)

    except Exception as e:
        print(f"Erro ao buscar personagens: {e}")
        return jsonify({"error": "Erro ao buscar personagens"}), 500


# Rota para buscar um personagem específico (API)
@app.route("/personagem/<int:id>", methods=["GET"])
def personagem(id):
    """Retorna os detalhes de um personagem específico, com cache."""
    from src.database import get_cached_data, set_cache_data

    cache_key = f"personagem_{id}"
    personagem = get_cached_data(cache_key)

    if personagem:
        print(f"✅ Cache HIT: {cache_key}")
        return render_template("detalhes.html", personagem=personagem)

    print(f"🚀 Cache MISS: {cache_key}, buscando no banco...")

    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT id, nome, subtitulo, texto, img FROM mais_sobre WHERE id = %s;"
            cursor.execute(query, (id,))
            personagem = cursor.fetchone()
            cursor.close()
            conn.close()

            if personagem:
                set_cache_data(cache_key, personagem)
                return render_template("detalhes.html", personagem=personagem)
            else:
                return "Personagem não encontrado", 404
        except Exception as e:
            print(f"Erro ao buscar personagem: {e}")
            return "Erro ao buscar personagem", 500
    return "Erro de conexão com o banco de dados", 500


#rota para buscar noticias
RSS_URL = "https://news.google.com/rss/search?q=notícias+católicas&hl=pt-BR&gl=BR&ceid=BR:pt-419"

@app.route('/api/noticias')
def get_noticias():
    try:
        response = requests.get(RSS_URL, timeout=10)
        response.raise_for_status()

        root = ET.fromstring(response.content)
        noticias = []

        for item in root.findall(".//item")[:5]:  # Pegamos os 5 primeiros artigos
            title = item.find("title").text if item.find("title") is not None else "Sem título"
            description = item.find("description").text if item.find("description") is not None else "Sem descrição"
            link = item.find("link").text if item.find("link") is not None else "#"
            pubDate = item.find("pubDate").text if item.find("pubDate") is not None else "Data desconhecida"
            noticias.append({
                "title": title,
                "description": description,
                "link": link,
                "pubDate": pubDate
            })

        return jsonify(noticias)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Erro ao buscar notícias: {str(e)}"}), 500
    except ET.ParseError as e:
        return jsonify({"error": f"Erro ao processar XML: {str(e)}"}), 500
    
# Rota para listar os artigos da autora
@app.route('/autora/fsp')
def artigos_autora_fsp():
    conn = get_connection()
    if conn is None:
        return "Erro ao conectar com o banco de dados.", 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT titulo, resumo, slug 
        FROM artigos_autora 
        WHERE status = 'publicado' 
        ORDER BY data_postagem DESC 
        LIMIT 3
    """)
    artigos = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('FSP.html', artigos=artigos)


# Rota para visualizar o artigo completo
@app.route('/artigo-autora/<slug>')
def artigo_autora_detalhe(slug):
    conn = get_connection()
    if conn is None:
        return "Erro ao conectar com o banco de dados.", 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM artigos_autora WHERE slug = %s", (slug,))
    artigo = cursor.fetchone()
    cursor.close()
    conn.close()

    if not artigo:
        return "Artigo não encontrado", 404

    return render_template('artigo_autora.html', artigo=artigo)




@app.route('/artigo/<slug>')
def artigo_detalhe(slug):
    return jsonify({"mensagem": "Dados do servidor"})

@app.route("/api/video-destaque", methods=["GET"])
def get_video_destaque():
    # Primeiro tenta buscar no cache
    cached_video = get_cached_data('video_destaque')
    if cached_video:
        return jsonify(cached_video)

    # Se não tiver no cache, busca no banco e atualiza o cache
    conn = get_connection()
    if conn:
        try:
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
                return jsonify(video)
            else:
                return jsonify({"error": "Nenhum vídeo encontrado"}), 404
        except Exception as e:
            print(f"Erro ao buscar vídeo: {e}")
            return jsonify({"error": "Erro ao buscar vídeo"}), 500
    return jsonify({"error": "Erro de conexão com o banco de dados"}), 500



# Rotas principais
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/jesus")
def jesus():
    return render_template("jesus.html")

@app.route("/maria")
def maria():
    return render_template("maria.html")

@app.route("/oracoes")
def oracoes():
    return render_template("oracoes.html")

@app.route("/artigo")
def artigo():
    return render_template("artigo.html")

@app.route("/contato")
def contato():
    return render_template("contato.html")


# Registra a rota /api/relatar-bug
load_dotenv()

app.add_url_rule('/api/relatar-bug', view_func=relatar_bug, methods=['POST'])

            
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)