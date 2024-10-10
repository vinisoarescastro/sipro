from flask import Flask, jsonify, request
import cv2
import pickle
import extrairGabarito as exG

app = Flask(__name__)

@app.route('/ler_gabarito', methods=['POST'])
def ler_gabarito():
    # Aqui você chamaria a função que lê o gabarito
    # E, conforme o seu código, retornaria as informações
    # Exemplo:
    campos = []
    with open('campos.pkl', 'rb') as arquivo:
        campos = pickle.load(arquivo)

    resp = []
    with open('resp.pkl', 'rb') as arquivo:
        resp = pickle.load(arquivo)

    respostasCorretas = ["1-C","2-B","3-D","4-A","5-C"]
    video = cv2.VideoCapture(0)

    # Lógica de leitura do gabarito
    # Aqui deve ter o código do seu sistema de leitura...
    # Para fins de simplicidade, vamos simular uma resposta:
    acertos = 4
    erros = 1
    pontuacao = acertos * 6

    return jsonify({
        'acertos': acertos,
        'erros': erros,
        'pontuacao': pontuacao
    })

if __name__ == '__main__':
    app.run(debug=True)
