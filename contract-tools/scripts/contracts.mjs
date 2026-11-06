#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const PACKAGE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHA = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const VERSION = /^\d+\.\d+\.\d+$/;
const FEATURE = /^(F\d+)-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const kinds = { context: 'CTX-', model: 'MODL-', module: 'MOD-' };
const sections = {
  context: ['Problema e resultado', 'Escopo', 'Fontes', 'Requisitos', 'Aceite', 'Dependências', 'Restrições', 'Decisões e dúvidas'],
  model: ['Semântica', 'Identidade', 'Estrutura', 'Invariantes', 'Ciclo de vida', 'Representações', 'Validação', 'Evolução', 'Exemplos', 'Verificação'],
  module: ['Responsabilidade', 'Interface pública', 'Precondições', 'Pós-condições', 'Falhas', 'Efeitos', 'Concorrência', 'Dependências', 'Acesso', 'Limites operacionais', 'Verificação', 'Evolução'],
};

function need(ok, message) { if (!ok) throw new Error(message); }
function git(root, ...args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function json(file) { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
function write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
function fresh(file, content) { need(!fs.existsSync(file), `Arquivo já existe: ${file}`); write(file, content); }
function encode(meta, body) { return `---\n${JSON.stringify(meta, null, 2)}\n---\n\n${body.trim()}\n`; }
export function readDocument(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  need(match, `${file}: faltam delimitadores do cabeçalho`);
  try { return { meta: JSON.parse(match[1]), body: match[2] }; }
  catch { throw new Error(`${file}: cabeçalho deve usar objeto JSON (subconjunto YAML)`); }
}
function inside(root, relative) {
  need(typeof relative === 'string' && relative.length > 0 && !path.isAbsolute(relative), `Caminho relativo inválido: ${relative}`);
  const target = path.resolve(root, relative);
  need(target.startsWith(path.resolve(root) + path.sep), `Caminho fora da raiz: ${relative}`);
  if (fs.existsSync(target)) {
    need(fs.realpathSync(target).startsWith(fs.realpathSync(root) + path.sep), `Link fora da raiz: ${relative}`);
  }
  return target;
}
function files(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(e => {
    const p = path.join(root, e.name);
    need(!e.isSymbolicLink(), `Links simbólicos não suportados: ${p}`);
    return e.isDirectory() ? files(p) : [p];
  });
}
function packagedSkills(root) {
  // A user may clone the upstream inside skills/. Do not traverse its .git or repackage it.
  return ['engineering', 'productivity'].flatMap(bucket => files(path.join(root, 'skills', bucket)));
}
function rel(root, file) { return path.relative(root, file).split(path.sep).join('/'); }
function featureName(name) { need(FEATURE.test(name ?? ''), 'Feature deve ter formato F001-nome'); return FEATURE.exec(name)[1]; }
export function ensureDocumentation(root, name) {
  if (name) featureName(name);
  const documents = {
    'context/README.md': '# Contexto compartilhado do projeto\n\nLeia [projeto](project.md), [glossário](glossary.md), [decisões](decisions/README.md) e o contexto da feature em execução.\n\nContratos compartilhados: [modelos](../contracts/models/README.md) e [módulos](../contracts/modules/README.md).\n\nCada feature possui contract.md, context.md, evidence.md e skills.lock.json em context/features/F001-nome/. Estes documentos acompanham código e contratos no mesmo PR. GitHub recebe o contexto após commit e push autorizados.\n',
    'context/project.md': '# Projeto\n\n## Objetivo e limites\n\nPENDENTE\n\n## Comandos de verificação\n\nPENDENTE\n\n## Branches\n\nUma branch feature/F001-nome por feature.\n',
    'context/glossary.md': '# Glossário\n\nRegistre termos e seus significados conforme o domínio for definido.\n',
    'context/decisions/README.md': '# Decisões do projeto\n\nRegistre ADR-<numero>-<nome>.md para decisões duradouras, com contexto, decisão, consequências e alternativas relevantes.\n',
    'contracts/models/README.md': '# Contratos de modelos\n\nUma fonte canônica por conceito do domínio, em <nome>.md. Use o comando template --kind model para criar o contrato.\n',
    'contracts/modules/README.md': '# Contratos de módulos\n\nUma fonte canônica por fronteira pública, em <nome>.md. Use o comando template --kind module para criar o contrato.\n',
  };
  if (name) documents[`context/features/${name}/README.md`] = `# ${name}\n\nContexto do projeto: [índice](../../README.md).\n\n- [Contrato e aceite](contract.md)\n- [Estado e retomada](context.md)\n- [Evidências](evidence.md)\n- [Skills fixadas](skills.lock.json)\n\nBranch: feature/${name}. Mantenha estes arquivos no mesmo PR da implementação.\n`;
  const created = [];
  for (const [relative, body] of Object.entries(documents)) {
    const file = inside(root, relative);
    if (!fs.existsSync(file)) { write(file, body); created.push(relative); }
  }
  fs.mkdirSync(inside(root, 'context/features'), { recursive: true });
  return created;
}
function template(kind, name, feature, owner) {
  need(kinds[kind], 'kind deve ser context, model ou module');
  need(/^F\d+$/.test(feature ?? ''), 'feature deve ser um ID como F001');
  need(owner?.trim(), 'Informe --owner com responsável real');
  need(kind === 'context' || SLUG.test(name ?? ''), 'Nome deve ser um slug minúsculo');
  const meta = { id: kinds[kind] + (kind === 'context' ? feature : name), kind, version: '0.1.0', status: 'draft', owner, introduced_by: feature, depends_on: [], supersedes: null };
  if (kind === 'context') Object.assign(meta, { feature, branch: '', base_commit: null, requirements: [], acceptance: [] });
  if (kind === 'model') meta.invariants = [];
  if (kind === 'module') meta.operations = [];
  return { meta, body: sections[kind].map(title => `## ${title}\n\nPENDENTE`).join('\n\n') };
}

export function initFeature(root, name, owner, base = 'main') {
  const id = featureName(name);
  need(owner?.trim(), 'Informe --owner');
  need(path.resolve(git(root, 'rev-parse', '--show-toplevel')) === path.resolve(root), '--root deve apontar para a raiz do projeto Git');
  need(!git(root, 'status', '--porcelain'), 'Árvore Git deve estar limpa; preserve ou registre alterações antes de iniciar');
  const sha = git(root, 'rev-parse', '--verify', `${base}^{commit}`);
  const branch = `feature/${name}`;
  const dir = inside(root, `context/features/${name}`);
  need(!fs.existsSync(dir), 'Contexto da feature já existe');
  const featuresDir = path.join(root, 'context/features');
  if (fs.existsSync(featuresDir)) need(!fs.readdirSync(featuresDir).some(f => f.startsWith(`${id}-`)), `ID de feature já usado: ${id}`);
  const doc = template('context', name, id, owner);
  Object.assign(doc.meta, { branch, base_commit: sha });
  // Resolve and validate everything before changing the branch. No commit, reset or push.
  git(root, 'switch', '-c', branch, sha);
  fresh(path.join(dir, 'contract.md'), encode(doc.meta, doc.body));
  fresh(path.join(dir, 'context.md'), encode({ state: 'specified', last_verified_commit: null, uncommitted_changes: true }, '## Trabalho realizado\n\nContrato draft criado.\n\n## Verificações\n\nVer evidence.md; ainda não executadas.\n\n## Hipóteses e pendências\n\nPENDENTE: definir requisitos e critérios.\n\n## Próximo passo\n\nPreencher contract.md com as fontes reais.'));
  fresh(path.join(dir, 'evidence.md'), encode({ records: [] }, '## Evidências\n\n| Critério | Contratos e regras relacionados | Verificação | Resultado | Revisão avaliada |\n| --- | --- | --- | --- | --- |\n\nNenhuma verificação executada. Os registros estruturados do cabeçalho são a fonte do validador.'));
  fresh(path.join(dir, 'skills.lock.json'), JSON.stringify({ schema_version: 1, skills: [] }, null, 2) + '\n');
  ensureDocumentation(root, name);
  return branch;
}

export function validate(root, name, options = {}) {
  featureName(name);
  const errors = [];
  const check = (ok, message) => { if (!ok) errors.push(message); };
  const dir = inside(root, `context/features/${name}`);
  const requiredDocs = ['context/README.md', 'context/project.md', 'context/glossary.md', 'context/decisions/README.md', 'contracts/models/README.md', 'contracts/modules/README.md', ...['README.md', 'contract.md', 'context.md', 'evidence.md', 'skills.lock.json'].map(f => `context/features/${name}/${f}`)];
  for (const relative of requiredDocs) {
    check(fs.existsSync(inside(root, relative)), `Documentação compartilhada ausente: ${relative}`);
    let ignored = false;
    try { ignored = Boolean(git(root, 'check-ignore', '--no-index', '--', relative)); }
    catch (error) { if (error.status !== 1) errors.push(`Não foi possível verificar regras de ignore: ${relative}`); }
    check(!ignored, `Documentação não pode ser ignorada pelo Git: ${relative}`);
  }
  const catalog = new Map();
  const candidates = [...files(path.join(root, 'contracts')).filter(f => f.endsWith('.md') && path.basename(f) !== 'README.md'), ...files(path.join(root, 'context/features')).filter(f => path.basename(f) === 'contract.md')];
  for (const file of candidates) {
    try {
      const doc = readDocument(file), m = doc.meta;
      check(m && typeof m === 'object' && !Array.isArray(m), `${file}: cabeçalho deve ser objeto`);
      for (const key of ['id', 'kind', 'version', 'status', 'owner', 'introduced_by', 'depends_on', 'supersedes']) check(Object.hasOwn(m, key), `${file}: falta ${key}`);
      check(kinds[m.kind] && typeof m.id === 'string' && m.id.startsWith(kinds[m.kind]), `${file}: id/kind inválidos`);
      check(VERSION.test(m.version), `${file}: versão inválida`);
      check(['draft', 'ready', 'deprecated', 'retired'].includes(m.status), `${file}: status inválido`);
      check(typeof m.owner === 'string' && !!m.owner.trim(), `${file}: owner ausente`);
      check(/^F\d+$/.test(m.introduced_by), `${file}: introduced_by inválido`);
      check(m.supersedes === null || typeof m.supersedes === 'string', `${file}: supersedes inválido`);
      check(Array.isArray(m.depends_on), `${file}: depends_on deve ser array`);
      check(!catalog.has(m.id), `ID duplicado: ${m.id}`);
      for (const section of sections[m.kind] ?? []) check(doc.body.includes(`## ${section}\n`), `${file}: falta seção ${section}`);
      if (m.status === 'ready') check(!/PENDENTE|\bTODO\b/.test(JSON.stringify(m) + doc.body), `${file}: contrato ready contém pendência`);
      if (m.kind === 'model') {
        check(Array.isArray(m.invariants) && m.invariants.length > 0 || m.status === 'draft', `${file}: invariants ausentes`);
        const ids = new Set();
        for (const inv of m.invariants ?? []) {
          check(/^INV-[a-z0-9-]+-\d+$/.test(inv.id) && !ids.has(inv.id) && inv.rule?.trim() && inv.verification?.trim(), `${file}: invariante inválida/duplicada`);
          ids.add(inv.id);
        }
      }
      if (m.kind === 'module') {
        check(Array.isArray(m.operations) && m.operations.length > 0 || m.status === 'draft', `${file}: operations ausentes`);
        const ids = new Set();
        for (const op of m.operations ?? []) {
          check(/^OP-[a-z0-9-]+-\d+$/.test(op.id) && !ids.has(op.id), `${file}: operação inválida/duplicada`); ids.add(op.id);
          for (const key of ['input', 'output', 'preconditions', 'postconditions', 'errors', 'effects', 'verification']) check(typeof op[key] === 'string' && op[key].trim(), `${file}: operação ${op.id} sem ${key}`);
        }
      }
      catalog.set(m.id, { ...doc, file });
    } catch (error) { errors.push(error.message); }
  }
  for (const { meta: m, file } of catalog.values()) {
    for (const dep of Array.isArray(m.depends_on) ? m.depends_on : []) {
      const target = catalog.get(dep.id);
      try {
        check(target && target.file === inside(root, dep.path) && target.meta.version === dep.version, `${file}: dependência inconsistente ${dep.id}@${dep.version}`);
        if (m.status === 'ready') check(target?.meta.status === 'ready', `${file}: dependência não está ready: ${dep.id}`);
      } catch (error) { errors.push(error.message); }
    }
    if (m.supersedes) check(catalog.has(m.supersedes) && m.supersedes !== m.id, `${file}: supersedes inexistente ou autorreferente`);
  }
  try {
    const c = readDocument(path.join(dir, 'contract.md')).meta;
    const state = readDocument(path.join(dir, 'context.md')).meta;
    const evidence = readDocument(path.join(dir, 'evidence.md')).meta;
    const lock = json(path.join(dir, 'skills.lock.json'));
    const complete = options.complete || state.state === 'done';
    check(c.feature === featureName(name) && c.id === `CTX-${c.feature}`, 'ID da feature diverge do diretório');
    check(c.branch === `feature/${name}`, 'Branch declarada diverge da feature');
    const branch = options.branch ?? git(root, 'branch', '--show-current');
    check(branch === c.branch, `Branch ativa/origem ${branch || '(detached HEAD)'} difere de ${c.branch}`);
    check(SHA.test(c.base_commit ?? ''), 'base_commit deve ser SHA completo');
    if (SHA.test(c.base_commit ?? '')) git(root, 'cat-file', '-e', `${c.base_commit}^{commit}`);
    check(['specified', 'implementing', 'verifying', 'done', 'blocked'].includes(state.state), 'Estado operacional inválido');
    check(state.last_verified_commit === null || SHA.test(state.last_verified_commit ?? ''), 'last_verified_commit inválido');
    check(typeof state.uncommitted_changes === 'boolean', 'uncommitted_changes deve ser boolean');
    check(Array.isArray(c.requirements) && c.requirements.length > 0, 'Feature sem requisitos');
    check(Array.isArray(c.acceptance) && c.acceptance.length > 0, 'Feature sem critérios de aceite');
    const requirements = new Set(), acceptance = new Set(), covered = new Set();
    for (const req of c.requirements ?? []) {
      check(new RegExp(`^REQ-${c.feature}-\\d+$`).test(req.id) && !requirements.has(req.id) && req.description?.trim() && req.source?.trim(), `Requisito inválido/duplicado: ${req.id}`);
      requirements.add(req.id);
    }
    for (const ac of c.acceptance ?? []) {
      check(new RegExp(`^AC-${c.feature}-\\d+$`).test(ac.id) && !acceptance.has(ac.id) && ac.scenario?.trim() && ac.expected?.trim() && ac.verification?.trim(), `Aceite inválido/duplicado: ${ac.id}`);
      acceptance.add(ac.id);
      check(Array.isArray(ac.requirements) && ac.requirements.length > 0, `${ac.id}: requisitos ausentes`);
      for (const req of ac.requirements ?? []) { check(requirements.has(req), `${ac.id}: requisito inexistente ${req}`); covered.add(req); }
    }
    for (const id of requirements) check(covered.has(id), `Requisito sem aceite: ${id}`);
    check(Array.isArray(evidence.records), 'evidence.records deve ser array');
    const records = new Map();
    for (const record of evidence.records ?? []) {
      check(acceptance.has(record.criterion) && !records.has(record.criterion), `Evidência sem aceite ou duplicada: ${record.criterion}`);
      check(['pass', 'fail', 'pending'].includes(record.result), `Resultado inválido: ${record.criterion}`);
      check(typeof record.verification === 'string' && record.verification.trim(), `Procedimento ausente: ${record.criterion}`);
      check(Array.isArray(record.rules), `rules deve ser array: ${record.criterion}`);
      for (const ref of record.rules ?? []) {
        const target = catalog.get(ref.contract);
        check(target?.meta.version === ref.version, `Versão de evidência inconsistente: ${ref.contract}`);
        const declared = [...(target?.meta.invariants ?? []), ...(target?.meta.operations ?? [])].map(x => x.id);
        check(declared.includes(ref.rule), `Regra de evidência inexistente: ${ref.rule}`);
      }
      if (record.result !== 'pending') {
        check(SHA.test(record.revision ?? ''), `Revisão ausente: ${record.criterion}`);
        check(typeof record.observed === 'string' && record.observed.trim(), `Resultado observado ausente: ${record.criterion}`);
        check(/^\d{4}-\d{2}-\d{2}T/.test(record.date ?? '') && !Number.isNaN(Date.parse(record.date)), `Data inválida: ${record.criterion}`);
        check(['automated', 'manual'].includes(record.method), `method inválido: ${record.criterion}`);
        if (record.method === 'manual') check(record.reviewer?.trim(), `Responsável manual ausente: ${record.criterion}`);
      }
      records.set(record.criterion, record);
    }
    for (const id of acceptance) check(records.has(id), `Aceite sem registro de evidência: ${id}`);
    check(lock.schema_version === 1 && Array.isArray(lock.skills), 'Lock inválido');
    const skillNames = new Set();
    for (const skill of lock.skills ?? []) {
      check(skill.name?.trim() && !skillNames.has(skill.name) && skill.origin?.trim(), 'Skill sem nome/origem ou duplicada'); skillNames.add(skill.name);
      check(typeof skill.local_modified === 'boolean' && (skill.commit === null || SHA.test(skill.commit ?? '')), 'Proveniência da skill inválida');
      check(skill.commit !== null || skill.local_modified === true, 'Skill sem commit deve declarar local_modified');
      check(Array.isArray(skill.files) && skill.files.length > 0, `Skill sem arquivos: ${skill.name}`);
      const paths = new Set();
      for (const f of skill.files ?? []) {
        check(typeof f.path === 'string' && f.path.length > 0 && !path.isAbsolute(f.path) && !f.path.split(/[\\/]/).includes('..') && !paths.has(f.path) && /^[a-f0-9]{64}$/.test(f.sha256 ?? ''), `Hash/caminho inválido: ${skill.name}`); paths.add(f.path);
      }
    }
    if (complete) {
      const documentationFiles = [...new Set([...requiredDocs, ...files(path.join(root, 'context')).map(f => rel(root, f)), ...files(path.join(root, 'contracts')).map(f => rel(root, f))])];
      for (const relative of documentationFiles) {
        try { git(root, 'ls-files', '--error-unmatch', '--', relative); }
        catch { errors.push(`Conclusão exige documentação adicionada ao Git: ${relative}`); }
      }
      check(c.status === 'ready' && state.state === 'done', 'Conclusão exige contrato ready e estado done');
      check(lock.skills?.length > 0, 'Conclusão exige skills fixadas no lock');
      check(SHA.test(state.last_verified_commit ?? ''), 'Conclusão exige last_verified_commit');
      const mutable = new Set(['context.md', 'evidence.md', 'skills.lock.json'].map(f => `context/features/${name}/${f}`));
      for (const id of acceptance) {
        const record = records.get(id);
        check(record?.result === 'pass', `Critério não aprovado: ${id}`);
        if (record?.result === 'pass' && SHA.test(record.revision ?? '')) {
          git(root, 'merge-base', '--is-ancestor', record.revision, 'HEAD');
          check(record.revision === state.last_verified_commit, `${id}: revisão diverge de last_verified_commit`);
          const changed = git(root, 'diff', '--name-only', record.revision, '--').split('\n').filter(Boolean);
          const untracked = git(root, 'ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean);
          check([...changed, ...untracked].every(p => mutable.has(p)), `${id}: alterações relevantes após revisão; renove evidências`);
        }
      }
    }
  } catch (error) { errors.push(error.message); }
  return errors;
}

export function lockSkill(root, feature, name, source, origin) {
  featureName(feature); need(SLUG.test(name ?? '') && origin?.trim(), 'Informe --name e --origin');
  const sourceFiles = files(source);
  need(sourceFiles.some(f => path.basename(f) === 'SKILL.md'), '--source deve conter SKILL.md');
  let commit = null, local_modified = true;
  try {
    const repo = git(source, 'rev-parse', '--show-toplevel');
    const tracked = git(repo, 'ls-files', '--', rel(repo, source)).split('\n').filter(Boolean);
    if (tracked.length) {
      commit = git(source, 'rev-parse', 'HEAD');
      local_modified = Boolean(git(repo, 'status', '--porcelain', '--', rel(repo, source))) || sourceFiles.some(f => !tracked.includes(rel(repo, f)));
    }
  } catch { /* Explicit local provenance is retained. */ }
  const file = inside(root, `context/features/${feature}/skills.lock.json`);
  const lock = json(file);
  const entry = { name, origin, commit, local_modified, files: sourceFiles.sort().map(f => ({ path: rel(source, f), sha256: crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') })) };
  lock.skills = [...lock.skills.filter(x => x.name !== name), entry];
  write(file, JSON.stringify(lock, null, 2) + '\n');
  return entry;
}

export function checkSkills(root = PACKAGE) {
  const errors = [], names = new Set();
  for (const file of packagedSkills(root).filter(f => f.endsWith('SKILL.md'))) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const header = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
    const name = /^name: ([a-z0-9-]+)$/m.exec(header)?.[1];
    if (!name || !SLUG.test(name) || name.length >= 64 || names.has(name) || name !== path.basename(path.dirname(file))) errors.push(`${file}: name inválido/duplicado`);
    names.add(name);
    if (!/^description: "[^"\n]+"$/m.test(header)) errors.push(`${file}: description ausente/inválida`);
    for (const section of ['Entradas', 'Precondições', 'Saídas', 'Verificação', 'Encerramento']) if (!text.includes(`## ${section}\n`)) errors.push(`${file}: falta ${section}`);
  }
  if (!names.size) errors.push('Nenhuma skill encontrada');
  return errors;
}

export function apply(root, target, doWrite = false) {
  need(path.resolve(root) !== path.resolve(target), 'Destino não pode ser o próprio pacote');
  need(fs.existsSync(path.join(target, 'skills/engineering/to-spec/SKILL.md')), 'Destino deve conter o clone upstream com skills/engineering/to-spec/SKILL.md');
  const changed = [...packagedSkills(root).map(f => [f, rel(root, f)]), [path.join(root, 'CONTRATOS.md'), 'CONTRATOS.md'], [path.join(root, 'scripts/contracts.mjs'), 'contract-tools/scripts/contracts.mjs'], ...files(path.join(root, 'templates')).map(f => [f, `contract-tools/${rel(root, f)}`])];
  const backup = `.contract-backups/${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomBytes(3).toString('hex')}`;
  const prepared = [];
  // Preflight all target paths before any writes, including symlinked parent directories.
  for (const [, dest] of changed) {
    let parent = inside(target, dest);
    while (parent !== path.resolve(target)) {
      if (fs.existsSync(parent)) need(fs.realpathSync(parent).startsWith(fs.realpathSync(target) + path.sep), `Link fora do destino: ${dest}`);
      parent = path.dirname(parent);
    }
  }
  // Build every replacement before mutation: unsupported headers must not cause partial writes.
  for (const [source, relative] of changed) {
    const dest = inside(target, relative);
    let content = fs.readFileSync(source);
    if (fs.existsSync(dest)) {
      need(fs.statSync(dest).isFile(), `${relative}: destino não é arquivo`);
      if (relative.endsWith('/SKILL.md')) {
        const old = fs.readFileSync(dest, 'utf8').replace(/\r\n/g, '\n');
        const oldHeader = /^---\n([\s\S]*?)\n---\n/.exec(old);
        const newText = content.toString();
        const newHeader = /^---\n([\s\S]*?)\n---\n/.exec(newText);
        need(oldHeader && newHeader, `${relative}: frontmatter inválido; nenhum arquivo alterado`);
        // Keep invocation policies and other upstream metadata, replace our name/description.
        const description = /^description:([^\n]*)(?:\n([ \t]+[^\n]*(?:\n[ \t]+[^\n]*)*))?/m.exec(oldHeader[1]);
        need(description && description[1].trim() && !description[2] && !/^[>|]/.test(description[1].trim()), `${relative}: descrição YAML multilinha exige merge manual; nenhum arquivo alterado`);
        let header = oldHeader[1].replace(/^name:.*\n?/m, '').replace(/^description:.*\n?/m, '');
        // Multiline descriptions would need YAML-aware merging; fail explicitly rather than corrupt.
        content = Buffer.from(`---\n${newHeader[1]}\n${header.trim()}\n---\n${newText.slice(newHeader[0].length)}`);
      }
    }
    prepared.push({ dest, relative, content });
  }
  if (!doWrite) return changed.map(([, dest]) => dest);
  for (const { dest, relative, content } of prepared) {
    if (fs.existsSync(dest)) fresh(inside(target, `${backup}/${relative}`), fs.readFileSync(dest));
    write(dest, content);
  }
  return changed.map(([, dest]) => dest);
}

function args(argv) {
  const [command, ...rest] = argv, options = {};
  for (let i = 0; i < rest.length; i++) {
    need(rest[i].startsWith('--'), `Argumento inválido: ${rest[i]}`);
    const key = rest[i].slice(2);
    if (['write', 'complete'].includes(key)) options[key] = true;
    else { need(rest[i + 1] && !rest[i + 1].startsWith('--'), `Falta valor para --${key}`); options[key] = rest[++i]; }
  }
  return { command, options };
}
export function main(argv) {
  const { command, options: o } = args(argv), root = path.resolve(o.root ?? '.');
  if (command === 'init') return console.log(initFeature(root, o.feature, o.owner, o.base));
  if (command === 'docs') return console.log(ensureDocumentation(root, o.feature).join('\n') || 'Documentação já existe; conteúdo preservado');
  if (command === 'template') {
    need(o.output, 'Informe --output'); const doc = template(o.kind, o.name, o.feature, o.owner);
    fresh(path.resolve(o.output), encode(doc.meta, doc.body)); return console.log(o.output);
  }
  if (command === 'validate' || command === 'check-skills') {
    const errors = command === 'validate' ? validate(root, o.feature, o) : checkSkills(PACKAGE);
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; } else console.log('OK (validação estrutural)');
    return;
  }
  if (command === 'lock') { need(o.source, 'Informe --source'); lockSkill(root, o.feature, o.name, path.resolve(o.source), o.origin); return console.log('Lock atualizado'); }
  if (command === 'apply') { need(o.target, 'Informe --target'); console.log(apply(PACKAGE, path.resolve(o.target), o.write).join('\n')); return; }
  need(!command || ['help', '--help'].includes(command), `Comando desconhecido: ${command}`);
  console.log('contracts: docs [--feature F001-nome] | init | template | validate [--complete] [--branch origem-PR] | lock | apply [--write] | check-skills\nLeia README.md para argumentos e limites.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
