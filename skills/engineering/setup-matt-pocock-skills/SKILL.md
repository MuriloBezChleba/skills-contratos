---
name: setup-matt-pocock-skills
description: "Configura um projeto para skills com contratos versionados, contexto por feature e ferramentas locais de validação."
disable-model-invocation: true
---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de configuração

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Projeto alvo, convenções existentes e pacote de adaptação contendo `CONTRATOS.md`, `scripts/contracts.mjs` e `templates/`. Não exigir tracker externo.

## Precondições

Inspecione AGENTS.md, árvore Git, configuração do agente e comandos existentes. Preserve decisões do usuário e arquivos existentes. Não invente owner ou comandos de teste. A ausência das ferramentas deve ser relatada antes de prometer validação.

## Execução

1. Instale a especificação na raiz e CLI/templates em `contract-tools/` apenas quando ausentes ou quando a atualização estiver no escopo; preserve diferenças locais e apresente conflitos.
2. Execute `node contract-tools/scripts/contracts.mjs docs --root .` para criar a documentação de projeto e os índices, preservando arquivos existentes. No pacote fonte use `scripts/contracts.mjs`. Projeto deve registrar objetivo, limites, comandos reais e convenções de branch. `init` cria o diretório e o índice de cada feature junto dos contratos e evidências.
3. Registre a fonte canônica no Git. Tracker é opcional; se existir, documente a relação com os arquivos e preserve metadados úteis da configuração anterior.
4. Acrescente ao steering file existente uma referência curta a `CONTRATOS.md`, leitura de contexto e uma branch por feature, preservando as instruções existentes. Não substituir AGENTS.md inteiro.
5. Explique que a feature é iniciada com `init`, contratos por `template`, recursos fixados com `lock` e estrutura verificada por `validate`. Não habilite CI nem instale skills globalmente implicitamente.

## Saídas

Projeto preparado com ferramentas acessíveis, convenções documentadas e diretórios canônicos. Setup não cria uma feature fictícia nem faz commits.

## Verificação

Confirme os caminhos, execute o help do CLI e valide as skills instaladas com o check local quando aplicável. Não execute comandos de produto inexistentes.

## Encerramento

Informe arquivos criados, ferramentas disponíveis e pendências de configuração reais. Não exigir uma sessão de perguntas se os dados já estiverem no projeto.
