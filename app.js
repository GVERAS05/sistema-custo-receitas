// ===== App.js =====
const cardsContainer = document.getElementById("cardsContainer");
const listaUL = document.getElementById("listaItens");
const buscaInput = document.getElementById("busca");
const totalEl = document.getElementById("total");

// Carrega preços unitários do localStorage
let precosUnitarios = JSON.parse(localStorage.getItem("precosUnitarios") || "{}");

// Itens adicionados à receita atual
let itensAdicionados = {};

// Mostrar lista de ingredientes filtrada
function mostrarLista(itens){
  listaUL.innerHTML = "";
  itens.forEach(item=>{
    if(itensAdicionados[item]) return;
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = ()=>adicionarItem(item);
    listaUL.appendChild(li);
  });
}

// Filtrar pesquisa
buscaInput.addEventListener("keyup", ()=>{
  const txt = buscaInput.value.toLowerCase();
  mostrarLista(ingredientes.filter(i=>i.toLowerCase().includes(txt)));
});

// Adicionar item à receita
function adicionarItem(nome){
  if(itensAdicionados[nome]) return;
  itensAdicionados[nome] = true;

  const card = document.createElement("div");
  card.className = "card-item";
  card.dataset.nome = nome;

  const preco = precosUnitarios[nome] || "";

  card.innerHTML = `
    <div class="card-header">${nome}</div>
    <div class="input-group">
      <input type="number" placeholder="Preço unitário" step="0.01" value="${preco}" oninput="atualizarPreco('${nome}', this.value)">
      <input type="number" placeholder="Qtd" step="0.001" oninput="calcular()">
      <select onchange="calcular()">
        <option value="un">Unidade</option>
        <option value="kg">Kg</option>
        <option value="g">g</option>
        <option value="L">L</option>
        <option value="ml">ml</option>
      </select>
      <div class="custo">R$ 0.00</div>
      <button onclick="removerItem(this)">Remover</button>
    </div>
  `;
  cardsContainer.appendChild(card);
  buscaInput.value = "";
  mostrarLista(ingredientes);
  calcular();
}

// Atualiza preço unitário e salva no localStorage
function atualizarPreco(nome, valor){
  precosUnitarios[nome] = parseFloat(valor) || 0;
  localStorage.setItem("precosUnitarios", JSON.stringify(precosUnitarios));
  calcular();
}

// Remover item da receita
function removerItem(botao){
  const card = botao.closest(".card-item");
  delete itensAdicionados[card.dataset.nome];
  card.remove();
  mostrarLista(ingredientes);
  calcular();
}

// Calcular subtotais e total
function calcular(){
  let total = 0;
  document.querySelectorAll(".card-item").forEach(card=>{
    const inputs = card.querySelectorAll("input[type=number]");
    const preco = parseFloat(inputs[0].value) || 0;
    const qtd = parseFloat(inputs[1].value) || 0;
    const subtotal = preco * qtd;
    card.querySelector(".custo").textContent = "R$ "+subtotal.toFixed(2);
    total += subtotal;
  });
  totalEl.textContent = total.toFixed(2);
}

// Inicializa lista completa
mostrarLista(ingredientes);
