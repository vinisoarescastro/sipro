document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.querySelector('.camera video');
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera: ", err);
            document.getElementById('resultado').innerText = "Erro ao acessar a câmera.";
        });
});


async function enviarImagem() {
    const cameraElement = document.querySelector('.camera video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = cameraElement.videoWidth;
    canvas.height = cameraElement.videoHeight;
    context.drawImage(cameraElement, 0, 0, canvas.width, canvas.height);

    const imagem = canvas.toDataURL('image/png'); // Converte a imagem em Base64

    try {
        const response = await fetch('http://127.0.0.1:5000/processar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imagem })
        });

        const resultado = await response.json(); // Aguarda a resposta do servidor

        // Exibe os resultados na página
        const resultadoDiv = document.getElementById('resultado');
        if (resultado.acertos !== undefined) {
            resultadoDiv.innerHTML = `
                <strong>Resultados:</strong><br>
                Acertos: ${resultado.acertos}<br>
                Erros: ${resultado.erros}<br>
                Pontuação: ${resultado.pontuacao}
            `;
        } else {
            resultadoDiv.innerHTML = `<strong>Erro:</strong> ${resultado.erro}`;
        }
    } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
        document.getElementById('resultado').innerText = 'Erro ao processar a imagem.';
    }

    console.log(cameraElement)
}
