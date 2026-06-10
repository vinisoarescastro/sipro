# Arquitetura do SIPRO — Sistema de Provas

## Visão Geral

O SIPRO é uma plataforma web para gestão de avaliações educacionais da SEDUC-GO. O sistema permite que professores criem provas, gerem gabaritos em PDF com QR Code e realizem correção automática de respostas via câmera com visão computacional.

---

## Modelo Arquitetural Adotado: Arquitetura em Camadas (Layered Architecture)

### Descrição

O SIPRO segue o padrão de **Arquitetura em Camadas** (também conhecido como N-Tier Architecture), organizado em três camadas principais:

```
┌─────────────────────────────────────────┐
│         Camada de Apresentação          │
│     React 18 + TypeScript (SPA)        │
│         Vite · sipro-app/              │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST (JSON)
┌─────────────────▼───────────────────────┐
│          Camada de Aplicação            │
│         Flask REST API (Python)         │
│   porta 5001: Questões e Avaliações    │
│   porta 5000: Correção Automática      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Camada de Dados               │
│   JSON (arquivo) + Pickle + Sistema     │
│           de Arquivos (PDF)             │
└─────────────────────────────────────────┘
```

As camadas se comunicam de forma hierárquica: a apresentação só faz chamadas à aplicação, e a aplicação é a única a acessar os dados. Nenhuma camada "pula" outra.

---

## Justificativa da Escolha

### 1. Adequação ao contexto educacional institucional

O SIPRO é um sistema de uso interno da SEDUC-GO, com um conjunto de funcionalidades bem delimitado (criar provas, gerar PDFs, corrigir gabaritos). A arquitetura em camadas oferece separação clara de responsabilidades sem a complexidade operacional de modelos mais sofisticados como microsserviços, o que seria excessivo para o escopo atual.

### 2. Separação de responsabilidades

Cada camada tem uma responsabilidade única e bem definida:

| Camada | Responsabilidade |
|---|---|
| Apresentação | Renderizar interface, capturar entrada do usuário, enviar requisições |
| Aplicação | Executar regras de negócio, orquestrar serviços, validar dados |
| Dados | Persistir e recuperar informações (arquivos JSON, PDFs, pickles) |

Essa separação facilita a manutenção: alterações no visual não afetam a lógica de negócio, e mudanças na persistência não impactam a interface.

### 3. Facilidade de evolução incremental

O modelo em camadas permite substituir tecnologias por camada de forma independente. Essa característica já foi exercitada na prática:

- A camada de apresentação foi migrada de **HTML/CSS/JS vanilla para uma SPA React + TypeScript** sem nenhuma alteração no backend Flask.
- A camada de dados pode ser migrada de arquivos JSON para um banco relacional (SQLite → PostgreSQL) sem alterar a camada de apresentação.

Isso comprova a efetividade da arquitetura em camadas para o contexto evolutivo do SIPRO.

### 4. Baixa curva de aprendizado para o contexto acadêmico

A equipe de desenvolvimento tem perfil voltado a estudantes de computação. A arquitetura em camadas é amplamente ensinada em cursos de graduação e tem extensa documentação. Isso reduz o custo de onboarding de novos colaboradores.

### 5. Testabilidade

Cada camada pode ser testada de forma isolada:

- A camada de aplicação (Flask) pode ser testada com pytest sem precisar de um navegador.
- A camada de apresentação (React) pode ser testada com Vitest/Testing Library sem um backend real.
- A camada de dados pode ser mockada nos testes de aplicação.

### Por que não outros modelos?

| Modelo | Motivo da não adoção |
|---|---|
| **Microsserviços** | Overhead operacional desnecessário para o tamanho atual do sistema |
| **Event-Driven** | O fluxo do SIPRO é predominantemente síncrono (request-response) |
| **MVC tradicional (monolítico)** | O frontend desacoplado via REST é mais adequado ao contexto web moderno |
| **Serverless** | Dependência de plataformas de nuvem; requer infraestrutura que a SEDUC-GO pode não ter |

---

## Decomposição em Módulos

### Módulo de Autenticação
- Validação de credenciais do usuário (CPF/e-mail + senha)
- Implementado no frontend React com estado local; autenticação server-side planejada para versões futuras

