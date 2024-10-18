import cv2  
import numpy as np  # Importa a biblioteca NumPy, que é útil para operações matemáticas e manipulação de arrays (estruturas de dados similares a matrizes).

def extrairMaiorCtn(img):  # Define a função 'extrairMaiorCtn', que recebe uma imagem como parâmetro.

    # Converte a imagem de BGR (formato padrão do OpenCV) para escala de cinza (grayscale).
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  

    # Aplica um threshold adaptativo (limiar adaptativo) para segmentar a imagem.
    # O valor de cada pixel é ajustado com base nos pixels vizinhos, criando uma imagem binária (preto e branco).
    imgTh = cv2.adaptiveThreshold(imgGray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                  cv2.THRESH_BINARY_INV, 11, 12)
    # Parâmetros da função:
    # - 255 é o valor máximo para os pixels que são binarizados.
    # - cv2.ADAPTIVE_THRESH_GAUSSIAN_C usa a média ponderada da vizinhança para calcular o threshold.
    # - cv2.THRESH_BINARY_INV inverte os valores (preto e branco).
    # - 11 é o tamanho da vizinhança, e 12 é uma constante subtraída da média calculada.

    # Cria uma matriz de 2x2 com valores 1, que é usada como 'kernel' para a dilatação (dilatar os contornos).
    kernel = np.ones((2,2), np.uint8)

    # Aplica a dilatação na imagem binarizada para "engrossar" os contornos.
    # A dilatação ajuda a preencher lacunas nos contornos detectados.
    imgDil = cv2.dilate(imgTh, kernel)

    # Encontra os contornos na imagem dilatada.
    # - cv2.RETR_EXTERNAL: apenas os contornos externos são detectados.
    # - cv2.CHAIN_APPROX_NONE: todos os pontos do contorno são armazenados (não há compressão dos pontos).
    contours, hi = cv2.findContours(imgDil, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    # Identifica o maior contorno da imagem, com base na área do contorno.
    # A função 'max' usa 'cv2.contourArea' para determinar qual contorno tem a maior área.
    maiorCtn = max(contours, key=cv2.contourArea)

    # Calcula o retângulo delimitador (bounding box) ao redor do maior contorno.
    # Retorna as coordenadas (x, y) do canto superior esquerdo, além da largura (w) e altura (h) do retângulo.
    x, y, w, h = cv2.boundingRect(maiorCtn)

    # Cria uma lista contendo as coordenadas do retângulo: [x, y, w, h].
    bbox = [x, y, w, h]

    # Recorta a parte da imagem original que corresponde ao maior contorno.
    # O recorte é feito a partir das coordenadas e dimensões (x, y, w, h).
    recorte = img[y:y+h, x:x+w]

    # Redimensiona o recorte para um tamanho fixo de 400x500 pixels.
    recorte = cv2.resize(recorte, (400, 500))

    # Retorna o recorte da imagem e as coordenadas do retângulo delimitador (bounding box).
    return recorte, bbox
