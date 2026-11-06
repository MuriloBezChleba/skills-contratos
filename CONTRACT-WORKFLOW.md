# Uso da adaptação de contratos

Este é o clone upstream com a adaptação local aplicada. Licença, autoria, histórico e configurações de invocação foram preservados. As 29 skills promovidas compartilham o contexto canônico; oito entrypoints foram adaptados, incluindo define-model e define-module, registrados no plugin. Outros buckets permanecem fora do plugin.

## Instalação no projeto de uma aplicação

O README da raiz contém os comandos testados de instalação para Codex e Claude Code. Use `node scripts/install-contract-skills.mjs --project <aplicacao> --agent codex|claude|both --write` a partir deste clone para instalar skills completas, ferramentas e especificação. Não basta instalar apenas o entrypoint SKILL.md.

Use o mecanismo de descoberta de skills do seu agente. Copie CONTRATOS.md e contract-tools/ para a raiz da aplicação antes de iniciar o workflow. Setup lê o projeto, preserva documentos e configura seus caminhos. Não é necessário tracker externo. Este clone não foi instalado globalmente.

## Fluxo do desenvolvedor

1. Execute setup-matt-pocock-skills uma vez por projeto.
2. Use to-spec para definir a feature, seus requisitos e aceite, e criar feature/F001-nome.
3. Use define-model e define-module para definir os contratos compartilhados afetados.
4. Use implement ou implement-spec na mesma branch; to-tickets é opcional e os tickets ficam na documentação da feature.
5. Use handoff para atualizar o contexto antes de interromper e code-review para verificar entrega e evidências.
6. Inclua código, contratos e documentação no mesmo PR. Commit e push dependem de autorização aplicável.

## Ferramentas locais

Requer Node.js 20 ou superior, sem dependências npm adicionais. No projeto de destino, execute:

```powershell
node contract-tools/scripts/contracts.mjs docs --root .
node contract-tools/scripts/contracts.mjs init --root . --feature F001-login --owner equipe-produto --base main
node contract-tools/scripts/contracts.mjs template --kind model --name user --feature F001 --owner equipe-produto --output contracts/models/user.md
node contract-tools/scripts/contracts.mjs template --kind module --name auth --feature F001 --owner equipe-produto --output contracts/modules/auth.md
node contract-tools/scripts/contracts.mjs validate --root . --feature F001-login
node contract-tools/scripts/contracts.mjs validate --root . --feature F001-login --complete
```

init exige projeto Git com commit inicial e árvore limpa. docs é idempotente e preserva documentos existentes. O contexto fica em context/, a documentação de cada feature em context/features/<feature>/ e os contratos de modelos e módulos em contracts/. Arquivos README.md são índices, não contratos.

Contratos usam JSON entre delimitadores YAML --- para validar sem dependências. Consulte contract-tools/templates/README.md para os campos estruturados. O validador verifica estrutura, rastreabilidade, branch, arquivos ignorados e evidências; testes do produto e revisão continuam necessários. --complete exige documentação adicionada ao Git e evidências pass numa revisão existente, sem mudanças relevantes posteriores. Em CI detached HEAD, informe --branch com a branch de origem do PR. CI e proteção de branches não foram instalados.

Registre skills e recursos usados com lock, fornecendo --root, --feature, --name, --source e --origin. Hashes identificam as instruções; conteúdo local alterado é declarado explicitamente. O lock não garante reprodução exata de uma resposta de IA.

## Verificação desta adaptação

```powershell
node --test contract-tools/tests/integration.test.mjs
node scripts/sync-plugin-version.mjs --check
claude plugin validate . --strict
```

Backups locais em .contract-backups/ estão ignorados pelo Git. A adaptação foi commitada e publicada no repositório privado https://github.com/MuriloBezChleba/skills-contratos, com branch padrão main. O remote team aponta para essa distribuição, enquanto origin preserva o upstream. Integrantes precisam de acesso concedido pelo proprietário; nenhuma pessoa foi convidada automaticamente.
