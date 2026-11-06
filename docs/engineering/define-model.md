## What it does

Define domain and data model contracts. Makes meaning, fields, invariants, lifecycle and migration obligations explicit.

## When to reach for it

Type /define-model, or let the agent select it when the task fits. Reach for it when this specific contract activity is needed in the feature workflow.

## Prerequisites

A project workspace with CONTRATOS.md and the local contract tools. Project documentation lives in context/ and each feature's documents live in context/features/<feature>/. Existing authorization governs writes and publication.

## Shared contract context

Read project knowledge and the active feature before acting. Preserve canonical model and module contracts in contracts/. Keep code, context and evidence on the feature branch and in the same PR. The validator checks structure and traceability; behavioral tests and review determine whether the feature actually meets its obligations.

## Common questions

**Is the documentation automatically available on GitHub?**
No. Saved files become shared remotely after an authorized commit and push.

**Where does another developer resume the feature?**
Start with context/README.md and context/features/<feature>/README.md, then read the contract, state and evidence.

## It's working if

- Another developer can identify the next step from the versioned feature context.
- Requirements and evidence agree with the behavior delivered on the feature branch.
- The result distinguishes completed checks from pending work.

## Where it fits

This is a contract workflow step. Use [to-spec](https://aihero.dev/skills-to-spec) to define feature obligations and [code-review](https://aihero.dev/skills-code-review) to assess delivery. See [ask-matt](https://aihero.dev/skills-ask-matt) for the complete map.
