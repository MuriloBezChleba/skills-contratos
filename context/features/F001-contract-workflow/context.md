---
{
  "state": "done",
  "last_verified_commit": "31b264169547fb2ae6fe0e6870158b906cab1ed6",
  "uncommitted_changes": true
}
---

## Trabalho realizado

Adaptação do núcleo contratual e do contexto das 29 skills promovidas. Manifesto, catálogos e docs sincronizados.

## Verificações

Ver evidence.md. Renovar evidências formais na revisão que inclui o endereço real da distribuição.

## Hipóteses e pendências

Publicação confirmada em https://github.com/MuriloBezChleba/skills-contratos, privado, com branch padrão main. O proprietário ainda precisa conceder acesso às pessoas da equipe, cujos usuários não foram informados.

## Próximo passo

Conferir as verificações da revisão publicada. A equipe pode seguir o README para instalar no Codex e no Claude Code.

## Local validation results

The source package passed 13 tests; clone tests now cover integration, installation and publication planning. Plugin version checks passed. Plugin validation passed with one warning: the upstream root CLAUDE.md is not loaded as plugin project context; explicit plugin --strict fails on this warning. Shared context rules are included in every promoted SKILL.md. Formal criterion evidence identifies the evaluated commit separately.

## Team distribution

README.md now explains installation in Codex and Claude Code. scripts/install-contract-skills.mjs installs all promoted skills and project tools, with preview and backup for updates. scripts/publish-team.mjs prepares private publication through the caller's GitHub CLI session, preserving origin. The publisher uses Node.js so it does not require changing Windows PowerShell execution policy.

The previous authentication-access blocker was resolved after the user updated session permissions. GitHub CLI authenticated as MuriloBezChleba and created the private repository skills-contratos. Both main and feature/F001-contract-workflow were pushed, and the default branch and private visibility were verified with gh repo view. No credentials were copied or exposed; origin was preserved.
