let receita = [];

function adicionarIngrediente(ingrediente) {
  let item = {
    nome: ingrediente.nome,
    unidade: ingrediente.unidade,
    quantidade: 0,
    custo: 0
  };

  receita.push(item);
  atualizarTabela();
}

function atualizarTabela() {
  let tbody = document.getElementById("receita");
  tbody.innerHTML = "";

  let total = 0;

  receita.forEach((item, index) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>
        <input type="number" 
               onchange="receita[${index}].quantidade = this.value">
      </td>
      <td>${item.unidade}</td>
      <td>
        <input type="number" 
               onchange="atualizarCusto(${index}, this.value)">
      </td>
    `;

    tbody.appendChild(tr);
    total += item.custo;
  });

  document.getElementById("total").innerText = total.toFixed(2);
}

function atualizarCusto(index, valor) {
  receita[index].custo = parseFloat(valor) || 0;
  atualizarTabela();
}
