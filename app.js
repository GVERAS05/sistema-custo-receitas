let receita = [];
let margem = 0;

function converterParaBase(valor, unidade) {
  if (unidade === "kg" || unidade === "L") return valor * 1000;
  return valor;
}

function adicionarIngrediente(ingrediente) {
  // ❌ Bloqueia duplicação
  if (receita.some(i => i.nome === ingrediente.nome)) {
    alert("Este ingrediente já foi adicionado.");
    return;
  }

  receita.push({
    nome: ingrediente.nome,
    qtdUsada: "",
    unUsada: "g",
    qtdEmbalagem: "",
    unEmbalagem: "g",
    precoEmbalagem: "",
    custo: 0
  });

  atualizar();
}

function calcularCusto(item) {
  if (item.qtdUsada && item.qtdEmbalagem && item.precoEmbalagem) {
    let usada = converterParaBase(parseFloat(item.qtdUsada), item.unUsada);
    let embalagem = converterParaBase(parseFloat(item.qtdEmbalagem), item.unEmbalagem);

    item.custo = (item.precoEmbalagem / embalagem) * usada;
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
        <input type="number" value="${item.qtdUsada}"
          oninput="receita[${index}].qtdUsada = this.value; atualizar()">
        <select value="${item.unUsada}"
          onchange="receita[${index}].unUsada = this.value; atualizar()">
          <option value="g" ${item.unUsada==="g"?"selected":""}>g</option>
          <option value="kg" ${item.unUsada==="kg"?"selected":""}>kg</option>
          <option value="ml" ${item.unUsada==="ml"?"selected":""}>ml</option>
          <option value="L" ${item.unUsada==="L"?"selected":""}>L</option>
        </select>
      </td>

      <td>
        <input type="number" value="${item.qtdEmbalagem}"
          oninput="receita[${index}].qtdEmbalagem = this.value; atualizar()">
        <select
          onchange="receita[${index}].unEmbalagem = this.value; atualizar()">
          <option value="g" ${item.unEmbalagem==="g"?"selected":""}>g</option>
          <option value="kg" ${item.unEmbalagem==="kg"?"selected":""}>kg</option>
          <option value="ml" ${item.unEmbalagem==="ml"?"selected":""}>ml</option>
          <option value="L" ${item.unEmbalagem==="L"?"selected":""}>L</option>
        </select>
      </td>

      <td>
        <input type="number" value="${item.precoEmbalagem}"
          oninput="receita[${index}].precoEmbalagem = this.value; atualizar()">
      </td>

      <td>R$ ${item.custo.toFixed(2)}</td>
    `;

    tbody.appendChild(tr);
  });

  document.getElementById("custoTotal").innerText = custoTotal.toFixed(2);

  let precoVenda = margem > 0 && margem < 100
    ? custoTotal / (1 - margem / 100)
    : 0;

  document.getElementById("precoVenda").innerText = precoVenda.toFixed(2);
}

function atualizarMargem(valor) {
  margem = parseFloat(valor) || 0;
  atualizar();
  }
