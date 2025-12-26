let itens = [];

function adicionarItem(item){
  if(itens.find(i=>i.nome===item.nome)) return;

  itens.push({
    nome: item.nome,
    qtd: 0,
    unidadeUso: "kg",
    tipoCompra: "kg",
    preco: 0,
    custo: 0
  });

  render();
}

function render(){
  const tb=document.getElementById("tabela");
  tb.innerHTML="";

  itens.forEach((i,idx)=>{
    const tr=document.createElement("tr");

    tr.innerHTML=`
    <td>${i.nome}</td>

    <td>
      <input type="number" step="any" onchange="setQtd(${idx},this.value)">
    </td>

    <td>
      <select onchange="setUnidade(${idx},this.value)">
        <option>g</option>
        <option>kg</option>
        <option>ml</option>
        <option>L</option>
      </select>
    </td>

    <td>
      <select onchange="setCompra(${idx},this.value)">
        <option value="kg">kg</option>
        <option value="L">L</option>
        <option value="s25">Saca 25 kg</option>
        <option value="s50">Saca 50 kg</option>
        <option value="s100">Saca 100 kg</option>
        <option value="un">Unidade</option>
      </select>
    </td>

    <td>
      <input type="number" step="any" onchange="setPreco(${idx},this.value)">
    </td>

    <td>R$ ${i.custo.toFixed(2)}</td>
    `;
    tb.appendChild(tr);
  });

  atualizarTotal();
}

function setQtd(i,v){ itens[i].qtd=parseFloat(v)||0; calcular(i); }
function setUnidade(i,v){ itens[i].unidadeUso=v; calcular(i); }
function setCompra(i,v){ itens[i].tipoCompra=v; calcular(i); }
function setPreco(i,v){ itens[i].preco=parseFloat(v)||0; calcular(i); }

function converterParaBase(q,u){
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
  if(t==="un") return 1;
}

function calcular(i){
  const it=itens[i];
  const base=converterParaBase(it.qtd,it.unidadeUso);
  const fator=fatorCompra(it.tipoCompra);
  it.custo=(base/fator)*it.preco;
  render();
}

function atualizarTotal(){
  const total=itens.reduce((s,i)=>s+i.custo,0);
  document.getElementById("total").innerText=total.toFixed(2);
}
