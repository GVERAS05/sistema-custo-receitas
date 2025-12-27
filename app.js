// app.js

let itensAdicionados = {};  // ingredientes adicionados na receita atual
let precoUnitario = {};     // preços unitários salvos
let receitasSalvas = {};    // receitas completas salvas
const cardsContainer = document.getElementById("cardsContainer");
const listaUL = document.getElementById("listaItens");

// 1. Carregar preços salvos do localStorage
function carregarPrecos() {
  const precos = JSON.parse(localStorage.getItem("precos")) || {};
  precoUnitario = precos;
}

// 2. Salvar preços unitários no localStorage
function salvarPrecos() {
  localStorage.setItem("precos", JSON.stringify(precoUnitario));
}

// 3. Mostrar lista de ingredientes filtráveis
function mostrarLista(itens) {
  listaUL.innerHTML = "";
  itens.forEach(item => {
    if (itensAdicionados[item]) return; // não mostrar se já adicionado
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => adicionarItem(item);
    listaUL.appendChild(li);
  });
}

// 4. Adicionar ingrediente à receita
function adicionarItem(nome) {
  if (itensAdicionados[nome]) return;
  itensAdicionados[nome] = true;

  const card = document.createElement("div");
  card.className = "card-item";
  card.dataset.nome = nome;

  const preco = precoUnitario[nome] || 0;

  card.innerHTML = `
    <div class="card-header">${nome}</div>
    <div class="input-group">
      <input type="number" placeholder="Custo" value="${preco}" step="0.01" oninput="atualizarPreco('${nome}', this.value)">
      <input type="number" placeholder="Qtd" step="0.001" oninput="calcular()">
      <select onchange="calcular()">
        <option value="un">Unidade</option>
        <option value="kg">Quilo (kg)</option>
        <option value="g">Grama (g)</option>
        <option value="L">Litro (L)</option>
        <option value="ml">Mililitro (ml)</option>
      </select>
      <div class="custo">R$ 0.00</div>
      <button onclick="removerItem(this)">Remover</button>
    </div>
  `;
  cardsContainer.appendChild(card);
  document.getElementById("busca").value = "";
  mostrarLista(ingredientes);
  calcular();
}

// 5. Atualizar preço unitário
function atualizarPreco(nome, valor) {
  precoUnitario[nome] = parseFloat(valor) || 0;
  salvarPrecos();
  calcular();
}

// 6. Calcular subtotal e total
function calcular() {
  let total = 0;
  document.querySelectorAll(".card-item").forEach(card => {
    const inputs = card.querySelectorAll("input[type=number]");
    const custo = parseFloat(inputs[0].value) || 0;
    const qtd = parseFloat(inputs[1].value) || 0;
    const subtotal = custo * qtd;
    card.querySelector(".custo").textContent = "R$ " + subtotal.toFixed(2);
    total += subtotal;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

// 7. Remover item da receita
function removerItem(botao) {
  const card = botao.closest(".card-item");
  delete itensAdicionados[card.dataset.nome];
  card.remove();
  calcular();
  mostrarLista(ingredientes);
}

// 8. Inicializar
function init() {
  carregarPrecos();
  mostrarLista(ingredientes);
  // Aqui podemos adicionar carregamento da receita atual se quiser
}

init();
