import cv2
import pickle
import extrairGabarito as exG


campos = []                                 # lista para armazenar os campos
with open('campos.pkl', 'rb') as arquivo:   # abre o arquivo
    campos = pickle.load(arquivo)           # carrega os campos

resp = []                                   # lista para armazenar as respostas
with open('resp.pkl', 'rb') as arquivo:     # abre o arquivo
    resp = pickle.load(arquivo)             # carrega as respostas

respostasCorretas = ["1-C","2-B","3-D","4-A","5-C"]  # respostas corretas

video = cv2.VideoCapture(0)                 # abre a câmera

while True:                                             # loop infinito    
    _,imagem = video.read()                             # captura a imagem
    imagem = cv2.resize(imagem,(600,700))               # redimensiona a imagem
    gabarito,bbox = exG.extrairMaiorCtn(imagem)         # extrai o maior contorno
    imgGray = cv2.cvtColor(gabarito, cv2.COLOR_BGR2GRAY)# converte para cinza
    ret,imgTh = cv2.threshold(imgGray,70,255,cv2.THRESH_BINARY_INV) # binariza
    cv2.rectangle(imagem, (bbox[0], bbox[1]), (bbox[0] + bbox[2], bbox[1] + bbox[3]), (0, 255,0), 3) # desenha o contorno
    respostas = []
    for id,vg in enumerate(campos): # faz a leitura de cada campo
        x = int(vg[0])              # identifica as coordenadas
        y = int(vg[1])              # de cada campo
        w = int(vg[2])              # e recorta a imagem
        h = int(vg[3])              # para analisar
        cv2.rectangle(gabarito, (x, y), (x + w, y + h),(0,0,255),2)     # desenha o campo
        cv2.rectangle(imgTh, (x, y), (x + w, y + h), (255, 255, 255), 1)# desenha o campo
        campo = imgTh[y:y + h, x:x + w] # recorta a imagem
        height, width = campo.shape[:2] # pega as dimensões
        tamanho = height * width        # calcula o tamanho
        pretos = cv2.countNonZero(campo)# conta os pixels pretos
        percentual = round((pretos / tamanho) * 100, 2) # calcula o percentual
        if percentual >=15:     # 15% preenchido para considerar marcado
            cv2.rectangle(gabarito, (x, y), (x + w, y + h), (255, 0, 0), 2) # desenha o campo
            respostas.append(resp[id]) # adiciona a resposta

    #print(respostas)
    erros = 0
    acertos = 0
    if len(respostas)==len(respostasCorretas):  # verifica se todas as questões foram respondidas
        for num,res in enumerate(respostas):    # compara as respostas
            if res == respostasCorretas[num]:   # com as respostas corretas
                #print(f'{res} Verdadeiro, correto: {respostasCorretas[num]}')
                acertos +=1
            else:
                #print(f'{res} Falso, correto: {respostasCorretas[num]}')
                erros +=1

        pontuacao = int(acertos *6) # multiplica o número de acertos por 6
        cv2.putText(imagem,f'ACERTOS: {acertos}, PONTOS: {pontuacao}',(30,140),cv2.FONT_HERSHEY_SIMPLEX,1.2,(0,0,255),3)
        # exibe a pontuação

    cv2.imshow('img',imagem)            # exibe a imagem
    cv2.imshow('Gabarito', gabarito)    # exibe o gabarito
    cv2.imshow('IMG TH', imgTh)         # exibe a imagem binarizada
    cv2.waitKey(1)                      