let receita = [];
let margem = 0;

function paraBase(valor, unidade) {
  if (unidade === "kg" || unidade === "L") return valor * 1000;
  return valor; // g, ml, un
}

function pesoCompra(tipo) {
  if (tipo === "saca25") return 25000;
  if (tipo === "saca50") return 50000;
  if (tipo === "saca100") return 100000;
  return 1000; // kg ou L
}

function adicionarIngrediente(ing) {
  if (receita.some(i => i.nome === ing.nome)) {
    alert("Item já adicionado.");
    return;
  }

  receita.push({
    nome: ing.nome,
    tipo: ing.tipo,
    qtdUsada: "",
    unUsada: "g",

    tipoCompra: "kg", // saca25, saca50, saca100, kg, L
    precoCompra: "",

    custo: 0
  });

  atualizar();
}

function calcular(item) {
  if (!item.qtdUsada || !item.precoCompra) {
    item.custo = 0;
    return;
  }

  if (item.tipo === "insumo") {
    let usada = paraBase(parseFloat(item.qtdUsada), item.unUsada);
    let totalCompra = pesoCompra(item.tipoCompra);
    let custoBase = item.precoCompra / totalCompra;

    item.custo = usada * custoBase;
  }

  if (item.tipo === "embalagem") {
    item.custo = item.qtdUsada * item.precoCompra;
  }
}

function atualizar() {
  let tbody = document.getElementById("receita");
  tbody.innerHTML = "";
  let total = 0;

  receita.forEach((item, i) => {
    calcular(item);
    total += item.custo;

    let tr = document.createElement("tr");

    if (item.tipo === "insumo") {
      tr.innerHTML = `
        <td>${item.nome}</td>

        <td>
          <input type="number" value="${item.qtdUsada}"
            oninput="receita[${i}].qtdUsada=this.value; atualizar()">
          <select onchange="receita[${i}].unUsada=this.value; atualizar()">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
          </select>
        </td>

        <td>
          <select onchange="receita[${i}].tipoCompra=this.value; atualizar()">
            <option value="saca25">Saca 25 kg</option>
            <option value="saca50">Saca 50 kg</option>
            <option value="saca100">Saca 100 kg</option>
            <option value="kg">Kg</option>
            <option value="L">Litro</option>
          </select>
        </td>

        <td>
          <input type="number" value="${item.precoCompra}"
            oninput="receita[${i}].precoCompra=this.value; atualizar()">
        </td>

        <td>R$ ${item.custo.toFixed(2)}</td>
      `;
    } else {
      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>
          <input type="number" value="${item.qtdUsada}"
            oninput="receita[${i}].qtdUsada=this.value; atualizar()">
        </td>
        <td colspan="2">
          <input type="number" value="${item.precoCompra}"
            oninput="receita[${i}].precoCompra=this.value; atualizar()">
        </td>
        <td>R$ ${item.custo.toFixed(2)}</td>
      `;
    }

    tbody.appendChild(tr);
  });

  document.getElementById("custoTotal").innerText = total.toFixed(2);

  let venda = margem > 0 && margem < 100 ? total / (1 - margem / 100) : 0;
  document.getElementById("precoVenda").innerText = venda.toFixed(2);
}

function atualizarMargem(v) {
  margem = parseFloat(v) || 0;
  atualizar();
}
