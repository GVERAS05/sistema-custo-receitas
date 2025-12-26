let receita = [];

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
  atualizarTabela();
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

function atualizarTabela() {
  let tbody = document.getElementById("receita");
  tbody.innerHTML = "";

  let total = 0;

  receita.forEach((item, index) => {
    calcularCusto(item);
    total += item.custo;

    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.nome}</td>

      <td>
        <input type="number" placeholder="Qtd usada"
          onchange="receita[${index}].quantidadeUsada = this.value; atualizarTabela()">
      </td>

      <td>${item.unidade}</td>

      <td>
        <input type="number" placeholder="Qtd embalagem"
          onchange="receita[${index}].quantidadeEmbalagem = this.value; atualizarTabela()">
      </td>

      <td>
        <input type="number" placeholder="Preço embalagem (R$)"
          onchange="receita[${index}].precoEmbalagem = this.value; atualizarTabela()">
      </td>

      <td>R$ ${item.custo.toFixed(2)}</td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("total").innerText = total.toFixed(2);
}
