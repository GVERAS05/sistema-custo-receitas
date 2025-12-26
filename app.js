let receita = [];
let margem = 0;

function adicionarIngrediente(ingrediente) {
  let item = {
    nome: ingrediente.nome,
    unidade: ingrediente.unidade,
    quantidadeUsada: 0,
    quantidadeEmbalagem: 0,
    precoEmbalagem: 0,
    custo: 0
  };

  receita.push(item);
  atualizar();
}

function calcularCusto(item) {
  if (
    item.quantidadeUsada > 0 &&
    item.quantidadeEmbalagem > 0 &&
    item.precoEmbalagem > 0
  ) {
    item.custo =
      (item.precoEmbalagem / item.quantidadeEmbalagem) *
      item.quantidadeUsada;
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
          onchange="receita[${index}].quantidadeUsada = this.value; atualizar()">
      </td>

      <td>${item.unidade}</td>

      <td>
        <input type="number"
          onchange="receita[${index}].quantidadeEmbalagem = this.value; atualizar()">
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
