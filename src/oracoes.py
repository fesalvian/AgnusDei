# src/oracoes.py
from flask import Blueprint, jsonify
from .database import get_connection

oracoes_bp = Blueprint('oracoes', __name__)

# Rota para buscar todas as orações
@oracoes_bp.route("/api/oracoes", methods=["GET"])
def get_oracoes():
    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT id, titulo, conteudo, categoria_id FROM oracoes;"
            cursor.execute(query)
            oracoes = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify(oracoes)  # Retorna um array de orações
        except Exception as e:
            print(f"Erro ao buscar orações: {e}")
            return jsonify({"error": "Erro ao buscar orações"}), 500
    return jsonify({"error": "Erro de conexão com o banco de dados"}), 500

# Rota para buscar uma oração específica
@oracoes_bp.route("/api/oracoes/<int:id>", methods=["GET"])
def get_oracao(id):
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
                return jsonify(oracao)
            else:
                return jsonify({"error": "Oração não encontrada"}), 404
        except Exception as e:
            print(f"Erro ao buscar oração: {e}")
            return jsonify({"error": "Erro ao buscar oração"}), 500
    return jsonify({"error": "Erro de conexão com o banco de dados"}), 500