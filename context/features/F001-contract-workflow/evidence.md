---
{
  "records": [
    {
      "criterion": "AC-F001-001",
      "rules": [],
      "verification": "node --test contract-tools/tests/integration.test.mjs contract-tools/tests/install.test.mjs contract-tools/tests/publish.test.mjs; node scripts/sync-plugin-version.mjs --check",
      "result": "pass",
      "revision": "31b264169547fb2ae6fe0e6870158b906cab1ed6",
      "date": "2026-11-06T02:46:19.646Z",
      "method": "automated",
      "observed": "11 tests passed; plugin version synchronized; manifest, context, installation and publisher safeguards verified."
    },
    {
      "criterion": "AC-F001-002",
      "rules": [],
      "verification": "node --test contract-tools/tests/integration.test.mjs contract-tools/tests/install.test.mjs contract-tools/tests/publish.test.mjs; node scripts/sync-plugin-version.mjs --check",
      "result": "pass",
      "revision": "31b264169547fb2ae6fe0e6870158b906cab1ed6",
      "date": "2026-11-06T02:46:19.647Z",
      "method": "automated",
      "observed": "11 tests passed; plugin version synchronized; manifest, context, installation and publisher safeguards verified."
    },
    {
      "criterion": "AC-F001-003",
      "rules": [],
      "verification": "node --test contract-tools/tests/integration.test.mjs contract-tools/tests/install.test.mjs contract-tools/tests/publish.test.mjs; node scripts/sync-plugin-version.mjs --check",
      "result": "pass",
      "revision": "31b264169547fb2ae6fe0e6870158b906cab1ed6",
      "date": "2026-11-06T02:46:19.647Z",
      "method": "automated",
      "observed": "11 tests passed; plugin version synchronized; manifest, context, installation and publisher safeguards verified."
    }
  ]
}
---

## Evidências

| Critério | Contratos e regras relacionados | Verificação | Resultado | Revisão avaliada |
| --- | --- | --- | --- | --- |
| AC-F001-001 | CTX-F001 | testes de integração | pass | 31b264169547fb2ae6fe0e6870158b906cab1ed6 |
| AC-F001-002 | CTX-F001 | testes de integração | pass | 31b264169547fb2ae6fe0e6870158b906cab1ed6 |
| AC-F001-003 | CTX-F001 | testes de integração | pass | 31b264169547fb2ae6fe0e6870158b906cab1ed6 |

## Local validation results

13 source-package tests and 5 clone integration tests passed. Structural context validation and plugin version checks passed. Plugin validation passed with one warning: the upstream root CLAUDE.md is not loaded as plugin project context; explicit plugin --strict fails on this warning. Shared context rules are included in every promoted SKILL.md. These results concern uncommitted local files; formal criterion evidence remains pending until a committed revision is verified. No push occurred.

## Verified publication

Private repository: https://github.com/MuriloBezChleba/skills-contratos. Default branch: main. Verified via gh repo view. Prior local checks above are historical; structured records identify the final evaluated revision.
