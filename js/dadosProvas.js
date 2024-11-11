document.querySelector('.styled-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Coletar os dados do formulário
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const data = document.getElementById('data').value;
    const turno = document.getElementById('turno').value;

    const questoes = [];
    document.querySelectorAll('#questoes-container .questao').forEach(questao => {
        const tituloQuestao = questao.querySelector('input[name="titulo-questao[]"]').value;
        const tipoQuestao = questao.querySelector('select[name="tipo-questao[]"]').value;
        const alternativas = [];
        if (tipoQuestao === "multipla-escolha") {
            questao.querySelectorAll('.alternativas input').forEach(input => {
                if (input.value) alternativas.push(input.value);
            });
        }
        questoes.push({ titulo: tituloQuestao, tipo: tipoQuestao, alternativas });
    });

    const dados = { titulo, descricao, data, turno, questoes };

    try {
        // Enviar dados para o backend e obter a resposta
        const response = await fetch('http://127.0.0.1:5000/gerar-prova', { // URL do servidor Flask
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        // Verificar se a resposta foi bem-sucedida
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'prova_gerada.pdf'; // Nome do arquivo
            a.click();

            // Exibir a mensagem de sucesso
            alert('Download Concluído!');
        } else {
            console.error('Erro ao gerar a prova.');
            alert('Erro ao gerar a prova. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro na comunicação com o servidor:', error);
        alert('Erro na comunicação com o servidor. Tente novamente.');
    }
});
