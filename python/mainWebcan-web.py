from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import extrairGabarito as exG
import pickle

app = Flask(__name__)

# Função para carregar campos e respostas
def carregar_campos_respostas():
    try:
        with open('python/campos.pkl', 'rb') as arquivo:
            campos = pickle.load(arquivo)
        with open('python/resp.pkl', 'rb') as arquivo:
            respostas = pickle.load(arquivo)
        return campos, respostas
    except FileNotFoundError as e:
        raise Exception(f"Erro ao carregar arquivos: {e}")

# Função principal de processamento do gabarito
def processar_gabarito(imagem, campos, respostas, respostasCorretas):
    gabarito, _ = exG.extrairMaiorCtn(imagem)
    imgGray = cv2.cvtColor(gabarito, cv2.COLOR_BGR2GRAY)
    _, imgTh = cv2.threshold(imgGray, 70, 255, cv2.THRESH_BINARY_INV)

    respostas_lidas = []
    for id, vg in enumerate(campos):
        x, y, w, h = map(int, vg)
        campo = imgTh[y:y + h, x:x + w]
        tamanho = campo.shape[0] * campo.shape[1]
        pretos = cv2.countNonZero(campo)
        percentual = round((pretos / tamanho) * 100, 2)
        if percentual >= 15:
            respostas_lidas.append(respostas[id])

    acertos = sum(1 for r, c in zip(respostas_lidas, respostasCorretas) if r == c)
    erros = len(respostasCorretas) - acertos
    pontuacao = acertos * 6

    return {
        "respostas_lidas": respostas_lidas,
        "acertos": acertos,
        "erros": erros,
        "pontuacao": pontuacao
    }

@app.route('/processar', methods=['POST'])
def receber_imagem():
    try:
        # Decodificar a imagem Base64
        dados = request.json
        imagem_base64 = dados.get('imagem')
        imagem_decodificada = base64.b64decode(imagem_base64.split(",")[1])
        imagem = np.array(Image.open(BytesIO(imagem_decodificada)))

        # Carregar campos e respostas
        campos, respostas = carregar_campos_respostas()
        respostasCorretas = ["1-C", "2-B", "3-D", "4-A", "5-C"]

        # Processar a imagem
        resultado = processar_gabarito(imagem, campos, respostas, respostasCorretas)
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
