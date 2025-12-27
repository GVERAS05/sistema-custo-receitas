// ===== Receitas.js =====
const nomeReceitaInput = document.getElementById("nomeReceita");
const btnSalvarReceita = document.getElementById("btnSalvarReceita");
const listaReceitas = document.getElementById("listaReceitas");

// Carrega receitas salvas
let receitasSalvas = JSON.parse(localStorage.getItem("receitasSalvas") || "[]");

// Salvar receita
btnSalvarReceita.addEventListener("click", ()=>{
  const nome = nomeReceitaInput.value.trim();
  if(!nome){
    alert("Digite um nome para a receita!");
    return;
  }

  const itens = [];
  document.querySelectorAll(".card-item").forEach(card=>{
    const inputs = card.querySelectorAll("input[type=number]");
    const select = card.querySelector("select");
    const nomeItem = card.dataset.nome;
    const preco = parseFloat(inputs[0].value) || 0;
    const qtd = parseFloat(inputs[1].value) || 0;
    const unidade = select.value;
    itens.push({nome:nomeItem, preco, qtd, unidade});
  });

  receitasSalvas.push({nome, itens});
  localStorage.setItem("receitasSalvas", JSON.stringify(receitasSalvas));
  nomeReceitaInput.value = "";
  renderizarReceitas();
  alert("Receita salva com sucesso!");
});

// Renderizar lista de receitas salvas
function renderizarReceitas(){
  listaReceitas.innerHTML = "";
  receitasSalvas.forEach((r, idx)=>{
    const li = document.createElement("li");
    li.textContent = r.nome;
    const btnAbrir = document.createElement("button");
    btnAbrir.textContent = "Abrir";
    btnAbrir.onclick = ()=>{
      carregarReceita(idx);
    };
    li.appendChild(btnAbrir);
    listaReceitas.appendChild(li);
  });
}

// Carregar receita na tela
function carregarReceita(idx){
  const r = receitasSalvas[idx];
  // Limpar receita atual
  document.querySelectorAll(".card-item").forEach(c=>c.remove());
  itensAdicionados = {};
  r.itens.forEach(i=>{
    adicionarItem(i.nome);
    const card = document.querySelector(`.card-item[data-nome="${i.nome}"]`);
    card.querySelectorAll("input[type=number]")[0].value = i.preco;
    card.querySelectorAll("input[type=number]")[1].value = i.qtd;
    card.querySelector("select").value = i.unidade;
  });
  calcular();
}

// Inicializa lista de receitas
renderizarReceitas();
