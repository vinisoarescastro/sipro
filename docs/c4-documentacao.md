# Documentação de Arquitetura — C4 Model (SIPRO)

## Sobre o C4 Model

O **C4 Model** organiza a documentação de arquitetura em quatro níveis de abstração:

| Nível | Diagrama | Audiência |
|---|---|---|
| 1 | Contexto | Todos os stakeholders |
| 2 | Container | Arquitetos, desenvolvedores |
| 3 | Componente | Desenvolvedores do módulo |
| 4 | Código | Desenvolvedores (opcional) |

Os diagramas abaixo foram criados com **PlantUML** usando a biblioteca **C4-PlantUML**.

---

## Nível 1 — Diagrama de Contexto

> Mostra o SIPRO como uma caixa preta e seus usuários/sistemas externos.

Arquivo: [`c4-context.puml`](./c4-context.puml)

```
Para renderizar: abra no plugin PlantUML do VS Code, IntelliJ,
ou cole em https://www.plantuml.com/plantuml/uml/
```

### Atores e sistemas

| Ator / Sistema | Papel |
|---|---|
| Professor / Coordenador | Cria provas, consulta relatórios, acessa o sistema via navegador |
| Aluno | Realiza prova impressa; gabarito lido pela câmera |
| Sistema de E-mail SEDUC-GO | Recebe notificações de credenciais e alertas |
| Impressora / Sistema de Impressão | Recebe o PDF gerado para impressão das provas |

---

## Nível 2 — Diagrama de Containers

> Mostra as aplicações e serviços que compõem o SIPRO e como se comunicam.

Arquivo: [`c4-container.puml`](./c4-container.puml)

### Containers

| Container | Tecnologia | Porta | Responsabilidade |
|---|---|---|---|
| Aplicação Web (Frontend) | React 18, TypeScript, Vite (SPA) | 3000 | Interface SPA — login, dashboard, formulários, navegação dinâmica |
| API de Questões e Avaliações | Python 3, Flask, FPDF | 5001 | CRUD de questões, composição de avaliações, geração de PDF |
| API de Correção Automática | Python 3, Flask, OpenCV | 5000 | Recebe imagem do gabarito e retorna pontuação |
| Armazenamento de Dados | Arquivos JSON | — | Persiste questões e avaliações no sistema de arquivos |
| Módulo de Visão Computacional | Python, OpenCV, NumPy | — | Processa a imagem do gabarito (módulo interno da API de Correção) |
| Módulo Gerador de QR Code | Python, qrcode | — | Gera QR Codes para identificação nas provas impressas |

### Comunicações

- Frontend → APIs: **HTTP REST (JSON)** via `fetch()`
- Frontend → API Correção: imagem em **Base64** via POST
- API → Módulos internos: chamadas de função Python (in-process)
- API → Dados: I/O de arquivo JSON no sistema de arquivos

---

## Nível 3 — Diagrama de Componentes

> Mostra os componentes internos da **API de Questões e Avaliações** (`python/questoes/app.py`).

Arquivo: [`c4-component.puml`](./c4-component.puml)

### Componentes

| Componente | Arquivo / Função | Responsabilidade |
|---|---|---|
| CORS Middleware | `Flask-CORS` | Adiciona cabeçalhos CORS às respostas para o frontend na porta 3000 |
| Router Flask | Decoradores `@app.get/post/put/delete` | Registra e despacha rotas HTTP para os controladores corretos |
| Controlador de Questões | Funções `listar`, `cadastrar`, `buscar`, `editar`, `excluir` | Trata `/questoes/*` — valida payload, chama repositório |
| Controlador de PDF | Função `gerar_prova` | Trata `POST /gerar-prova` — aciona o gerador de PDF e retorna o arquivo |
| Validador de Questões | Função `_validate` | Verifica obrigatoriedade, tipo, alternativas (2–5) e gabarito |
| Repositório de Questões | Funções `_load` / `_save` | CRUD via leitura/escrita de `questoes.json` |
| Gerador de PDF | Classe `_PDF` + função `_gerar_pdf` | Formata e gera o arquivo PDF com logo institucional e questões |

### Fluxo de uma requisição POST /questoes

```
Frontend (React)
  └─► CORS Middleware
        └─► Router Flask
              └─► Controlador de Questões (cadastrar)
                    ├─ _validate(payload)     → valida enunciado, tipo, alternativas
                    ├─ _load()                → lê questoes.json
                    ├─ atribui UUID ao item
                    └─ _save(questoes)        → grava questoes.json
                          └─► questoes.json
```

### Fluxo de uma requisição POST /gerar-prova

```
Frontend (React)
  └─► CORS Middleware
        └─► Router Flask
              └─► Controlador de PDF (gerar_prova)
                    └─► _gerar_pdf(dados)
                          ├─ _PDF.header()   → logo SEDUC-GO + título
                          ├─ dados da prova  → título, data, turno, instruções
                          └─ questoes[]      → enunciado + alternativas formatadas
                                └─► arquivo .pdf (download)
```

---

## Como renderizar os diagramas

### Opção 1 — VS Code (recomendado)
1. Instale a extensão **PlantUML** (`jebbs.plantuml`)
2. Instale o Java 8+ (necessário para o PlantUML local)
3. Abra qualquer `.puml` e pressione `Alt+D` (preview)

### Opção 2 — IntelliJ / PyCharm
1. Instale o plugin **PlantUML Integration**
2. Abra o `.puml` e clique no ícone de preview

### Opção 3 — Online
1. Acesse [plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)
2. Cole o conteúdo do arquivo `.puml`

### Opção 4 — CLI
```bash
java -jar plantuml.jar docs/c4-context.puml
java -jar plantuml.jar docs/c4-container.puml
java -jar plantuml.jar docs/c4-component.puml
```
