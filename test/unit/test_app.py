import pytest
from src.backend.app import app, transactions

@pytest.fixture
def client():
    # Limpa a lista antes de cada teste para não misturar dados
    transactions.clear()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

#(GET)
def test_get_transactions_vazia(client):
    resposta = client.get('/transactions')
    assert resposta.status_code == 200
    assert resposta.json == []

#(POST)
def test_add_transaction(client):
    nova_transacao = {"descricao": "Almoço", "valor": 32.50}
    resposta = client.post('/transactions', json=nova_transacao)
    assert resposta.status_code == 200
    assert resposta.json == nova_transacao
    assert len(transactions) == 1

#(DELETE)
def test_delete_transaction(client):
    transactions.append({"descricao": "Cinema", "valor": 30.0})
    resposta = client.delete('/transactions/0')
    assert resposta.status_code == 200
    assert resposta.json == {"ok": True}
    assert len(transactions) == 0