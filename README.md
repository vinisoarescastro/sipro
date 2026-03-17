# 📋 SIPRO — Sistema de Provas com QR Code
### Secretaria de Educação do Estado de Goiás (SEDUC-GO)

> Plataforma para criação, aplicação e correção automatizada de provas, com suporte a QR Code e leitura de gabarito via câmera.

---

## 📌 Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Instalação e Configuração](#instalação-e-configuração)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo de Uso](#fluxo-de-uso)
- [Módulos Python](#módulos-python)
- [Frontend (HTML/CSS/JS)](#frontend-htmlcssjs)
- [Observações de Segurança](#observações-de-segurança)
- [Melhorias Futuras](#melhorias-futuras)

---

## 🎯 Visão Geral

O **SIPRO** é um sistema web voltado para a gestão de avaliações educacionais da SEDUC-GO. Ele permite que professores e coordenadores criem provas, imprimam gabaritos com QR Code e realizem a correção automática das respostas via câmera, usando visão computacional.

O sistema é composto por:
- **Frontend Web** (HTML, CSS, JavaScript)
- **Backend Python** com dois servidores Flask independentes
- **Módulo de Visão Computacional** com OpenCV
- **Gerador de QR Codes** para identificação de alunos

---

## ✅ Funcionalidades

### Implementadas
- [x] Tela de login com autenticação (CPF ou e-mail + senha)
- [x] Dashboard principal com menu de navegação categorizado
- [x] Criação de avaliações com título, data, turno, descrição e questões
- [x] Suporte a questões de múltipla escolha (5 alternativas) e verdadeiro/falso
- [x] Adição e remoção dinâmica de questões via JavaScript
- [x] Geração de provas em PDF com cabeçalho institucional (logo SEDUC), instruções, questões e rodapé com numeração de páginas
- [x] Correção automática de gabarito via câmera (webcam desktop com OpenCV)
- [x] Correção automática via câmera no navegador (captura e envio da imagem ao servidor Flask)
- [x] Geração de QR Codes com nome e matrícula do aluno
- [x] Layout responsivo para dispositivos móveis

### Planejadas (menu disponível, funcionalidade pendente)
- [ ] Cadastro, consulta, edição, exclusão e importação de questões
- [ ] Consulta, edição e análise de desempenho de avaliações
- [ ] Correção manual e ajuste de notas
- [ ] Revisão de respostas e histórico de correções
- [ ] Relatórios de desempenho individual e geral
- [ ] Gráficos e visualizações de dados
- [ ] Gestão de turmas e alunos
- [ ] Aplicação de provas online

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização modular por componente |
| JavaScript (Vanilla) | Interatividade, validação e chamadas à API |
| Bootstrap Icons 1.10.5 | Ícones da interface (via CDN) |

### Backend
| Tecnologia | Uso |
|---|---|
| Python 3.x | Linguagem principal do backend |
| Flask | Servidor web e API REST |
| Flask-CORS | Liberação de requisições cross-origin |
| fpdf | Geração de arquivos PDF |

### Visão Computacional
| Tecnologia | Uso |
|---|---|
| OpenCV (cv2) | Processamento de imagem e leitura de gabarito |
| NumPy | Operações matriciais sobre imagens |
| Pillow (PIL) | Conversão de imagem Base64 para array |
| pickle | Serialização dos campos e respostas do gabarito |

### QR Code
| Tecnologia | Uso |
|---|---|
| qrcode | Geração de QR Codes para identificação de alunos |

---

## 📁 Estrutura do Projeto

```
sipro/
│
├── html/
│   ├── index-login.html                  # Página de login
│   ├── principal.html                    # Dashboard principal
│   ├── principal-avaliacao-criar.html    # Criação de avaliações
│   └── principal-correcao-automatica.html# Correção automática via câmera
│
├── css/
│   ├── global.css                        # Reset, variáveis CSS e body global
│   ├── style-login.css                   # Estilos da página de login
│   ├── style-geral-interface.css         # Container .interface (max-width 1280px)
│   ├── style-geral-footer.css            # Estilos do rodapé
│   ├── style-geral-footer-resposivo.css  # Responsividade do rodapé
│   ├── style-geral-nav-menu.css          # Menu de navegação com submenus
│   ├── style-section-header.css          # Cabeçalho azul institucional
│   ├── style-section-usuario.css         # Barra de usuário logado
│   ├── style-section-usuario-resposivo.css# Responsividade da barra de usuário
│   ├── style-principal-hero.css          # Seção hero da página principal
│   ├── style-principal-hero-responsivo.css# Responsividade do hero
│   ├── style-section-hero-questoes.css   # Seção de questões com cards
│   ├── style-principal-hero-avaliacao-criar.css # Formulário de criação
│   └── style-principal-correcao-automatica.css  # Tela de correção automática
│
├── js/
│   ├── validacaoLogin.js     # Validação e submissão do formulário de login
│   ├── adicionarQuestao.js   # Adição/remoção dinâmica de questões no formulário
│   ├── dadosProvas.js        # Coleta dados do formulário e envia ao Flask (PDF)
│   └── ativarCamera.js       # Acessa webcam, captura frame e envia ao Flask
│
├── python/
│   ├── extrairGabarito.py       # Módulo de extração do maior contorno (gabarito)
│   ├── mainWebcan.py            # Correção via webcam desktop (loop contínuo)
│   ├── mainWebcan-stop.py       # Correção via webcam com condição de parada
│   ├── mainWebcan-web.py        # Servidor Flask para correção via navegador
│   ├── campos.pkl               # (gerado) Coordenadas dos campos do gabarito
│   ├── resp.pkl                 # (gerado) Mapeamento de campos para respostas
│   └── gerarProvas/
│       └── app.py               # Servidor Flask para geração de PDFs de prova
│
├── qr_codes/
│   └── gerar-qr-codes.py        # Gera QR Codes com nome e matrícula do aluno
│
├── img/
│   ├── logos/                   # Logos SEDUC e Governo de Goiás
│   ├── backgrounds/             # Imagem de fundo (fachada SEDUC)
│   ├── icon-usuario/            # Foto e ícone do usuário
│   └── loja-apps/               # Badges Google Play e App Store
│
└── README.md
```

---

## 🏗️ Arquitetura do Sistema

```
┌────────────────────────────────────────────────────────┐
│                     NAVEGADOR (Cliente)                │
│                                                        │
│  index-login.html ──► principal.html                   │
│       │                    │                           │
│       │            ┌───────┴────────┐                  │
│       │     avaliacao-criar.html    correcao-auto.html  │
│       │            │                      │            │
│  validacaoLogin.js  dadosProvas.js   ativarCamera.js   │
└───────┼────────────┼──────────────────────┼────────────┘
        │            │ POST /gerar-prova     │ POST /processar
        │     ┌──────▼──────┐        ┌──────▼──────┐
        │     │  Flask API  │        │  Flask API  │
        │     │ gerarProvas │        │mainWebcan-  │
        │     │   /app.py   │        │  web.py     │
        │     │  porta 5000 │        │  porta 5000 │
        │     └──────┬──────┘        └──────┬──────┘
        │            │ FPDF                 │ OpenCV
        │            ▼                      ▼
        │       Prova em PDF         Leitura do Gabarito
        │       (download)           + Cálculo da Nota
        ▼
   Login local (credencial hardcoded — ver Segurança)
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- Python 3.8+
- pip
- Navegador moderno com suporte a `getUserMedia` (para câmera)

### 1. Clone o repositório

```bash
git clone https://github.com/vinisoarescastro/sipro.git
cd sipro
```

### 2. Instale as dependências Python

```bash
pip install flask flask-cors fpdf opencv-python numpy pillow qrcode
```

### 3. Inicie o servidor de geração de provas

```bash
cd python/gerarProvas
python app.py
# Servidor disponível em: http://127.0.0.1:5000
```

### 4. Inicie o servidor de correção automática (em outro terminal)

```bash
cd python
python mainWebcan-web.py
# Servidor disponível em: http://127.0.0.1:5000
```

> ⚠️ **Atenção:** Os dois servidores utilizam a mesma porta (5000). Para rodar ambos simultaneamente, configure portas diferentes (ex.: 5000 e 5001) e atualize as URLs nos arquivos JS correspondentes.

### 5. Abra o frontend

Sirva os arquivos HTML com qualquer servidor estático. Exemplo com Python:

```bash
# Na raiz do projeto
python -m http.server 8080
# Acesse: http://localhost:8080/html/index-login.html
```

### 6. Credenciais de acesso (desenvolvimento)

```
CPF/E-mail: 12345678900
Senha:      12345678
```

---

## 🔌 Endpoints da API

### Servidor de Geração de Provas (`gerarProvas/app.py`)

#### `POST /gerar-prova`

Gera e retorna um PDF da prova com os dados fornecidos.

**Body (JSON):**
```json
{
  "titulo": "Avaliação de Matemática",
  "descricao": "Avaliação do 1º bimestre",
  "data": "2025-03-20",
  "turno": "matutino",
  "questoes": [
    {
      "titulo": "Quanto é 2 + 2?",
      "tipo": "multipla-escolha",
      "alternativas": ["2", "3", "4", "5", "6"]
    }
  ]
}
```

**Resposta:** Arquivo PDF para download (`prova_gerada.pdf`)

---

### Servidor de Correção Automática (`mainWebcan-web.py`)

#### `POST /processar`

Recebe uma imagem do gabarito em Base64 e retorna o resultado da correção.

**Body (JSON):**
```json
{
  "imagem": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Resposta (JSON):**
```json
{
  "respostas_lidas": ["1-C", "2-B", "3-D", "4-A", "5-C"],
  "acertos": 5,
  "erros": 0,
  "pontuacao": 30
}
```

> A pontuação é calculada como `acertos × 6`, totalizando no máximo **30 pontos** para 5 questões.

---

## 🔄 Fluxo de Uso

### Criação e Aplicação de Prova

```
1. Professor faz login (index-login.html)
2. Acessa "Avaliações > Criar Avaliação"
3. Preenche título, data, turno, descrição
4. Adiciona questões (múltipla escolha ou verdadeiro/falso)
5. Clica em "Gerar Prova" → PDF é gerado e baixado automaticamente
6. Professor imprime a prova e distribui aos alunos
```

### Correção Automática

```
1. Professor acessa "Correções > Correção Automática"
2. Câmera do dispositivo é ativada automaticamente
3. Professor posiciona o gabarito preenchido na frente da câmera
4. Clica em "Processar Gabarito"
5. O frame é capturado e enviado ao servidor Flask
6. OpenCV extrai o gabarito, analisa campos preenchidos
7. Resultado (acertos, erros, pontuação) é exibido na tela
```

### Geração de QR Codes para Alunos

```bash
# Edite o nome e matrícula no arquivo e execute:
python qr_codes/gerar-qr-codes.py
# QR Code salvo em: qr_codes/qrcode0001.png
```

---

## 🐍 Módulos Python

### `extrairGabarito.py`

Módulo central de visão computacional. A função `extrairMaiorCtn(img)`:

1. Converte a imagem para escala de cinza
2. Aplica **threshold adaptativo gaussiano** para binarização
3. Dilata a imagem para preencher lacunas nos contornos
4. Detecta todos os contornos externos
5. Identifica o **maior contorno** (presumivelmente o gabarito)
6. Recorta e redimensiona para `400×500 px`
7. Retorna o recorte e as coordenadas do bounding box

### `mainWebcan-web.py`

Servidor Flask que:
- Recebe imagem em Base64 via `POST /processar`
- Carrega campos (`campos.pkl`) e respostas (`resp.pkl`) serializados
- Chama `extrairGabarito.extrairMaiorCtn()`
- Analisa cada campo: se ≥ 15% dos pixels estiverem preenchidos, considera marcado
- Compara com gabarito oficial e retorna resultado em JSON

### `gerarProvas/app.py`

Servidor Flask que:
- Recebe dados da prova em JSON via `POST /gerar-prova`
- Usa a classe `PDF` (herda de `FPDF`) com cabeçalho e rodapé customizados
- Gera PDF com instruções, título, data, turno, descrição e questões
- Salva em arquivo temporário, envia como download e remove o arquivo

---

## 🎨 Frontend (HTML/CSS/JS)

### Paleta de Cores (variáveis CSS globais)

```css
--color-write:       #ffffff  /* Branco */
--color-black:       #000000  /* Preto */
--color-verde:       #00AC4E  /* Verde SEDUC */
--color-azul:        #007BFF  /* Azul principal */
--color-azul-escuro: #005dc0  /* Azul escuro (hover) */
--color-background:  #ececec  /* Fundo cinza claro */
--degrade-verde: linear-gradient(to right, #00ac4e, #005e2a)
```

### Menu de Navegação

O menu possui 4 categorias com cores distintas e submenus dropdown por hover:

| Categoria | Cor de Fundo | Cor da Borda |
|---|---|---|
| Questões | `#f8c578` (âmbar) | `#d47f00` |
| Avaliações | `#77ff8e` (verde claro) | `#009919` |
| Correções | `#cfb1ff` (lilás) | `#4d00c9` |
| Relatórios | `#ffa8a8` (rosa) | `#a50000` |

### Responsividade

- Breakpoint principal: `max-width: 650px`
- Rodapé muda para layout em coluna em telas pequenas
- Textos e imagens do card de usuário são reduzidos em telas pequenas

---

## 🔐 Observações de Segurança

> ⚠️ Este projeto está em fase de desenvolvimento. Os itens abaixo **precisam ser corrigidos antes de qualquer uso em produção:**

1. **Credenciais hardcoded** — O arquivo `validacaoLogin.js` contém CPF e senha em texto puro no código-fonte do cliente. Qualquer pessoa pode ver as credenciais inspecionando o código no navegador.

2. **Autenticação sem backend** — A validação de login é feita inteiramente no frontend (JavaScript), o que não oferece nenhuma segurança real.

3. **Caminho absoluto hardcoded** — Em `gerarProvas/app.py`, o logo da SEDUC usa um caminho local fixo (`C:\Users\70555119173\Documents\...`), o que impede o funcionamento em qualquer outro ambiente.

4. **CORS aberto** — `Flask-CORS` está configurado sem restrições de origem, aceitando requisições de qualquer domínio.

5. **Gabarito fixo** — As respostas corretas (`["1-C","2-B","3-D","4-A","5-C"]`) estão hardcoded nos scripts Python. Devem ser dinâmicas e vinculadas à prova correspondente.

---

## 🚀 Melhorias Futuras

- [ ] Implementar autenticação segura com backend (JWT ou sessões)
- [ ] Criar banco de dados (SQLite ou PostgreSQL) para armazenar provas, questões, alunos e resultados
- [ ] Tornar o gabarito dinâmico: vincular respostas corretas à prova gerada
- [ ] Finalizar as telas do menu (questões, relatórios, histórico)
- [ ] Adicionar leitura de QR Code no fluxo de correção para identificar automaticamente o aluno
- [ ] Unificar os dois servidores Flask em uma única aplicação
- [ ] Adicionar testes automatizados (pytest)
- [ ] Dockerizar a aplicação para facilitar o deploy
- [ ] Implementar sistema de turmas e matrícula de alunos
- [ ] Exportar relatórios de desempenho em PDF ou Excel

---

## 👤 Autor

**Vinícius Soares Castro**
GEIT — Gerência em Infraestrutura e Tecnologia
Secretaria de Educação do Estado de Goiás (SEDUC-GO)

---

## 📄 Licença

Projeto de uso institucional — SEDUC-GO. Consulte o responsável pelo repositório para informações sobre licenciamento.

---

*Repositório: [github.com/vinisoarescastro/sipro](https://github.com/vinisoarescastro/sipro)*
