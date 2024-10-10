document.getElementById('startReading').addEventListener('click', async () => {
    // Aqui você deve fazer uma chamada ao seu código Python
    // que faz a leitura do gabarito e retorna as respostas
    const response = await fetch('/ler_gabarito', { method: 'POST' });
    const data = await response.json();

    // Verifica se a resposta é bem-sucedida
    if (response.ok) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `Pontuação: ${data.pontuacao} pontos<br>Acertos: ${data.acertos}<br>Erros: ${data.erros}`;
    } else {
        alert('Erro ao ler o gabarito. Tente novamente.');
    }
});
