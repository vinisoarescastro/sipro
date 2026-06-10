# SIPRO — Sistema de Provas
### Secretaria de Educação do Estado de Goiás (SEDUC-GO)

> Plataforma web para criação, aplicação e correção automatizada de provas educacionais, com geração de PDF e leitura de gabarito via câmera.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Como Rodar](#como-rodar)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo de Uso](#fluxo-de-uso)
- [Observações de Segurança](#observações-de-segurança)
- [Melhorias Futuras](#melhorias-futuras)

---

## Visão Geral

O **SIPRO** é um sistema web voltado para a gestão de avaliações educacionais da SEDUC-GO. Professores e coordenadores podem cadastrar questões, compor provas, gerar PDFs institucionais e realizar a correção automática de gabaritos via câmera com visão computacional.

O sistema é composto por:
- **Frontend SPA** em React 18 + TypeScript (Vite), localizado em `sipro-app/`
- **API de Questões e Avaliações** em Python/Flask (porta 5001)
- **API de Correção Automática** em Python/Flask + OpenCV (porta 5000)

---

## Funcionalidades

### Implementadas
- [x] Tela de login com autenticação
- [x] Dashboard com cards de acesso rápido e resumo do sistema
- [x] Cadastro de questões (múltipla escolha e verdadeiro/falso) com banco de questões
- [x] Filtro e exclusão de questões no banco
- [x] Criação de avaliações com título, data, turno, instruções e questões dinâmicas
- [x] Geração de prova em PDF com cabeçalho institucional (logo SEDUC-GO)
- [x] Correção automática de gabarito via câmera (webcam + OpenCV)
- [x] Navegação SPA (sem recarregamento de página)
- [x] Design responsivo (desktop, tablet e mobile)
- [x] Script `start.bat` para iniciar todo o sistema com um clique

### Em Desenvolvimento
- [ ] Consulta, edição e importação de questões
- [ ] Consulta, edição e análise de desempenho de avaliações
- [ ] Correção manual e ajuste de notas
- [ ] Revisão de respostas e histórico de correções
- [ ] Relatórios de desempenho individual e geral
- [ ] Gráficos e visualizações de dados

---

## Tecnologias Utilizadas

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | SPA com componentes reutilizáveis e tipagem estática |
| Vite 5 | Build tool e servidor de desenvolvimento |
| CSS Variables | Design system global (cores, tokens, responsividade) |
| Bootstrap Icons | Ícones da interface (via CDN) |

### Backend
| Tecnologia | Uso |
|---|---|
| Python 3.8+ | Linguagem principal do backend |
| Flask | Servidor web e API REST |
| Flask-CORS | Liberação de requisições cross-origin do frontend |
| FPDF | Geração de arquivos PDF das provas |

### Visão Computacional
| Tecnologia | Uso |
|---|---|
| OpenCV (cv2) | Processamento de imagem e leitura de gabarito |
| NumPy | Operações matriciais sobre imagens |
| Pillow (PIL) | Conversão de imagem Base64 para array |
| pickle | Serialização dos campos e respostas do gabarito |

---

## Estrutura do Projeto

```
SiPro-Sistema-de-Provas/
│
├── sipro-app/                    ← Frontend React + TypeScript (SPA)
│   ├── src/
│   │   ├── App.tsx               ← Roteamento e controle de autenticação
│   │   ├── index.css             ← Design system global
│   │   ├── types/index.ts        ← Tipos TypeScript do domínio
│   │   ├── services/api.ts       ← Chamadas às APIs (fetch tipado)
│   │   ├── components/
│   │   │   ├── layout/           ← Sidebar, Header, Layout
│   │   │   └── ui/               ← EmDesenvolvimento, badges, etc.
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Home.tsx
│   │       ├── questoes/         ← QuestoesCadastrar.tsx
│   │       ├── avaliacoes/       ← AvaliacoesCriar.tsx
│   │       └── correcoes/        ← CorrecaoAutomatica.tsx
│   ├── public/
│   │   └── img/logos/            ← Logos SEDUC-GO e Governo de Goiás
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── python/
│   ├── questoes/
│   │   ├── app.py                ← API REST: questões, avaliações e PDF (porta 5001)
│   │   └── questoes.json         ← Persistência de questões (gerado automaticamente)
│   ├── mainWebcan-web.py         ← API REST: correção automática via câmera (porta 5000)
│   ├── extrairGabarito.py        ← Módulo de visão computacional (OpenCV)
│   ├── campos.pkl                ← Coordenadas dos campos do gabarito
│   └── resp.pkl                  ← Mapeamento de campos para respostas
│
├── qr_codes/
│   └── gerar-qr-codes.py         ← Gerador de QR Codes para identificação de alunos
│
├── img/
│   ├── logos/                    ← Logos SEDUC-GO e Governo de Goiás
│   └── backgrounds/              ← Imagem de fundo da tela de login
│
├── docs/
│   ├── arquitetura.md            ← Descrição e justificativa da arquitetura em camadas
│   ├── c4-context.puml           ← Diagrama C4 Nível 1 (Contexto)
│   ├── c4-container.puml         ← Diagrama C4 Nível 2 (Containers)
│   ├── c4-component.puml         ← Diagrama C4 Nível 3 (Componentes)
│   ├── c4-documentacao.md        ← Documentação dos diagramas C4
│   ├── historia-de-usuario.md    ← HU-01: Cadastrar Questão
│   └── como-rodar.md             ← Guia de instalação e execução
│
├── start.bat                     ← Inicializa todo o sistema com um clique
└── README.md
```

---

## Arquitetura do Sistema

O SIPRO adota **Arquitetura em Camadas (N-Tier)**:

```
┌──────────────────────────────────────────┐
│          Camada de Apresentação          │
│      React 18 + TypeScript (SPA)        │
│       http://localhost:3000             │
└─────────────────┬────────────────────────┘
                  │ HTTP/REST (JSON)
       ┌──────────┴──────────┐
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│  API Quest. │       │  API Corr.  │
│  Flask 5001 │       │  Flask 5000 │
│  questoes/  │       │  mainWebcan │
│  app.py     │       │  -web.py    │
└──────┬──────┘       └──────┬──────┘
       │ FPDF / JSON          │ OpenCV
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│ questoes    │       │  Leitura    │
│ .json       │       │  de Gabar.  │
└─────────────┘       └─────────────┘
```

Detalhes completos em [`docs/arquitetura.md`](./docs/arquitetura.md) e [`docs/c4-documentacao.md`](./docs/c4-documentacao.md).

---

## Como Rodar

### Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Python | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |

### Instalar dependências (apenas na primeira vez)

```bash
pip install flask flask-cors fpdf opencv-python numpy pillow qrcode
cd sipro-app && npm install
```

### Iniciar tudo com um clique

Na raiz do projeto, dê duplo clique em **`start.bat`** ou execute no terminal:

```bat
start.bat
```

Acesse **http://localhost:3000**

```
Login: CPF 12345678900 / Senha 12345678
```

Guia completo em [`docs/como-rodar.md`](./docs/como-rodar.md).

---

## Endpoints da API

### API de Questões e Avaliações — porta 5001

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/questoes` | Lista questões (filtros: `?disciplina=` `?tipo=`) |
| `POST` | `/questoes` | Cadastra nova questão |
| `GET` | `/questoes/<id>` | Busca questão por ID |
| `PUT` | `/questoes/<id>` | Edita questão |
| `DELETE` | `/questoes/<id>` | Exclui questão |
| `POST` | `/gerar-prova` | Gera PDF da avaliação e retorna como download |

**Exemplo — POST /questoes:**
```json
{
  "enunciado": "Qual é a capital do Brasil?",
  "tipo": "multipla_escolha",
  "disciplina": "Geografia",
  "nivel": "facil",
  "alternativas": [
    { "texto": "São Paulo" },
    { "texto": "Brasília" },
    { "texto": "Goiânia" }
  ],
  "gabarito": 1
}
```

### API de Correção Automática — porta 5000

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/processar` | Recebe imagem Base64 do gabarito e retorna pontuação |

**Resposta — POST /processar:**
```json
{
  "respostas_lidas": ["1-C", "2-B", "3-D", "4-A", "5-C"],
  "acertos": 5,
  "erros": 0,
  "pontuacao": 30
}
```

---

## Fluxo de Uso

### Criar e gerar uma prova

```
1. Acesse http://localhost:3000 e faça login
2. Navegue em Questões → Cadastrar e cadastre questões no banco
3. Navegue em Avaliações → Criar Avaliação
4. Preencha título, data, turno e adicione questões
5. Clique em "Gerar Prova em PDF" → download automático
6. Imprima e distribua aos alunos
```

### Corrigir um gabarito

```
1. Navegue em Correções → Correção Automática
2. A câmera é ativada automaticamente
3. Posicione o gabarito preenchido na frente da câmera
4. Clique em "Processar Gabarito"
5. O resultado (acertos, erros, pontuação) é exibido na tela
```

---

## Observações de Segurança

> Este projeto é um protótipo acadêmico. Os itens abaixo precisam ser resolvidos antes de qualquer uso em produção:

1. **Credenciais hardcoded** — CPF e senha estão fixos no frontend. Qualquer pessoa pode visualizá-los inspecionando o código.
2. **Autenticação sem backend** — A validação de login é feita no React sem verificação server-side.
3. **CORS aberto** — Flask-CORS aceita requisições de qualquer origem.
4. **Gabarito fixo** — As respostas corretas estão hardcoded no servidor de correção.

---

## Melhorias Futuras

- [ ] Autenticação segura com backend (JWT)
- [ ] Banco de dados relacional (SQLite → PostgreSQL)
- [ ] Gabarito dinâmico vinculado à prova gerada
- [ ] Implementar telas em desenvolvimento (consulta, relatórios, histórico)
- [ ] Leitura de QR Code para identificar o aluno automaticamente na correção
- [ ] Testes automatizados (pytest + Vitest)
- [ ] Dockerizar a aplicação para facilitar o deploy

---

## Documentação

| Documento | Descrição |
|---|---|
| [`docs/arquitetura.md`](./docs/arquitetura.md) | Modelo arquitetural, justificativa e decisões técnicas |
| [`docs/c4-documentacao.md`](./docs/c4-documentacao.md) | Diagramas C4 (Contexto, Container, Componente) |
| [`docs/historia-de-usuario.md`](./docs/historia-de-usuario.md) | HU-01: Cadastrar Questão (implementação completa) |
| [`docs/como-rodar.md`](./docs/como-rodar.md) | Guia de instalação e execução |

---

## Autor

**Vinícius Soares Castro**
Universidade Federal de Goiás — Disciplina de Arquitetura de Software (2026/1)
SEDUC-GO — Secretaria de Educação do Estado de Goiás

---

*Repositório: [github.com/vinisoarescastro/sipro](https://github.com/vinisoarescastro/sipro)*
