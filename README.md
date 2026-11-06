# Skills com contratos para Codex e Claude Code

Adaptação de [mattpocock/skills](https://github.com/mattpocock/skills) para desenvolvimento em equipe com contratos e contexto versionado no Git. Preserva autoria, histórico e [licença MIT](./LICENSE) do upstream. Esta é uma adaptação local, não uma versão oficial do projeto original.

São **29 skills promovidas**. Todas compartilham o contexto do projeto e de cada feature. Oito entrypoints foram adaptados, incluindo os novos `define-model` e `define-module`.

Neste guia, **Claude significa Claude Code**, o agente de desenvolvimento. A instalação no chat do site Claude não está coberta.

## Baixar o pacote

Requisitos: Git, Node.js 20 ou superior e Codex ou Claude Code instalado. Para repositório privado, cada colega precisa ter acesso e autenticação GitHub configurados. As skills não exigem `npm install`.

Substitua `SEU_USUARIO` pelo proprietário que publicou o repositório adaptado da equipe:

```powershell
gh repo clone SEU_USUARIO/skills-contratos
cd skills-contratos
```

O projeto da aplicação fica em outra pasta existente. Os exemplos usam `../minha-app`; você pode informar o caminho absoluto entre aspas. Use este repositório adaptado para obter os contratos, em vez da URL do upstream.

## Instalar no Codex

Confira a prévia e instale:

```powershell
node scripts/install-contract-skills.mjs --project ../minha-app --agent codex
node scripts/install-contract-skills.mjs --project ../minha-app --agent codex --write
```

As pastas completas ficam em `.agents/skills/<nome>/` dentro da aplicação, incluindo instruções, metadados e recursos. Abra a aplicação no Codex e teste:

```text
$setup-matt-pocock-skills Configure o projeto para contratos e contexto compartilhado.
```

Se a skill não aparecer, reinicie a sessão. O Codex descobre skills de projeto em `.agents/skills/` e permite referência explícita por `$nome`. Veja a [documentação oficial do Codex](https://learn.chatgpt.com/docs/build-skills).

## Instalar no Claude Code

Confira a prévia e instale:

```powershell
node scripts/install-contract-skills.mjs --project ../minha-app --agent claude
node scripts/install-contract-skills.mjs --project ../minha-app --agent claude --write
```

As pastas completas ficam em `.claude/skills/<nome>/` dentro da aplicação. Abra o Claude Code na aplicação e teste:

```text
/setup-matt-pocock-skills Configure o projeto para contratos e contexto compartilhado.
```

Claude Code aceita skills locais em `.claude/skills/` e chamadas por `/nome`. Veja a [documentação oficial do Claude Code](https://code.claude.com/docs/en/skills).

## Instalar para os dois agentes

```powershell
node scripts/install-contract-skills.mjs --project ../minha-app --agent both --write
```

O instalador prepara ambos os diretórios. Também instala `CONTRATOS.md`, `contract-tools/scripts/`, `contract-tools/templates/` e um registro de origem e hashes em `contract-tools/installation.json`. Cria contexto de projeto ausente, preservando documentos existentes. Não copia a feature de desenvolvimento deste pacote para a aplicação, não instala globalmente e não faz commit ou push.

## Compartilhar com o restante da equipe

Um integrante instala e inclui os arquivos no repositório da aplicação por PR. Os demais recebem a mesma versão com clone ou pull. Não precisam instalar individualmente se os arquivos do agente que usam já estiverem no projeto.

```text
minha-app/
  .agents/skills/          # Codex
  .claude/skills/          # Claude Code
  contract-tools/
  CONTRATOS.md
  context/
    README.md
    project.md
    glossary.md
    decisions/
    features/
  contracts/
    models/
    modules/
```

Confira `.gitignore`: algumas aplicações ignoram `.claude/` inteiro. Ajuste para versionar `.claude/skills/`, mantendo arquivos locais e credenciais ignorados. Não versione `.env`, `settings.local.json` ou backups. Adicione `.contract-backups/` ao ignore da aplicação quando usar atualizações com backup.

Evite instalar as mesmas skills também globalmente ou como plugin, para não criar duplicações. Este guia usa cópias locais no projeto, permitindo revisar e fixar uma versão para todo o grupo.

## Uso diário

1. `setup-matt-pocock-skills`: prepara o projeto uma vez, registrando comandos e convenções reais.
2. `to-spec`: define requisitos e aceite e inicia `feature/F001-nome`.
3. `define-model` e `define-module`: definem dados, invariantes, interfaces, garantias e erros.
4. `implement` ou `implement-spec`: executa a feature na branch declarada. `to-tickets` divide trabalho quando necessário.
5. `handoff`: registra o estado e próximo passo para outra sessão continuar.
6. `code-review`: verifica padrões e cumprimento dos contratos antes de entregar código e documentos no mesmo PR.

No Codex use `$to-spec`, `$implement` e os demais nomes com `$`. No Claude Code use `/to-spec`, `/implement` e os demais nomes com `/`. As skills **User-invoked** exigem chamada explícita; as **Model-invoked** também podem ser selecionadas conforme o pedido.

## Contexto e validação

`context/` é o conhecimento compartilhado do projeto. `context/features/<feature>/` contém contrato, estado, evidências e skills fixadas. `contracts/` contém modelos e módulos compartilhados.

Leia [CONTRATOS.md](./CONTRATOS.md), [o fluxo completo](./CONTRACT-WORKFLOW.md) e [os formatos estruturados](./contract-tools/templates/README.md). Na raiz da aplicação:

```powershell
node contract-tools/scripts/contracts.mjs validate --root . --feature F001-login
node contract-tools/scripts/contracts.mjs validate --root . --feature F001-login --complete
```

O validador confere estrutura, branch, referências e evidências. Testes de comportamento e revisão continuam necessários. Arquivo salvo, commit local e conteúdo publicado no GitHub são estados distintos.

## Atualizações

Atualize a distribuição com `git pull`, confira o commit ou tag escolhido pela equipe e execute a prévia. Diferenças existentes exigem `--update` e são preservadas em backup:

```powershell
node scripts/install-contract-skills.mjs --project ../minha-app --agent both
node scripts/install-contract-skills.mjs --project ../minha-app --agent both --write --update
```

Revise o diff e abra PR na aplicação. O instalador não remove arquivos extras: renomes e remoções exigem revisão manual. A documentação existente do produto é preservada.

## Publicar este pacote no GitHub

O mantenedor precisa de GitHub CLI autenticado. Após revisar, testar e registrar o commit, execute:

```powershell
gh auth status
node scripts/publish-team.mjs
```

O script cria `skills-contratos` **privado** na conta autenticada, acrescenta o remoto `team`, envia o conteúdo para `main` e para a branch de feature e verifica o resultado. Preserva o remoto `origin`. Para uma organização em que você tenha permissão:

```powershell
node scripts/publish-team.mjs --owner SUA_ORGANIZACAO --repository skills-contratos
```

Se o repositório ou o remoto já existir, revise o destino antes de continuar. Não há force push nem substituição de repositório existente. Após publicar, conceda acesso ao grupo nas configurações do GitHub e substitua `SEU_USUARIO` neste README. O script não adiciona colaboradores sem seus usuários terem sido informados.

## Verificação

```powershell
node --test contract-tools/tests/integration.test.mjs contract-tools/tests/install.test.mjs contract-tools/tests/publish.test.mjs
node scripts/sync-plugin-version.mjs --check
```

O manifesto do plugin foi preservado para compatibilidade, mas este guia usa instalação local por projeto. A validação explícita do plugin apresenta um aviso herdado sobre `CLAUDE.md` na raiz; o modo estrito reprova esse aviso. O contexto compartilhado está incluído nas próprias skills.


## Reference

Local contract adaptation: one branch per feature, with code, contracts and context in the same PR. Original authorship and license remain unchanged.

### Engineering

**User-invoked**

- **[ask-matt](./skills/engineering/ask-matt/SKILL.md)**: Ask which skill or contract flow fits your situation.
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)**: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
- **[implement](./skills/engineering/implement/SKILL.md)**: Implementa uma feature a partir de contratos de contexto, modelos e módulos, mantendo evidências e branch da feature.
- **[implement-spec](./skills/engineering/implement-spec/SKILL.md)**: Coordena a execução de uma especificação contratual em uma única branch de feature, com dependências e evidências.
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- **[retro](./skills/engineering/retro/SKILL.md)**: Conduct a retrospective on a coding session.
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.md)**: Configura um projeto para skills com contratos versionados, contexto por feature e ferramentas locais de validação.
- **[to-spec](./skills/engineering/to-spec/SKILL.md)**: Transforma o pedido e a conversa em contrato de feature versionado, com requisitos e aceite rastreáveis.
- **[to-tickets](./skills/engineering/to-tickets/SKILL.md)**: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker).
- **[triage](./skills/engineering/triage/SKILL.md)**: Move issues and external PRs through a state machine of triage roles, categorise, verify, grill if needed, and write agent-ready briefs.
- **[wayfinder](./skills/engineering/wayfinder/SKILL.md)**: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear.

