param(
    [string]$Repository = 'skills-contratos',
    [string]$Owner = ''
)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $repoRoot
try {
    # Use the caller's authenticated gh session. Never read or print credentials.
    gh auth status
    if ($LASTEXITCODE -ne 0) { throw 'GitHub CLI sem sessão acessível. Execute gh auth login no seu terminal.' }
    if (-not $Owner) {
        $Owner = gh api user --jq .login
        if ($LASTEXITCODE -ne 0) { throw 'Não foi possível identificar a conta GitHub.' }
    }
    if ($Owner -notmatch '^[a-zA-Z0-9-]+$' -or $Repository -notmatch '^[a-zA-Z0-9._-]+$') { throw 'Owner ou nome de repositório inválido.' }
    $dirty = git status --porcelain
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível consultar o Git.' }
    if ($dirty) { throw 'Há alterações sem commit. Revise e registre o conteúdo antes de publicar.' }
    $remotes = git remote
    if ($remotes -contains 'team') { throw 'Remote team já existe. Confira seu destino e prossiga manualmente para evitar publicar no repositório errado.' }
    $fullName = "$Owner/$Repository"
    gh repo create $fullName --private --source . --remote team --description 'Skills com contratos de contexto, modelos e módulos para Codex e Claude Code'
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar repositório. Nenhum push foi executado.' }
    git push team HEAD:refs/heads/main
    if ($LASTEXITCODE -ne 0) { throw 'Repositório criado, mas push da main falhou. Preserve o remote team e verifique o erro.' }
    $featureBranch = git branch --show-current
    if ($featureBranch -and $featureBranch -ne 'main') {
        git push -u team $featureBranch
        if ($LASTEXITCODE -ne 0) { throw 'main publicada, mas push da branch de feature falhou.' }
    }
    gh repo edit $fullName --default-branch main
    if ($LASTEXITCODE -ne 0) { throw 'Conteúdo publicado, mas não foi possível definir a branch padrão.' }
    gh repo view $fullName --json url,isPrivate,defaultBranchRef --jq '{url: .url, private: .isPrivate, branch: .defaultBranchRef.name}'
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível verificar a publicação.' }
} finally { Pop-Location }
