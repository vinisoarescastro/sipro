let contadorDeQuestoes = 0;  // Contador para o número de questões

// Atualiza o número de questões na página
function atualizarContador() {
    document.getElementById('contador-questoes').innerText = `Nº de Questões: ${contadorDeQuestoes}`;
}

// Atualiza a numeração de cada questão para que fiquem em ordem sequencial
function atualizarNumeracaoQuestoes() {
    const questoes = document.querySelectorAll('#questoes-container .questao');
    questoes.forEach((questao, index) => {
        const numeroQuestao = questao.querySelector('.numero-questao');
        numeroQuestao.innerText = `Questão ${index + 1}`;
    });
}

// Adiciona um evento para o botão de adicionar questão
document.getElementById('adicionar-questao').addEventListener('click', function() {
    // Incrementa o número da questão
    contadorDeQuestoes++;

    // Cria um novo elemento de questão
    const questaoDiv = document.createElement('div');
    questaoDiv.classList.add('questao');

    // Adiciona o número da questão
    const numeroQuestao = document.createElement('p');
    numeroQuestao.classList.add('numero-questao');
    numeroQuestao.innerText = `Questão ${contadorDeQuestoes}`;
    questaoDiv.appendChild(numeroQuestao);

    // Cria um seletor para o tipo de questão
    const tipoQuestaoLabel = document.createElement('label');
    tipoQuestaoLabel.innerText = 'Tipo de Questão:';
    const tipoQuestaoSelect = document.createElement('select');
    tipoQuestaoSelect.name = 'tipo-questao[]';
    tipoQuestaoSelect.innerHTML = `
        <option value="multipla-escolha">Múltipla Escolha</option>
        <option value="verdadeiro-falso">Verdadeiro ou Falso</option>
    `;
    tipoQuestaoLabel.appendChild(tipoQuestaoSelect);

    // Cria um campo para o título da questão
    const tituloQuestaoLabel = document.createElement('label');
    tituloQuestaoLabel.innerText = 'Enunciado da Questão:';
    const tituloQuestaoInput = document.createElement('input');
    tituloQuestaoInput.type = 'text';
    tituloQuestaoInput.name = 'titulo-questao[]';
    tituloQuestaoInput.placeholder = 'Digite o enunciado da questão';
    tituloQuestaoLabel.appendChild(tituloQuestaoInput);

    // Cria um contêiner para alternativas (para Múltipla Escolha)
    const alternativasDiv = document.createElement('div');
    alternativasDiv.classList.add('alternativas');

    // Cria um campo de alternativas com 4 inputs por padrão
    for (let i = 1; i <= 5; i++) {
        const alternativaInput = document.createElement('input');
        alternativaInput.type = 'text';
        alternativaInput.name = `alternativa-${i}[]`;
        alternativaInput.placeholder = `Alternativa ${i}`;
        alternativasDiv.appendChild(alternativaInput);
    }

    // Mostra as alternativas somente se a questão for de múltipla escolha
    tipoQuestaoSelect.addEventListener('change', function() {
        if (tipoQuestaoSelect.value === 'multipla-escolha') {
            alternativasDiv.style.display = 'block';
        } else {
            alternativasDiv.style.display = 'none';
        }
    });

    // Inicializa com as alternativas visíveis para Múltipla Escolha
    alternativasDiv.style.display = 'block';

    // Cria o botão de remover questão
    const removerBtn = document.createElement('button');
    removerBtn.type = 'button';
    removerBtn.innerText = 'Remover Questão';
    removerBtn.classList.add('remover-btn');

    // Adiciona a funcionalidade de remover a questão
    removerBtn.addEventListener('click', function() {
        questaoDiv.remove();
        contadorDeQuestoes--;  // Decrementa o contador
        atualizarContador();  // Atualiza a contagem de questões
        atualizarNumeracaoQuestoes(); // Atualiza a numeração das questões
    });

    // Adiciona os elementos criados ao contêiner da questão
    questaoDiv.appendChild(tipoQuestaoLabel);
    questaoDiv.appendChild(tituloQuestaoLabel);
    questaoDiv.appendChild(alternativasDiv);
    questaoDiv.appendChild(removerBtn); // Adiciona o botão de remover

    // Adiciona a questão ao contêiner de questões
    document.getElementById('questoes-container').appendChild(questaoDiv);

    // Atualiza a contagem de questões e a numeração na página
    atualizarContador();
    atualizarNumeracaoQuestoes();
});

// Inicializa o contador na página
atualizarContador();
