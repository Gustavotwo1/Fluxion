from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

transactions = []

#listar transações
@app.route("/transactions", methods=["GET"])
def get_transactions():
    return jsonify(transactions)

#criar nova transação
@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.json
    transactions.append(data)
    return jsonify(data)

#deletar transação
@app.route("/transactions/<int:index>", methods=["DELETE"])
def delete_transaction(index):
    if 0 <= index < len(transactions):
        transactions.pop(index)
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)
