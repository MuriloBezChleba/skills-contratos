---
name: implement
description: "Implementa uma feature a partir de contratos de contexto, modelos e módulos, mantendo evidências e branch da feature."
disable-model-invocation: true
---

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

# Contrato de implementação

## Contexto compartilhado e versionado

Antes de executar, leia context/README.md, context/project.md, context/glossary.md e a documentação da feature ativa. Todas as skills deste pacote usam os mesmos diretórios canônicos: context/ para projeto e decisões, context/features/<feature>/ para a feature e contracts/ para modelos e módulos.

Se a estrutura estiver ausente, use o comando docs do CLI local para criar apenas índices e documentos de projeto ausentes, preservando conteúdo existente. Use init para iniciar uma feature nova na sua própria branch; docs não substitui o contrato nem cria uma feature válida sozinho. Em revisão somente leitura, reporte ausências sem criar arquivos.

Ao alterar conhecimento compartilhado, atualize os documentos correspondentes na mesma branch e relacione os caminhos no contexto da feature. Atualize project.md, glossary.md e ADRs somente quando houver nova informação aplicável ao projeto inteiro. Não crie cópias concorrentes em diretório temporário ou em um segundo diretório docs/.

Antes da entrega, confira documentação ausente, ignorada ou ainda não adicionada ao Git. Código, contratos e contexto devem acompanhar o mesmo PR. Arquivo salvo não significa commit; commit local não significa disponível no GitHub. Commit e push exigem autorização aplicável. Informe o que falta para compartilhar, sem afirmar publicação que não ocorreu.

## Entradas

ID da feature, contrato e contexto operacional em `context/features/`, modelos e módulos referenciados, `context/project.md`, glossário, ADRs e `CONTRATOS.md`.

## Precondições

Confirme `git branch --show-current` igual à branch do contrato, `ready` para os contratos usados e ausência de pendência que impeça o trecho. Não implemente outra feature na mesma branch. Preserve alterações alheias. Não faça reset para corrigir uma base incorreta.

## Execução

1. Leia contratos e contexto antes do código. Valide estrutura com `node contract-tools/scripts/contracts.mjs validate --root . --feature <feature>`; no pacote fonte use `scripts/contracts.mjs`.
2. Marque o contexto `implementing`. Implemente por critério de aceite, respeitando invariantes dos modelos e a interface pública dos módulos. Quando testes justificarem TDD e a skill estiver disponível, chame a ferramenta Skill com "tdd". Para a revisão final, chame a ferramenta Skill com "code-review" quando disponível. Cada chamada recebe uma única skill; sem essas ferramentas, execute as verificações diretamente.
3. Mudanças no resultado esperado exigem alteração explícita do contrato, análise de compatibilidade e versão adequada. Não enfraqueça critérios para fazer testes passarem.
4. Execute verificações relevantes do projeto. Registre comando, resultado observado, data, critérios e revisão avaliada. Alterações não commitadas não podem ser apresentadas como verificadas em um SHA que não as contém.
5. Atualize contexto nas pausas e registre esta skill e recursos usados no lock. Para concluir, verifique uma revisão commitada conforme a autorização existente; se commits não foram autorizados, deixe evidência pendente com os resultados locais explicados.

## Saídas

Implementação e contratos consistentes na branch da feature, contexto atualizado e evidências rastreáveis. Não alterar detalhes internos de outro módulo por conveniência sem explicitar a mudança de fronteira.

## Verificação

Revise aderência ao contrato e padrões do projeto separadamente. Rode os testes necessários e o validador. O modo `--complete` exige `done`, evidências aprovadas e uma revisão existente sem mudanças relevantes posteriores.

## Encerramento

Só declare a feature concluída quando todo aceite obrigatório estiver comprovado. Se houver falhas ou pendências, registre-as e informe o próximo passo. Não crie PR, publique, faça merge ou push sem autorização aplicável.
