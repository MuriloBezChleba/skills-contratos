---
name: implement-spec
description: "Coordena a execução de uma especificação contratual em uma única branch de feature, com dependências e evidências."
disable-model-invocation: true
---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de execução de especificação

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Contrato da feature, tickets quando existirem, contexto operacional e contratos compartilhados. Leia `CONTRATOS.md` e as fontes de projeto antes de executar.

## Precondições

Uma especificação corresponde a uma feature e à branch `feature/<id>-<nome>` declarada. Se contiver features independentes, separe seus contratos e branches antes de implementar. Tickets são unidades internas da feature, não autorização para criar um conjunto de branches automaticamente.

## Execução

1. Valide a branch e os contratos; organize os critérios e tickets pelas dependências reais.
2. Execute primeiro o trabalho desbloqueado cumprindo invariantes, testes e evidências de `CONTRATOS.md`. `implement` é uma entrada explícita do usuário e não pode ser invocada por esta skill. Para TDD e revisão, chame a ferramenta Skill separadamente com "tdd" e "code-review" quando apropriado.
3. Mantenha uma branch por feature. Features dependentes devem declarar a base; não altere a base por reset. Não crie branches de integração adicionais por padrão.
4. Não delegue nem crie worktrees automaticamente. Se o usuário autorizar trabalho paralelo, cada tarefa deve ter fronteira de arquivos explícita e integrar no contrato da mesma feature; o trabalho paralelo não muda o escopo.
5. Revise consistência de versões após integrar alterações e renove evidências afetadas. Atualize contexto e lock das skills e recursos utilizados.

## Saídas

Feature implementada na branch declarada, contratos consistentes, critérios rastreáveis e contexto retomável. Tickets ou tracker só são atualizados quando autorizado.

## Verificação

Execute testes aplicáveis, revisão de padrões e aderência à especificação. Use `node contract-tools/scripts/contracts.mjs validate --root . --feature <feature> --complete` antes de declarar conclusão; no pacote fonte use `scripts/contracts.mjs`.

## Encerramento

Informe critérios atendidos, pendências e revisão avaliada. Não marque tickets externos como resolvidos sem evidência nem crie PR, commit, push ou merge implicitamente.
