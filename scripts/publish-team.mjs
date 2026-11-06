#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export function publish({ repository = 'skills-contratos', owner, root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), run = (exe, args) => execFileSync(exe, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() } = {}) {
  if (!/^[a-zA-Z0-9._-]+$/.test(repository)) throw new Error('Nome de repositório inválido');
  // Use gh's authenticated session without reading, copying or printing credential files.
  run('gh', ['auth', 'status']);
  owner ??= run('gh', ['api', 'user', '--jq', '.login']).trim();
  if (!/^[a-zA-Z0-9-]+$/.test(owner)) throw new Error('Owner inválido');
  if (run('git', ['status', '--porcelain']).trim()) throw new Error('Há alterações sem commit; revise e registre antes de publicar');
  if (run('git', ['remote']).split(/\r?\n/).includes('team')) throw new Error('Remote team já existe; confira seu destino antes de prosseguir manualmente');
  const fullName = `${owner}/${repository}`;
  run('gh', ['repo', 'create', fullName, '--private', '--source', '.', '--remote', 'team', '--description', 'Skills com contratos para Codex e Claude Code']);
  // Explicit refspec publishes this reviewed adaptation to the new repository's main.
  // No force push, remote replacement, collaborator invitation or change to origin.
  run('git', ['push', 'team', 'HEAD:refs/heads/main']);
  const branch = run('git', ['branch', '--show-current']).trim();
  if (branch && branch !== 'main') run('git', ['push', '-u', 'team', branch]);
  run('gh', ['repo', 'edit', fullName, '--default-branch', 'main']);
  return run('gh', ['repo', 'view', fullName, '--json', 'url,isPrivate,defaultBranchRef']);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = {}, args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
      if (!['--owner', '--repository'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Use: node scripts/publish-team.mjs [--owner ORGANIZACAO] [--repository skills-contratos]');
      options[args[i].slice(2)] = args[++i];
    }
    console.log(publish(options));
  } catch (error) {
    console.error(error.stderr?.toString().trim() || error.message);
    console.error('Publicação não confirmada. Confira gh auth status e os remotos no seu terminal antes de repetir.');
    process.exitCode = 1;
  }
}
