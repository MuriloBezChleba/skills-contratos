import test from 'node:test';
import assert from 'node:assert/strict';
import { publish } from '../../scripts/publish-team.mjs';
test('publicação cria privado, preserva origin e verifica o repositório', () => {
  const calls = [];
  const run = (exe, args) => {
    calls.push([exe, args]);
    if (exe === 'gh' && args[0] === 'api') return 'example-team';
    if (exe === 'git' && args[0] === 'remote') return 'origin';
    if (exe === 'git' && args[0] === 'branch') return 'feature/F001-contract-workflow';
    if (exe === 'gh' && args[1] === 'view') return '{"isPrivate":true}';
    return '';
  };
  assert.equal(publish({ run }), '{"isPrivate":true}');
  assert(calls.some(([exe, args]) => exe === 'gh' && args[1] === 'create' && args.includes('--private') && args.includes('example-team/skills-contratos')));
  assert(calls.some(([exe, args]) => exe === 'git' && args.includes('HEAD:refs/heads/main')));
  assert(!calls.some(([, args]) => args.includes('--force') || args.includes('set-url')));
});
test('falha de autenticação impede criação e push', () => {
  const calls = [];
  assert.throws(() => publish({ run: (exe, args) => { calls.push([exe, args]); throw new Error('Sem autenticação'); } }), /Sem autenticação/);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], ['gh', ['auth', 'status']]);
});
test('árvore suja impede criação do repositório', () => {
  const calls = [];
  assert.throws(() => publish({ owner: 'example-team', run: (exe, args) => { calls.push([exe, args]); return exe === 'git' && args[0] === 'status' ? ' M README.md' : ''; } }), /sem commit/);
  assert(!calls.some(([, args]) => args.includes('create')));
});
