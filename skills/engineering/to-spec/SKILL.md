---
name: to-spec
description: "Transforma o pedido e a conversa em contrato de feature versionado, com requisitos e aceite rastreáveis."
disable-model-invocation: true
---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de especificação

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Pedido atual, fontes disponíveis, `context/project.md`, glossário e ADRs relevantes. Leia `CONTRATOS.md` da raiz do projeto. Se não estiver instalado, informe a dependência ausente; não improvise outro formato.

## Precondições

Identificar a feature e sua base. Respeitar a intenção mais recente do usuário. Não exigir uma nova aprovação para trabalho já autorizado. Ausências relevantes tornam apenas o trecho dependente pendente.

## Execução

1. Inspecione o projeto e escolha ID `F<numero>` e slug únicos.
2. Use `node contract-tools/scripts/contracts.mjs init --root . --feature F001-nome --owner <responsavel-real> --base main` quando as ferramentas estiverem instaladas. No pacote fonte, o CLI fica em `scripts/contracts.mjs`. O comando exige árvore limpa e cria a branch. Se já estiver na branch correta, reutilize os documentos sem sobrescrever. Se houver alterações, preserve-as e explique o impedimento a criar uma nova branch automaticamente.
3. Preencha `contract.md`: problema, resultado, escopo, exclusões, fontes, requisitos `REQ-F001-001`, aceite `AC-F001-001`, dependências exatas, restrições, decisões e dúvidas. Os dados estruturados do cabeçalho e a explicação em Markdown devem concordar.
4. Use hipóteses identificadas; não invente fontes, owner ou aprovação. Defina cenários e resultado observável por critério. Referencie modelos e módulos canônicos em `contracts/`.
5. Registre estado e próximo passo em `context.md`; cada critério começa com evidência `pending`. Atualize versões quando mudar obrigações e descreva incompatibilidades.

## Saídas

Branch `feature/F001-nome`, contrato da feature, contexto, evidências e lock de skills em `context/features/F001-nome/`. A especificação canônica fica no Git; tracker, quando autorizado, recebe um link ou espelho identificado como tal.

## Verificação

Execute o validador para a feature. Cada requisito deve ter aceite; dependências devem existir nas versões declaradas. Registre esta skill e os recursos usados com o comando `lock`.

## Encerramento

Reporte contrato criado, branch e pendências. Só marque `ready` quando obrigações e dependências estiverem definidas. Não publique em tracker, faça commit ou push apenas por ter concluído a especificação.
