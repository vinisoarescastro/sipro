# Como Rodar o SIPRO

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Python | 3.8 ou superior |
| Node.js | 18 ou superior |
| npm | 9 ou superior |

Instale as dependências uma única vez antes de rodar pela primeira vez:

```bash
# Dependências Python
pip install flask flask-cors fpdf opencv-python numpy pillow qrcode

# Dependências do frontend
cd sipro-app
npm install
```

---

## Iniciar tudo com um comando

Na raiz do projeto, dê um duplo clique em **`start.bat`** ou execute no terminal:

```bat
start.bat
```

Aguarde alguns segundos e acesse:

**http://localhost:3000**

> Credenciais: CPF `12345678900` / Senha `12345678`

O script abre as duas APIs Python em janelas minimizadas e inicia o frontend no terminal atual. Para encerrar, feche as janelas das APIs e pressione `Ctrl+C` no terminal do frontend.

---

## Iniciar manualmente (alternativa)

Caso prefira controle individual, abra três terminais separados:

**Terminal 1 — API de Questões e Avaliações (porta 5001)**
```bash
cd python/questoes
python app.py
```

**Terminal 2 — API de Correção Automática (porta 5000)**
```bash
cd python
python mainWebcan-web.py
```

**Terminal 3 — Frontend React**
```bash
cd sipro-app
npm run dev
```

---

## Funcionalidades disponíveis

| Módulo | Tela | Status | Depende de |
|---|---|---|---|
| Questões | Cadastrar Questão | Implementado | API porta 5001 |
| Avaliações | Criar Avaliação + Gerar PDF | Implementado | API porta 5001 |
| Correções | Correção Automática (câmera) | Implementado | API porta 5000 |
| Questões | Consultar / Editar / Excluir / Importar | Em desenvolvimento | — |
| Avaliações | Consultar / Editar / Desempenho | Em desenvolvimento | — |
| Correções | Manual / Ajustar / Revisão / Histórico | Em desenvolvimento | — |
| Relatórios | Todos | Em desenvolvimento | — |
