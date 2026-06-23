import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# 1. Configura o caminho para o Flask encontrar a pasta frontend
pasta_frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

# 2. Inicializa o Flask apontando para essa pasta
app = Flask(__name__, static_folder=pasta_frontend, static_url_path='')
CORS(app)

transactions = []

# ==========================================
# ROTA DA INTERFACE GRÁFICA (FRONTEND)
# ==========================================
@app.route("/")
def index():
    # Quando alguém acessar o link principal, o Flask envia o index.html
    return send_from_directory(app.static_folder, 'index.html')

# ==========================================
# ROTAS DA API (MANTIDAS EXATAMENTE COMO SUA EQUIPE FEZ)
# ==========================================

# listar transações
@app.route("/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)

# criar nova transação
@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    transactions.append(data)
    return jsonify(data)

# deletar transação
@app.route("/transactions/<int:index>", methods=["DELETE"])
def delete_transaction(index):
    if 0 <= index < len(transactions):
        transactions.pop(index)
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)
