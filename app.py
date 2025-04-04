# app.py
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from src.database import get_connection  # Importa de dentro da pasta src/
from src.oracoes import oracoes_bp      # Importa o Blueprint de orações
from src.artigos import  create_articles_blueprint
import requests
import xml.etree.ElementTree as ET
from src.contato import relatar_bug


app = Flask(__name__)
CORS(app)

articles_bp = create_articles_blueprint()
app.register_blueprint(articles_bp, url_prefix='/api')
# Registra o Blueprint de orações
app.register_blueprint(oracoes_bp)


# Rota para a página de personagens
@app.route("/personagens", methods=["GET"])
def personagens():
    return render_template("cards.html")

# Rota para buscar todos os personagens (API)
@app.route("/api/personagens", methods=["GET"])
def get_personagens():
    """Retorna todos os personagens do banco de dados."""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT id, nome, subtitulo, texto, img FROM mais_sobre;"
        cursor.execute(query)
        personagens = cursor.fetchall()

        cursor.close()
        conn.close()
        
        return jsonify(personagens)  
    except Exception as e:
        print(f"Erro ao buscar personagens: {e}")
        return jsonify({"error": "Erro ao buscar personagens"}), 500


# Rota para buscar um personagem específico (API)
@app.route("/personagem/<int:id>", methods=["GET"])
def personagem(id):
    """Retorna os detalhes de um personagem específico."""
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

@app.route('/artigo/<slug>')
def artigo_detalhe(slug):
    return render_template('artigo_completo.html')



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
app.add_url_rule('/api/relatar-bug', view_func=relatar_bug, methods=['POST'])

            
if __name__ == "__main__":
    app.run(debug=True)