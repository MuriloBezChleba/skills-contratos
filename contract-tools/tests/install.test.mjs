import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { install } from '../../scripts/install-contract-skills.mjs';
function fixture(t) { const root = fs.mkdtempSync(path.join(os.tmpdir(), 'team-skills-install-')); t.after(() => fs.rmSync(root, { recursive: true, force: true })); return root; }
test('prévia não escreve e instalação Codex preserva recursos e cria contexto da aplicação', t => {
  const root = fixture(t);
  const preview = install({ project: root, agent: 'codex' });
  assert.equal(preview.skills, 29); assert.deepEqual(fs.readdirSync(root), []);
  install({ project: root, agent: 'codex', write: true });
  assert(fs.existsSync(path.join(root, '.agents/skills/to-spec/SKILL.md')));
  assert(fs.existsSync(path.join(root, '.agents/skills/to-spec/agents/openai.yaml')));
  assert(fs.existsSync(path.join(root, 'contract-tools/scripts/contracts.mjs')));
  assert(fs.existsSync(path.join(root, 'context/project.md')));
  assert(!fs.existsSync(path.join(root, 'context/features/F001-contract-workflow')));
  assert(!fs.existsSync(path.join(root, '.claude/skills')));
});
test('instala para ambos os agentes e preserva contexto existente', t => {
  const root = fixture(t); fs.mkdirSync(path.join(root, 'context')); fs.writeFileSync(path.join(root, 'context/project.md'), 'Projeto real');
  install({ project: root, agent: 'both', write: true });
  assert(fs.existsSync(path.join(root, '.claude/skills/implement/SKILL.md')));
  assert(fs.existsSync(path.join(root, '.agents/skills/implement/SKILL.md')));
  assert.equal(fs.readFileSync(path.join(root, 'context/project.md'), 'utf8'), 'Projeto real');
});
test('atualização recusa sobrescrita implícita e salva backup de diferenças', t => {
  const root = fixture(t); install({ project: root, agent: 'claude', write: true });
  const file = path.join(root, '.claude/skills/to-spec/SKILL.md'); fs.writeFileSync(file, 'Customização da equipe');
  assert.throws(() => install({ project: root, agent: 'claude', write: true }), /Arquivos diferentes/);
  assert.equal(fs.readFileSync(file, 'utf8'), 'Customização da equipe');
  const result = install({ project: root, agent: 'claude', write: true, update: true });
  assert.equal(fs.readFileSync(path.join(root, result.backup, '.claude/skills/to-spec/SKILL.md'), 'utf8'), 'Customização da equipe');
});