### Módulo de Questões
- Cadastro, consulta, edição e exclusão de questões
- Suporte a múltipla escolha e verdadeiro/falso
- API REST em `python/questoes/app.py` (porta 5001)
- Persistência em `python/questoes/questoes.json`

### Módulo de Avaliações
- Composição de provas a partir de questões cadastradas manualmente
- Geração de PDF com cabeçalho institucional (logo SEDUC-GO, data, turno)
- Endpoint `/gerar-prova` integrado à API de questões (porta 5001)

### Módulo de Correção
- Correção automática via câmera (visão computacional com OpenCV)
- API em `python/mainWebcan-web.py` (porta 5000)
- Correção manual: planejada

### Módulo de Relatórios
- Desempenho individual e geral
- Análise estatística de questões
- Planejado para versões futuras

---

## Estrutura de Diretórios

```
SiPro-Sistema-de-Provas/
│
├── sipro-app/               ← Camada de Apresentação (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx          ← Roteamento SPA e controle de autenticação
│   │   ├── index.css        ← Design system global
│   │   ├── types/           ← Definições de tipos TypeScript
│   │   ├── services/        ← Funções de chamada às APIs (fetch)
│   │   ├── components/      ← Componentes reutilizáveis (Layout, Sidebar, UI)
│   │   └── pages/           ← Telas da aplicação por módulo
│   └── public/              ← Arquivos estáticos (logos, imagens)
│
├── python/                  ← Camada de Aplicação (Flask APIs)
│   ├── questoes/
│   │   ├── app.py           ← API REST: questões, avaliações, geração de PDF (porta 5001)
│   │   └── questoes.json    ← Persistência de questões
│   ├── mainWebcan-web.py    ← API REST: correção automática via câmera (porta 5000)
│   └── extrairGabarito.py   ← Módulo de visão computacional (OpenCV)
│
├── docs/                    ← Documentação da arquitetura
├── img/                     ← Imagens e logos institucionais
├── start.bat                ← Script de inicialização rápida
└── README.md
```

---

## Decisões Arquiteturais Relevantes

### DA-01: API REST com Flask
**Decisão:** Usar Flask como framework para expor endpoints REST em JSON.
**Motivo:** Leveza, flexibilidade e ausência de boilerplate excessivo. Adequado ao escopo do projeto.

### DA-02: Frontend SPA com React + TypeScript
**Decisão:** O frontend foi migrado de HTML/CSS/JS vanilla para uma Single Page Application (SPA) construída com React 18, TypeScript e Vite, localizada em `sipro-app/`.
**Motivo:** A SPA oferece navegação sem recarregamento de página, componentes reutilizáveis, tipagem estática para maior segurança no desenvolvimento e melhor experiência de usuário. A comunicação com o backend permanece via HTTP/REST, mantendo o desacoplamento da camada de aplicação.

### DA-03: Persistência em arquivo JSON
**Decisão:** Dados de questões e avaliações são persistidos em arquivos JSON na fase inicial.
**Motivo:** Elimina a dependência de um servidor de banco de dados para o protótipo, sem impedir migração futura para um SGBD.

### DA-04: Visão computacional isolada em módulo próprio
**Decisão:** O processamento de imagem (OpenCV) é encapsulado em `extrairGabarito.py`.
**Motivo:** Isola algoritmos complexos de visão computacional do fluxo HTTP, facilitando testes e substituição futura.

### DA-05: Geração de PDF integrada à API de questões
**Decisão:** O endpoint `/gerar-prova` foi incorporado ao `python/questoes/app.py` (porta 5001) em vez de manter um servidor separado.
**Motivo:** A geração de PDF é uma extensão natural do módulo de avaliações. Manter um terceiro servidor separado para essa funcionalidade adicionava complexidade operacional desnecessária sem benefício arquitetural real no escopo atual.

---

## Atributos de Qualidade

| Atributo | Estratégia |
|---|---|
| **Manutenibilidade** | Separação por camadas, componentes React reutilizáveis, responsabilidade única |
| **Testabilidade** | Camadas isoladas permitem testes unitários e de integração independentes |
| **Escalabilidade** | Camada de dados pode ser substituída por banco relacional sem impacto no frontend |
| **Usabilidade** | SPA com navegação fluida, design responsivo e feedback visual imediato |
| **Segurança** | Autenticação centralizada na camada de aplicação (a ser reforçada com JWT) |
| **Portabilidade** | Dependências declaradas; frontend React independente de plataforma |
