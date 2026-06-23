
const API_URL = "http://127.0.0.1:5000/transactions";

let transactions = [];
let pizzaChart;
let barChart;

// CARREGAR DADOS AO ABRIR
async function carregarTransacoes() {
    const res = await fetch(API_URL);
    transactions = await res.json();
    atualizarTela();
}

// ADICIONAR TRANSAÇÃO
async function adicionarTransacao(e) {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const nome = document.getElementById("nome").value;
    const valor = parseFloat(document.getElementById("valor").value.replace(",","."));
    const data = document.getElementById("data").value;
    const categoria = document.getElementById("categoria").value;

    const nova = { tipo, nome, valor, data, categoria };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nova)
    });

    fecharModal();
    carregarTransacoes();
}

// DELETAR
async function deletar(index) {
    await fetch(`${API_URL}/${index}`, {
        method: "DELETE"
    });

    carregarTransacoes();
}

//  ATUALIZAR TELA
function atualizarTela() {
    atualizarTabela();
    atualizarSaldo();
    atualizarResumo();
}

// TABELA
function atualizarTabela() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    transactions.forEach((t, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${t.nome}</td>
            <td>${t.categoria}</td>
            <td>${t.tipo}</td>
            <td>${t.data}</td>
            <td>${t.tipo === "Despesa" ? "-" : ""}R$ ${t.valor}</td>
            <td>
                <button onclick="deletar(${i})">🗑</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// SALDO
function atualizarSaldo() {
    let total = 0;

    transactions.forEach(t => {
        if (t.tipo === "Receita") total += t.valor;
        else total -= t.valor;
    });

    document.querySelector(".balance-box h1").innerText = 
        "R$ " + total.toFixed(2);
}

// RESUMO (GRÁFICO FUTURO)
function atualizarResumo() {
    let receita = 0;
    let despesa = 0;

    transactions.forEach(t => {
        if (t.tipo === "Receita") receita += t.valor;
        else despesa += t.valor;
    });

    document.querySelector(".income-box p").innerText =
        "R$ " + receita.toFixed(2);

    document.querySelector(".expense-box p").innerText =
        "R$ " + despesa.toFixed(2);

    pizzaChart.data.datasets[0].data = [receita, despesa];
    pizzaChart.update();

    const labels = transactions.map(t => t.nome);
    const valores = transactions.map(t => t.valor);

    barChart.data.labels = labels;
    barChart.data.datasets[0].data = valores;
    barChart.update();
}

// MODAL
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

function fecharModal() {
    modal.style.display = "none";
}

// EVENTO FORM
document.querySelector("form")
    .addEventListener("submit", adicionarTransacao);


// GRAFICO
function criarGraficos() {
    const ctxPizza = document.getElementById("pizzaChart");
    const ctxBar = document.getElementById("barChart");

    pizzaChart = new Chart(ctxPizza, {
        type: "pie",
        data: {
            labels: ["Receita", "Despesa"],
            datasets: [{
                data: [0, 0]
            }]
        }
    });

    barChart = new Chart(ctxBar, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Valores",
                data: []
            }]
        }
    });
}

criarGraficos();
carregarTransacoes();