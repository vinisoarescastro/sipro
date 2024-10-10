import cv2
import pickle
import extrairGabarito as exG

def ler_gabarito():
    campos = []                                 
    with open('campos.pkl', 'rb') as arquivo:
        campos = pickle.load(arquivo)

    resp = []                                   
    with open('resp.pkl', 'rb') as arquivo:
        resp = pickle.load(arquivo)

    respostasCorretas = ["1-C","2-B","3-D","4-A","5-C"]  # Respostas corretas

    video = cv2.VideoCapture(0)                 # Abre a câmera

    while True:  # Loop principal                                             
        _, imagem = video.read()  # Captura a imagem                             
        imagem = cv2.resize(imagem, (600, 700))  # Redimensiona a imagem             
        gabarito, bbox = exG.extrairMaiorCtn(imagem)  # Extrai o maior contorno       
        imgGray = cv2.cvtColor(gabarito, cv2.COLOR_BGR2GRAY)  # Converte para cinza
        ret, imgTh = cv2.threshold(imgGray, 70, 255, cv2.THRESH_BINARY_INV)  # Binariza

        respostas = []  # Lista de respostas lidas
        for id, vg in enumerate(campos): 
            x = int(vg[0])              
            y = int(vg[1])              
            w = int(vg[2])              
            h = int(vg[3])              

            # Desenhar campos
            campo = imgTh[y:y + h, x:x + w] 
            height, width = campo.shape[:2] 
            tamanho = height * width        
            pretos = cv2.countNonZero(campo)
            percentual = round((pretos / tamanho) * 100, 2)

            if percentual >= 15:  # Se 15% do campo estiver preenchido
                respostas.append(resp[id])  # Adiciona resposta lida

        # Verifica se todas as respostas foram identificadas
        if len(respostas) == len(respostasCorretas):
            erros = 0
            acertos = 0

            # Comparar respostas lidas com as respostas corretas
            for num, res in enumerate(respostas):
                if res == respostasCorretas[num]:
                    acertos += 1
                else:
                    erros += 1

            pontuacao = int(acertos * 6)  # Calcula a pontuação

            # Mostra na imagem (opcional)
            cv2.putText(imagem, f'ACERTOS: {acertos}, PONTOS: {pontuacao}', (30, 140), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
            cv2.imshow('img', imagem)

            # Retorna as informações
            return respostas, acertos, erros, pontuacao

        # Exibe a imagem
        cv2.imshow('img', imagem)

        # Condição de parada (tecla 'q' para sair)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Chama a função para ler o gabarito e processar as respostas
respostas_lidas, acertos, erros, pontuacao = ler_gabarito()
print(f"As respostas lidas foram: {respostas_lidas}")
print(f"Pontuação final: {pontuacao} pontos, {acertos} acertos, {erros} erros")
