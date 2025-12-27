// receitas.js

// Recupera receitas salvas no localStorage ou inicializa vazio
let receitasSalvas = JSON.parse(localStorage.getItem("receitasSalvas")) || {};

// Salva uma receita nova ou atualizada
function salvarReceita(nomeReceita, itens) {
    if (!nomeReceita || itens.length === 0) return;
    receitasSalvas[nomeReceita] = itens;
    localStorage.setItem("receitasSalvas", JSON.stringify(receitasSalvas));
}

// Carrega todas as receitas salvas
function carregarReceitas() {
    return receitasSalvas;
}

// Deleta uma receita
function deletarReceita(nomeReceita) {
    delete receitasSalvas[nomeReceita];
    localStorage.setItem("receitasSalvas", JSON.stringify(receitasSalvas));
}
