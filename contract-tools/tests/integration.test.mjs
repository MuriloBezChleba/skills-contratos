import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { ensureDocumentation, initFeature, validate } from '../scripts/contracts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const promoted = ['engineering', 'productivity'].flatMap(bucket => fs.readdirSync(path.join(root, 'skills', bucket)).filter(name => fs.existsSync(path.join(root, 'skills', bucket, name, 'SKILL.md'))).map(name => ({ bucket, name, dir: `skills/${bucket}/${name}` })));
test('manifesto corresponde exatamente às skills promovidas, sem duplicações', () => {
  const manifest = JSON.parse(read('.claude-plugin/plugin.json'));
  assert.deepEqual([...manifest.skills].sort(), promoted.map(s => './' + s.dir).sort());
  assert.equal(new Set(manifest.skills).size, manifest.skills.length);
});
test('todas as skills promovidas leem o mesmo contexto e possuem docs e catálogos', () => {
  for (const s of promoted) {
    const skill = read(`${s.dir}/SKILL.md`);
    assert(skill.includes('## Shared contract context'), s.name);
    assert(skill.includes('context/features/<feature>/'), s.name);
    assert(skill.includes('context/glossary.md'), s.name);
    assert(skill.includes('GitHub'), s.name);
    assert(read('README.md').includes(`./${s.dir}/SKILL.md`), s.name);
    assert(read(`skills/${s.bucket}/README.md`).includes(`./${s.name}/SKILL.md`), s.name);
    const docs = read(`docs/${s.bucket}/${s.name}.md`);
    for (const section of ['What it does', 'When to reach for it', 'Where it fits']) assert(docs.includes(`## ${section}`), `${s.name}: ${section}`);
    const metadata = read(`${s.dir}/agents/openai.yaml`);
    assert.equal(/disable-model-invocation: true/.test(skill), /allow_implicit_invocation: false/.test(metadata), `${s.name}: políticas incoerentes`);
  }
});
test('router apresenta contratos e fluxo em uma branch por feature', () => {
  const router = read('skills/engineering/ask-matt/SKILL.md');
  for (const s of promoted) assert(router.includes(`/${s.name}`) || s.name === 'ask-matt', s.name);
  assert(router.includes('feature/<id>-<name>'));
  assert(!router.includes('lands everything on one **integration branch**'));
});
test('ferramentas instaladas criam contexto e detectam documentação ignorada', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'upstream-contract-test-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', temp, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-b', 'main'); git('config', 'user.name', 'Contract Test'); git('config', 'user.email', 'test@example.invalid');
  fs.writeFileSync(path.join(temp, 'app.txt'), 'base'); git('add', '.'); git('commit', '-m', 'base');
  assert.equal(initFeature(temp, 'F001-login', 'equipe-produto'), 'feature/F001-login');
  assert(fs.existsSync(path.join(temp, 'context/features/F001-login/README.md')));
  assert.deepEqual(ensureDocumentation(temp, 'F001-login'), []);
  fs.writeFileSync(path.join(temp, '.gitignore'), 'context/project.md\n');
  assert(validate(temp, 'F001-login').some(e => e.includes('não pode ser ignorada')));
});
test('versões do pacote e plugin permanecem sincronizadas', () => {
  assert.equal(JSON.parse(read('package.json')).version, JSON.parse(read('.claude-plugin/plugin.json')).version);
});
