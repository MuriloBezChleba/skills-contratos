---
name: code-review
description: "Revisa um diff quanto aos padrões do projeto e aos contratos de contexto, modelos e módulos, apontando violações por ID."

---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de revisão

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Feature, base de comparação, diff, padrões do projeto, `CONTRATOS.md`, contratos afetados e evidências. Use o commit-base do contrato se o usuário não tiver indicado outra base; registre o SHA resolvido.

## Precondições

Verifique a existência da base e registre também alterações locais que não aparecem em `base...HEAD`. Revisar diff vazio não comprova aceite. Não assuma que uma especificação externa é a versão canônica.

## Execução

1. Leia `context/project.md`, contrato e contexto da feature, contratos dependentes e ADRs relevantes. Execute o validador estrutural sem interpretar sua aprovação como prova semântica.
2. Revise padrões documentados do projeto. Separe violação obrigatória de sugestão; não invente obrigações com base em preferências de estilo.
3. Revise escopo, cada `REQ` e `AC`, invariantes `INV`, operações `OP`, precondições, falhas e efeitos. Identifique comportamento extra, requisito ausente e compatibilidade quebrada.
4. Confira versões, dependências e consumidores. Alterações textuais aparentemente pequenas podem mudar obrigações; adições a enums podem quebrar consumidores.
5. Confira revisão e conteúdo das evidências, incluindo mudanças após a revisão avaliada. Marque o que não conseguiu verificar. Não delegue a revisão sem autorização de trabalho paralelo.

## Saídas

Relatório com dois grupos: padrões e contratos. Cada achado inclui gravidade, arquivo/local, ID da obrigação quando houver, evidência e consequência observável. Registre esta skill e os recursos usados no lock quando a revisão permitir escrita.

## Verificação

Em revisão de conclusão use `validate --complete` pelo CLI em `contract-tools/scripts/contracts.mjs` (ou `scripts/contracts.mjs` no pacote fonte). Informe quais testes foram executados e quais não foram; não confunda teste não executado com aprovado.

## Encerramento

Reporte achados e limitações. Em revisão somente leitura não modifique contexto nem lock; entregue os dados para o implementador registrar. Não faça correções, aprovação humana, merge ou publicação implicitamente.
