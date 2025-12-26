let receita = [];
let margem = 0;

const conversoes = {
  g: { kg: 0.001 },
  kg: { g: 1000 },
  ml: { l: 0.001 },
  l: { ml: 1000 }
};

function adicionarIngrediente(item) {
  if (receita.find(i => i.nome === item.nome)) return;

  receita.push({
    nome: item.nome,
    tipo: item.tipo,
    quantidade: 0,
    unidade: unidadePadrao(item.tipo),
    precoCompra: 0,
    custo: 0
  });

  renderizarTabela();
}

function unidadePadrao(tipo) {
  if (tipo === "embalagem") return "un";
  return "kg";
}

function unidadesDisponiveis(tipo) {
  if (tipo === "embalagem") return ["un"];
  return ["g", "kg", "ml", "l"];
}

function renderizarTabela() {
  const tbody = document.getElementById("receita");
  tbody.innerHTML = "";

  receita.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Nome
    tr.innerHTML += `<td>${item.nome}</td>`;

    // Quantidade
    tr.innerHTML += `
      <td>
        <input type="number" min="0" step="any"
          value="${item.quantidade}"
          onchange="alterarQuantidade(${index}, this.value)">
      </td>
    `;

    // Unidade
    tr.innerHTML += `
      <td>
        <select onchange="alterarUnidade(${index}, this.value)">
          ${unidadesDisponiveis(item.tipo).map(u =>
            `<option value="${u}" ${u === item.unidade ? "selected" : ""}>${u}</option>`
          ).join("")}
        </select>
      </td>
    `;

    // Preço de compra
    tr.innerHTML += `
      <td>
        <input type="number" min="0" step="any"
          value="${item.precoCompra}"
          onchange="alterarPreco(${index}, this.value)">
      </td>
    `;

    // Custo
    tr.innerHTML += `<td>R$ ${item.custo.toFixed(2)}</td>`;

    tbody.appendChild(tr);
  });

  atualizarTotais();
}

function alterarQuantidade(index, valor) {
  receita[index].quantidade = parseFloat(valor) || 0;
  calcularCusto(index);
}

function alterarPreco(index, valor) {
  receita[index].precoCompra = parseFloat(valor) || 0;
  calcularCusto(index);
}

function alterarUnidade(index, novaUnidade) {
  const item = receita[index];
  const antiga = item.unidade;

  if (antiga !== novaUnidade && conversoes[antiga]?.[novaUnidade]) {
    item.quantidade *= conversoes[antiga][novaUnidade];
  }

  item.unidade = novaUnidade;
  calcularCusto(index);
  renderizarTabela();
}

function calcularCusto(index) {
  const item = receita[index];

  if (item.tipo === "embalagem") {
    item.custo = item.quantidade * item.precoCompra;
  } else {
    item.custo = item.quantidade * item.precoCompra;
  }

  atualizarTotais();
}

function atualizarTotais() {
  const total = receita.reduce((soma, i) => soma + i.custo, 0);
  document.getElementById("custoTotal").innerText = total.toFixed(2);

  if (margem > 0) {
    const venda = total / (1 - margem / 100);
    document.getElementById("precoVenda").innerText = venda.toFixed(2);
  }
}

function atualizarMargem(valor) {
  margem = parseFloat(valor) || 0;
  atualizarTotais();
}
