---
name: ask-matt
description: Ask which skill or contract flow fits your situation.
disable-model-invocation: true
---

# Ask Matt

## Shared contract context

When working in a project repository, read CONTRATOS.md, context/README.md, context/project.md, context/glossary.md and the active feature's contract.md and context.md before acting. Project knowledge lives in context/; feature knowledge lives in context/features/<feature>/; shared model and module contracts live in contracts/. These locations take precedence over legacy glossary, scratch, ADR and temporary-file conventions elsewhere in this skill or its supporting references.

Use node contract-tools/scripts/contracts.mjs docs --root . to create missing project documentation without overwriting existing files. Start a new feature with init on feature/<id>-<name>; docs alone does not create a valid feature contract. Reuse the active feature branch for its tickets, research and prototypes. Do not create a second integration or prototype branch for that feature by default. If there is no repository or feature, keep standalone work standalone; do not invent a feature. For read-only tasks, report missing documentation instead of writing it.

Keep one canonical glossary at context/glossary.md and durable decisions under context/decisions/. Migrate existing glossary or ADR content deliberately, preserving links and history; do not silently replace an existing glossary with an empty file. Feature tickets, research and prototype decisions belong under context/features/<feature>/ and must reference the contract and acceptance IDs. An external tracker can mirror or link this source when authorized, but is not a prerequisite for local contract work. Never create issues in the upstream skills repository just because its origin is configured.

Update the relevant project and feature documentation when knowledge changes. Preserve facts, assumptions, evidence and next steps distinctly. Do not declare completion without recorded evidence and structural validation. Include code, contracts and context in the same feature PR; check that documentation is neither ignored nor left outside Git. Saving, committing and pushing are separate actions: only claim GitHub sharing after an authorized, verified push. Do not publish, merge, commit or delegate merely because another section describes that as a default; use existing user authorization. Authorized subagents must start with a fresh context window and receive pointers to these versioned artifacts.

Read a candidate skill's SKILL.md before describing its behavior. This is a router for the human; listing a user-invoked skill here does not authorize another skill to invoke it.

## Feature flow

1. Run /setup-matt-pocock-skills once to install project context and local contract tools. A tracker is optional.
2. Use /grill-with-docs when decisions need clarification, recording terms in context/glossary.md and durable decisions in context/decisions/.
3. Use /to-spec to create the feature branch and contract, even for a small feature. Define observable acceptance and exact contract dependencies.
4. Use /define-model for data invariants and /define-module for public interfaces, guarantees and effects. They are model-invoked reusable disciplines.
5. Use /to-tickets if the feature needs smaller units; canonical tickets stay under the feature directory and share its branch.
6. Use /implement for a unit or /implement-spec for the full dependency graph. Both honor the contracts. Parallel delegation requires authorization; do not invoke an explicit-only entrypoint from another skill.
7. Use /code-review for standards and contract compliance, then /pr when a PR is authorized. Code and documentation travel together. Use /retro to improve the environment.

## Session boundaries

Use /handoff to update versioned context, evidence and next steps before leaving. Resume by reading the project's index and the feature's README, contract and context. Conversation memory is supplementary. Do not discard unrecorded decisions when clearing or compacting.

## Other routes

- /codebase-design: Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more testable or AI-navigable, or when another skill needs the deep-module vocabulary.
- /diagnosing-bugs: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
- /domain-modeling: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR.
- /grill-with-docs: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
- /improve-codebase-architecture: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
- /pr: Use when writing a PR body.
- /prototype: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
- /research: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
- /retro: Conduct a retrospective on a coding session.
- /tdd: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
- /triage: Move issues and external PRs through a state machine of triage roles, categorise, verify, grill if needed, and write agent-ready briefs.
- /wayfinder: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear.
- /wizard: Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.
- /grill-me: A relentless interview to sharpen a plan or design.
- /grilling: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
- /teach: Teach the user a new skill or concept, within this workspace.
- /to-questionnaire: Turn a decision you can't fully answer into a questionnaire for someone else to fill in.
- /wait-what: Stop. That last message did not land: re-pitch it.
- /writing-for-agents: Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.
