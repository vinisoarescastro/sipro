// Seleciona o vídeo e o botão de captura
const video = document.getElementById('video');
const captureButton = document.getElementById('capture-button');
const resultArea = document.getElementById('result');

// Acessa a câmera do dispositivo
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream; // Define a fonte do vídeo como a câmera
    })
    .catch(err => {
        console.error("Erro ao acessar a câmera: ", err);
    });

// Função para capturar a imagem do vídeo e reconhecer o texto
captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas'); // Cria um canvas temporário
    const context = canvas.getContext('2d');

    // Define o tamanho do canvas para o tamanho do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte o canvas em uma imagem
    const imageData = canvas.toDataURL('image/png');

    // Utiliza Tesseract.js para reconhecer o texto
    resultArea.innerText = "Processando...";
    
    Tesseract.recognize(
        imageData,
        'por', // Define o idioma como português
        {
            logger: info => console.log(info) // Log para acompanhar o progresso
        }
    ).then(({ data: { text } }) => {
        // Verifica se o texto reconhecido não está vazio
        if (text.trim()) {
            resultArea.innerText = text; // Exibe o texto reconhecido
        } else {
            resultArea.innerText = "Nenhum texto reconhecido.";
        }
    }).catch(err => {
        console.error("Erro:", err);
        resultArea.innerText = "Erro ao processar a imagem.";
    });
});
