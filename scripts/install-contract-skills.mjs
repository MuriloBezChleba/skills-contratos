#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ensureDocumentation } from '../contract-tools/scripts/contracts.mjs';

const SOURCE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function check(ok, message) { if (!ok) throw new Error(message); }
function list(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    check(!entry.isSymbolicLink(), `Link simbólico não suportado: ${entry.name}`);
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? list(file) : [file];
  });
}
function destination(root, relative) {
  const file = path.resolve(root, relative);
  check(file.startsWith(root + path.sep), `Caminho fora do projeto: ${relative}`);
  for (let p = file; p !== root; p = path.dirname(p)) {
    if (fs.existsSync(p)) check(fs.realpathSync(p).startsWith(fs.realpathSync(root) + path.sep), `Link fora do projeto: ${p}`);
  }
  return file;
}
export function install({ project, agent, write = false, update = false, source = SOURCE }) {
  check(project, 'Informe --project com a pasta da aplicação');
  const root = path.resolve(project);
  check(fs.existsSync(root) && fs.statSync(root).isDirectory(), 'Projeto deve ser um diretório existente');
  check(['codex', 'claude', 'both'].includes(agent), '--agent deve ser codex, claude ou both');
  check(root !== path.resolve(source), 'Instale no projeto da aplicação, não na fonte de distribuição');
  const agents = agent === 'both' ? ['codex', 'claude'] : [agent];
  const targets = { codex: '.agents/skills', claude: '.claude/skills' };
  const skillDirs = ['engineering', 'productivity'].flatMap(bucket => fs.readdirSync(path.join(source, 'skills', bucket)).filter(name => fs.existsSync(path.join(source, 'skills', bucket, name, 'SKILL.md'))).map(name => ({ name, dir: path.join(source, 'skills', bucket, name) })));
  check(new Set(skillDirs.map(s => s.name)).size === skillDirs.length, 'Nomes de skills duplicados na fonte');
  const plan = [];
  for (const selected of agents) for (const skill of skillDirs) for (const file of list(skill.dir)) plan.push({ from: file, relative: path.join(targets[selected], skill.name, path.relative(skill.dir, file)) });
  plan.push({ from: path.join(source, 'CONTRATOS.md'), relative: 'CONTRATOS.md' });
  for (const folder of ['scripts', 'templates']) for (const file of list(path.join(source, 'contract-tools', folder))) plan.push({ from: file, relative: path.join('contract-tools', folder, path.relative(path.join(source, 'contract-tools', folder), file)) });
  let commit = null, modified = true;
  try {
    commit = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    modified = Boolean(execFileSync('git', ['-C', source, 'status', '--porcelain'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim());
  } catch { /* Hashes remain available for a source without accessible Git metadata. */ }
  const provenance = { schema_version: 1, source_commit: commit, source_modified: modified, agents, skills: skillDirs.map(s => s.name), files: plan.map(p => ({ path: p.relative.split(path.sep).join('/'), sha256: crypto.createHash('sha256').update(fs.readFileSync(p.from)).digest('hex') })) };
  const metadata = 'contract-tools/installation.json';
  const changes = plan.map(p => ({ ...p, content: fs.readFileSync(p.from) }));
  changes.push({ relative: metadata, content: Buffer.from(JSON.stringify(provenance, null, 2) + '\n') });
  const conflicts = [];
  for (const item of changes) {
    const file = destination(root, item.relative);
    if (fs.existsSync(file)) {
      check(fs.statSync(file).isFile(), `Destino não é arquivo: ${item.relative}`);
      if (!fs.readFileSync(file).equals(item.content)) conflicts.push(item.relative);
    }
  }
  if (!write) return { skills: skillDirs.length, agents, files: changes.map(p => p.relative), conflicts, written: false };
  check(!conflicts.length || update, `Arquivos diferentes já existem. Revise a prévia; use --update para substituir com backup: ${conflicts.join(', ')}`);
  const backup = `.contract-backups/install-${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomBytes(3).toString('hex')}`;
  for (const item of changes) {
    const file = destination(root, item.relative);
    if (fs.existsSync(file) && fs.readFileSync(file).equals(item.content)) continue;
    if (fs.existsSync(file)) {
      const copy = destination(root, path.join(backup, item.relative));
      fs.mkdirSync(path.dirname(copy), { recursive: true }); fs.copyFileSync(file, copy);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, item.content);
  }
  // Generate fresh project context. Never copy this distribution's feature documentation.
  ensureDocumentation(root);
  return { skills: skillDirs.length, agents, files: changes.map(p => p.relative), conflicts, written: true, backup: conflicts.length ? backup : null };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i++) {
      const key = args[i];
      check(['--project', '--agent', '--write', '--update', '--help'].includes(key), `Argumento desconhecido: ${key}`);
      if (['--write', '--update', '--help'].includes(key)) options[key.slice(2)] = true;
      else { check(args[i + 1] && !args[i + 1].startsWith('--'), `Falta valor para ${key}`); options[key.slice(2)] = args[++i]; }
    }
    if (options.help) console.log('node scripts/install-contract-skills.mjs --project ../minha-app --agent codex|claude|both [--write] [--update]');
    else console.log(JSON.stringify(install(options), null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
