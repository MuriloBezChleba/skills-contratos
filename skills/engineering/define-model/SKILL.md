---
name: define-model
description: "Define contratos de modelos de domínio e dados, incluindo semântica, invariantes, estados e evolução compatível."

---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de modelagem

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

Requisitos da feature, glossário, modelos existentes e `CONTRATOS.md`. Modelo significa conceito do domínio ou representação de dados, não modelo de IA.

## Precondições

Identifique responsável real, feature e fonte das regras. Trabalhe na branch declarada da feature. Reutilize o contrato canônico existente; não duplique modelos para contornar dependências.

## Execução

Crie `contracts/models/<nome>.md` usando o comando `template --kind model` do CLI do projeto. Preencha semântica, identidade ou objeto de valor, campos, tipos, obrigatoriedade, nulabilidade, unidades, formatos e defaults. Defina regras `INV-<nome>-001`, estados e transições, representações de domínio/transporte/persistência, fronteira de validação e erros. Inclua exemplos válidos e inválidos e método de verificação de cada invariante.

Explicite moeda, precisão, arredondamento e fuso quando aplicáveis. Não invente proibições por dedução do nome. Avalie consumidores, dados legados e migração. Se a mudança for incompatível, incremente MAJOR após 1.0.0; em 0.x incremente MINOR e registre a incompatibilidade.

## Saídas

Contrato canônico com ID `MODL-<nome>`, versão, dependências e registro da evolução. Atualize as referências exatas na feature e nos módulos afetados, sem alterar outras features silenciosamente. Registre esta skill e recursos no lock.

## Verificação

Execute o validador para a feature. Confira cobertura de invariantes e consistência entre regras estruturadas e explicação. Regras com `PENDENTE` mantêm o contrato `draft`.

## Encerramento

Informe contrato e versão, consumidores afetados, estratégia de migração e pendências. Não declare implementação ou migração executada por ter definido o modelo.
