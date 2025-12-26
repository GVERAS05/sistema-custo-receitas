let receita = [];

function adicionarItem(nome){
  if(receita.find(i => i.nome === nome)) return;

  receita.push({
    nome,
    quantidade: 0,
    unidadeUso: "kg",
    tipoCompra: "kg",
    preco: 0,
    custo: 0
  });

  render();
}

function render(){
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  receita.forEach((item, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.nome}</td>

      <td>
        <input type="number" step="any" value="${item.quantidade}"
        onchange="setQuantidade(${i}, this.value)">
      </td>

      <td>
        <select onchange="setUnidade(${i}, this.value)">
          ${opcao("g", item.unidadeUso)}
          ${opcao("kg", item.unidadeUso)}
          ${opcao("ml", item.unidadeUso)}
          ${opcao("L", item.unidadeUso)}
        </select>
      </td>

      <td>
        <select onchange="setCompra(${i}, this.value)">
          ${opcao("kg", item.tipoCompra, "kg")}
          ${opcao("L", item.tipoCompra, "L")}
          ${opcao("s25", item.tipoCompra, "Saca 25 kg")}
          ${opcao("s50", item.tipoCompra, "Saca 50 kg")}
          ${opcao("s100", item.tipoCompra, "Saca 100 kg")}
          ${opcao("un", item.tipoCompra, "Unidade")}
        </select>
      </td>

      <td>
        <input type="number" step="any" value="${item.preco}"
        onchange="setPreco(${i}, this.value)">
      </td>

      <td>
        R$ ${item.custo.toFixed(2)}
        <br><br>
        <button onclick="removerItem(${i})"
          style="background:#d9534f;color:#fff;border:none;padding:4px 8px;">
          Remover
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  atualizarTotal();
}

function opcao(valor, atual, texto = valor){
  return `<option value="${valor}" ${valor === atual ? "selected" : ""}>${texto}</option>`;
}

function removerItem(index){
  receita.splice(index, 1);
  render();
}

function setQuantidade(i,v){ receita[i].quantidade = parseFloat(v)||0; calcular(i); }
function setUnidade(i,v){ receita[i].unidadeUso = v; calcular(i); }
function setCompra(i,v){ receita[i].tipoCompra = v; calcular(i); }
function setPreco(i,v){ receita[i].preco = parseFloat(v)||0; calcular(i); }

function paraBase(q,u){
  if(u==="g") return q/1000;
  if(u==="kg") return q;
  if(u==="ml") return q/1000;
  if(u==="L") return q;
  return q;
}

function fatorCompra(t){
  if(t==="kg"||t==="L") return 1;
  if(t==="s25") return 25;
  if(t==="s50") return 50;
  if(t==="s100") return 100;
  return 1;
}

function calcular(i){
  const it = receita[i];
  const base = paraBase(it.quantidade, it.unidadeUso);
  const fator = fatorCompra(it.tipoCompra);
  it.custo = (base / fator) * it.preco;
  render();
}

function atualizarTotal(){
  const total = receita.reduce((s,i)=>s+i.custo,0);
  document.getElementById("total").innerText = total.toFixed(2);
}
