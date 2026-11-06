---
name: handoff
description: "Registra contexto operacional versionado de uma feature para outra sessão continuar com contratos, evidências e próximo passo."
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de retomada

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Branch ativa, diff e status Git, contrato da feature, `context/project.md`, decisões e resultados realmente observados. Leia `CONTRATOS.md`.

## Precondições

Identifique a feature pela branch declarada; se for ambígua, peça apenas a informação necessária. Não grave a única cópia em diretório temporário. Preserve o contrato normativo e não transforme hipóteses em requisitos.

## Execução

Atualize `context/features/<feature>/context.md`: estado, último SHA realmente verificado ou null, alterações não commitadas, trabalho realizado, falhas conhecidas, hipóteses, pendências, bloqueios e próximo passo executável. Cite contratos, ADRs, arquivos e critérios em vez de duplicá-los.

Atualize `evidence.md` com comando/procedimento, data, critério, resultado e revisão avaliada. Se a verificação foi sobre alterações não commitadas, explique o resultado local mas mantenha a evidência formal pendente. Registre skills e recursos usados em `skills.lock.json`; a próxima sessão deve conseguir recuperar as instruções fixadas.

Não inclua segredos ou dados pessoais desnecessários. Não copie o chat inteiro. Use `done` apenas quando todos os critérios estiverem comprovados; para `blocked`, registre impedimento e condição de desbloqueio.

## Saídas

Contexto e evidências na própria branch da feature. Um arquivo temporário adicional pode ser usado para transporte, mas a fonte canônica permanece no Git.

## Verificação

Execute `validate` com a feature; se o estado for `done`, use `--complete`. Confira que o próximo passo pode ser executado sem depender da memória da conversa.

## Encerramento

Informe caminho do contexto, estado e próximo passo. Distingua arquivo salvo de commit criado; handoff não implica autorização para commit ou publicação.
