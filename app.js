let receita = [];
let margem = 0;

function converterParaBase(valor, unidade) {
  if (unidade === "kg" || unidade === "L") {
    return valor * 1000;
  }
  return valor; // g ou ml
}

function adicionarIngrediente(ingrediente) {
  let item = {
    nome: ingrediente.nome,
    unidade: ingrediente.unidade,
    qtdUsada: 0,
    unUsada: ingrediente.unidade,
    qtdEmbalagem: 0,
    unEmbalagem: ingrediente.unidade,
    precoEmbalagem: 0,
    custo: 0
  };

  receita.push(item);
  atualizar();
}

function calcularCusto(item) {
  if (
    item.qtdUsada > 0 &&
    item.qtdEmbalagem > 0 &&
    item.precoEmbalagem > 0
  ) {
    let usadaBase = converterParaBase(item.qtdUsada, item.unUsada);
    let embalagemBase = converterParaBase(item.qtdEmbalagem, item.unEmbalagem);

    item.custo =
      (item.precoEmbalagem / embalagemBase) *
      usadaBase;
  } else {
    item.custo = 0;
  }
}

function atualizar() {
  let tbody = document.getElementById("receita");
  tbody.innerHTML = "";

  let custoTotal = 0;

  receita.forEach((item, index) => {
    calcularCusto(item);
    custoTotal += item.custo;

    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.nome}</td>

      <td>
        <input type="number"
          onchange="receita[${index}].qtdUsada = this.value; atualizar()">
        <select onchange="receita[${index}].unUsada = this.value; atualizar()">
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="L">L</option>
        </select>
      </td>

      <td>
        <input type="number"
          onchange="receita[${index}].qtdEmbalagem = this.value; atualizar()">
        <select onchange="receita[${index}].unEmbalagem = this.value; atualizar()">
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="L">L</option>
        </select>
      </td>

      <td>
        <input type="number"
          onchange="receita[${index}].precoEmbalagem = this.value; atualizar()">
      </td>

      <td>R$ ${item.custo.toFixed(2)}</td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("custoTotal").innerText =
    custoTotal.toFixed(2);

  let precoVenda = 0;
  if (margem > 0 && margem < 100) {
    precoVenda = custoTotal / (1 - margem / 100);
  }

  document.getElementById("precoVenda").innerText =
    precoVenda.toFixed(2);
}

function atualizarMargem(valor) {
  margem = parseFloat(valor) || 0;
  atualizar();
}
