# src/oracoes.py
from flask import Blueprint, jsonify
from .database import get_connection, get_cached_data, set_cache_data
from .prewarm import prewarm_oracoes

oracoes_bp = Blueprint('oracoes', __name__)

# Rota para buscar todas as orações
@oracoes_bp.route("/api/oracoes", methods=["GET"])
def get_oracoes():
    prewarm_oracoes()  # Preenche o cache de todas as orações

    cached_data = get_cached_data("oracoes")
    if cached_data:
        return jsonify(cached_data)

    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT id, titulo, conteudo, categoria_id FROM oracoes;"
            cursor.execute(query)
            oracoes = cursor.fetchall()
            cursor.close()
            conn.close()

            set_cache_data("oracoes", oracoes)
            return jsonify(oracoes)
        except Exception as e:
            print(f"Erro ao buscar orações: {e}")
            return jsonify({"error": "Erro ao buscar orações"}), 500
    return jsonify({"error": "Erro de conexão com o banco de dados"}), 500

# Rota para buscar uma oração específica
@oracoes_bp.route("/api/oracoes/<int:id>", methods=["GET"])
def get_oracao(id):
    cache_key = f"oracao_{id}"

    cached_oracao = get_cached_data(cache_key)
    if cached_oracao:
        return jsonify(cached_oracao)

    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT id, titulo, conteudo FROM oracoes WHERE id = %s;"
            cursor.execute(query, (id,))
            oracao = cursor.fetchone()
            cursor.close()
            conn.close()

            if oracao:
                set_cache_data(cache_key, oracao)
                return jsonify(oracao)
            else:
                return jsonify({"error": "Oração não encontrada"}), 404
        except Exception as e:
            print(f"Erro ao buscar oração: {e}")
            return jsonify({"error": "Erro ao buscar oração"}), 500
    return jsonify({"error": "Erro de conexão com o banco de dados"}), 500