**Model-invoked**

- **[code-review](./skills/engineering/code-review/SKILL.md)**: Revisa um diff quanto aos padrões do projeto e aos contratos de contexto, modelos e módulos, apontando violações por ID.
- **[codebase-design](./skills/engineering/codebase-design/SKILL.md)**: Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary.
- **[define-model](./skills/engineering/define-model/SKILL.md)**: Define contratos de modelos de domínio e dados, incluindo semântica, invariantes, estados e evolução compatível.
- **[define-module](./skills/engineering/define-module/SKILL.md)**: Define contratos de módulos com interfaces públicas, garantias, falhas, efeitos, dependências e evolução.
- **[diagnosing-bugs](./skills/engineering/diagnosing-bugs/SKILL.md)**: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
- **[domain-modeling](./skills/engineering/domain-modeling/SKILL.md)**: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR.
- **[pr](./skills/engineering/pr/SKILL.md)**: Use when writing a PR body.
- **[prototype](./skills/engineering/prototype/SKILL.md)**: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
- **[research](./skills/engineering/research/SKILL.md)**: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
- **[tdd](./skills/engineering/tdd/SKILL.md)**: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
- **[wizard](./skills/engineering/wizard/SKILL.md)**: Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.

### Productivity

**User-invoked**

- **[grill-me](./skills/productivity/grill-me/SKILL.md)**: A relentless interview to sharpen a plan or design.
- **[handoff](./skills/productivity/handoff/SKILL.md)**: Registra contexto operacional versionado de uma feature para outra sessão continuar com contratos, evidências e próximo passo.
- **[teach](./skills/productivity/teach/SKILL.md)**: Teach the user a new skill or concept, within this workspace.
- **[to-questionnaire](./skills/productivity/to-questionnaire/SKILL.md)**: Turn a decision you can't fully answer into a questionnaire for someone else to fill in.
- **[wait-what](./skills/productivity/wait-what/SKILL.md)**: Stop. That last message did not land: re-pitch it.

**Model-invoked**

- **[grilling](./skills/productivity/grilling/SKILL.md)**: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**: Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.
