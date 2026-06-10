# História de Usuário — Cadastrar Questão

## Identificação

| Campo | Valor |
|---|---|
| **ID** | HU-01 |
| **Épico** | Banco de Questões |
| **Prioridade** | Alta |

## Narrativa

> **Como** professor da SEDUC-GO,  
> **quero** cadastrar questões (de múltipla escolha ou verdadeiro/falso) no sistema,  
> **para que** eu possa reutilizá-las na composição de futuras avaliações.

## Critérios de Aceite

- [x] O professor pode preencher o enunciado, disciplina, nível de dificuldade e tipo da questão.
- [x] Para múltipla escolha, é possível adicionar de 2 a 5 alternativas e indicar a correta.
- [x] Para verdadeiro/falso, é possível indicar se o gabarito é Verdadeiro ou Falso.
- [x] O sistema exibe mensagem de sucesso após o cadastro.
- [x] O sistema exibe mensagem de erro descritiva se algum campo obrigatório estiver vazio.
- [x] A questão cadastrada aparece imediatamente na listagem do banco de questões.
- [x] O professor pode filtrar questões por disciplina e tipo.
- [x] O professor pode excluir uma questão da listagem.

---

## Implementação

### Arquivos envolvidos

| Camada | Arquivo | Descrição |
|---|---|---|
| Frontend | `sipro-app/src/pages/questoes/QuestoesCadastrar.tsx` | Tela React com formulário de cadastro e banco de questões lado a lado |
| Frontend | `sipro-app/src/services/api.ts` | Funções `getQuestoes`, `createQuestao`, `deleteQuestao` (fetch tipado) |
| Frontend | `sipro-app/src/types/index.ts` | Tipos `Questao`, `TipoQuestao`, `NivelQuestao`, `Alternativa` |
| Backend | `python/questoes/app.py` | API REST Flask com endpoints CRUD completos (porta 5001) |
| Dados | `python/questoes/questoes.json` | Arquivo de persistência (criado automaticamente no primeiro cadastro) |

### Endpoints da API (porta 5001)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/questoes` | Lista todas as questões (aceita `?disciplina=` e `?tipo=`) |
| `POST` | `/questoes` | Cadastra nova questão |
| `GET` | `/questoes/<id>` | Busca questão por ID |
| `PUT` | `/questoes/<id>` | Edita questão existente |
| `DELETE` | `/questoes/<id>` | Exclui questão |
| `POST` | `/gerar-prova` | Gera PDF de avaliação e retorna como download |

### Payload de exemplo — POST /questoes

```json
{
  "enunciado": "Qual é a capital do Brasil?",
  "tipo": "multipla_escolha",
  "disciplina": "Geografia",
  "nivel": "facil",
  "alternativas": [
    { "texto": "São Paulo" },
    { "texto": "Rio de Janeiro" },
    { "texto": "Brasília" },
    { "texto": "Salvador" }
  ],
  "gabarito": 2
}
```

### Como executar

Na raiz do projeto, execute:

```bat
start.bat
```

Acesse **http://localhost:3000**, faça login e navegue até **Questões → Cadastrar**.

Ou inicie manualmente apenas o backend necessário:

```bash
cd python/questoes
python app.py
# Servidor rodando em http://127.0.0.1:5001
```

---

## Relação com a Arquitetura

Esta história de usuário demonstra o modelo em camadas do SIPRO na prática:

```
[Navegador — React SPA]
    │  Preenche formulário e clica "Salvar questão"
    ▼
[QuestoesCadastrar.tsx → services/api.ts]   ← Camada de Apresentação
    │  fetch POST /questoes (JSON)
    ▼
[Flask Router → _validate → _save]          ← Camada de Aplicação
    │  open/write questoes.json
    ▼
[questoes.json]                             ← Camada de Dados
```

Cada camada tem uma responsabilidade única e se comunica apenas com a camada adjacente, validando os princípios arquiteturais definidos em [`arquitetura.md`](./arquitetura.md).
