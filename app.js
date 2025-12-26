let receita = [];
let margem = 0;

function converter(valor, unidade) {
  if (unidade === "kg" || unidade === "L") return valor * 1000;
  return valor;
}

function adicionarIngrediente(ing) {
  if (receita.some(i => i.nome === ing.nome)) {
    alert("Ingrediente já adicionado.");
    return;
  }

  receita.push({
    nome: ing.nome,
    tipo: ing.tipo,       // insumo ou embalagem
    unidadeBase: ing.unidade,
    qtdUsada: "",
    custoUnitario: "",
    custo: 0
  });

  atualizar();
}

function calcularCusto(item) {
  if (!item.qtdUsada || !item.custoUnitario) {
    item.custo = 0;
    return;
  }

  if (item.tipo === "insumo") {
    // custo por kg ou litro
    let qtdBase = converter(parseFloat(item.qtdUsada), item.unidadeBase);
    let custoBase = parseFloat(item.custoUnitario) / 1000;
    item.custo = qtdBase * custoBase;
  }

  if (item.tipo === "embalagem") {
    // custo unitário
    item.custo = parseFloat(item.qtdUsada) * parseFloat(item.custoUnitario);
  }
}

function atualizar() {
  let tbody = document.getElementById("receita");
  tbody.innerHTML = "";
  let total = 0;

  receita.forEach((item, index) => {
    calcularCusto(item);
    total += item.custo;

    let campos =
      item.tipo === "insumo"
        ? `<td>Qtd usada (${item.unidadeBase})</td><td>Custo R$ / ${item.unidadeBase}</td>`
        : `<td>Qtd (un)</td><td>Preço unitário (R$)</td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>
        <input type="number" value="${item.qtdUsada}"
          oninput="receita[${index}].qtdUsada = this.value; atualizar()">
      </td>
      <td>
        <input type="number" value="${item.custoUnitario}"
          oninput="receita[${index}].custoUnitario = this.value; atualizar()">
      </td>
      <td>R$ ${item.custo.toFixed(2)}</td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("custoTotal").innerText = total.toFixed(2);

  let precoVenda =
    margem > 0 && margem < 100 ? total / (1 - margem / 100) : 0;

  document.getElementById("precoVenda").innerText = precoVenda.toFixed(2);
}

function atualizarMargem(valor) {
  margem = parseFloat(valor) || 0;
  atualizar();
}
