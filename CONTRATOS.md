# Contratos de contexto, modelos e módulos

Status: especificação v0.1.0 com skills e validador estrutural locais implementados. CI e proteção de branches não estão configurados. Veja README.md para execução e limites da validação.

Neste documento, **modelo** significa modelo de domínio e de dados: entidades, objetos de valor, estados e representações persistidas ou transportadas. Modelos de IA ficam fora dessa definição.

## 1. Significado de contrato

Um contrato é uma especificação versionada que declara obrigações verificáveis entre quem produz e quem consome um artefato. Toda obrigação deve ter identificador, responsável pela verificação e evidência esperada.

- **DEVE** indica requisito obrigatório.
- **PODE** indica escolha permitida.
- **PENDENTE** indica ausência de definição; não equivale a aprovação.

Há três tipos principais:

| Contrato | Pergunta respondida | Produtor | Consumidor |
| --- | --- | --- | --- |
| Contexto | O que sabemos, o que foi decidido e qual trabalho está autorizado? | Pessoa ou agente que define e mantém a feature | Próxima sessão, implementador e revisor |
| Modelo | Quais conceitos e dados são válidos? | Responsável pelo domínio e implementação do modelo | Módulos, persistência e integrações |
| Módulo | Quais comportamentos uma fronteira do sistema oferece? | Implementador do módulo | Chamadores e outros módulos |

O contrato da feature define o resultado esperado. As skills executam atividades sobre esses contratos; não substituem seus requisitos nem ampliam o escopo autorizado.

## 2. Estrutura canônica

Todas as skills do pacote DEVEM compartilhar esta estrutura. Setup cria a documentação do projeto; init cria a documentação de cada feature. As demais skills leem os mesmos arquivos e atualizam o conhecimento afetado, preservando conteúdo existente. Revisão somente leitura relata ausências sem gravar. Índices `context/README.md` e `context/features/<feature>/README.md` permitem navegar pelo contexto; não duplicam sua fonte canônica. O comando `docs` cria os índices e documentos de projeto ausentes de forma idempotente.

Documentação obrigatória não pode estar ignorada pelo Git. Antes de concluir, deve estar adicionada ao Git e acompanhar a implementação no mesmo PR. Salvar arquivos não equivale a commit nem a push. Disponibilidade no GitHub só pode ser afirmada após publicação verificada e autorizada.

```text
contracts/
  models/
    <nome>.md
  modules/
    <nome>.md
context/
  README.md
  project.md
  glossary.md
  decisions/
    ADR-<numero>-<nome>.md
  features/
    F<numero>-<nome>/
      README.md
      contract.md
      context.md
      evidence.md
      skills.lock.json
```

Contratos compartilhados de modelos e módulos têm uma única fonte canônica. A feature referencia esses arquivos e os altera na própria branch quando necessário. Não criar cópias de contratos compartilhados por feature.

`context/project.md` registra objetivo, limites do produto, comandos de verificação e convenções estáveis. `context/glossary.md` define termos do domínio. ADRs registram decisões duradouras, motivo e alternativas relevantes.

## 3. Cabeçalho comum

Todo `contract.md` de feature e todo contrato de modelo ou módulo DEVE começar com os seguintes campos YAML:

```yaml
---
id: CTX-F001
kind: context
version: 0.1.0
status: draft
owner: equipe-responsavel
introduced_by: F001
depends_on: []
supersedes: null
---
```

| Campo | Regra |
| --- | --- |
| `id` | Identificador estável e único: `CTX-F001`, `MODL-<nome>` ou `MOD-<nome>` |
| `kind` | `context`, `model` ou `module` |
| `version` | Versão semântica da interface ou obrigações declaradas |
| `status` | `draft`, `ready`, `deprecated` ou `retired` |
| `owner` | Pessoa ou equipe responsável por resolver ambiguidades; não inventar um responsável real |
| `introduced_by` | ID da feature que introduziu o contrato |
| `depends_on` | Lista de objetos com `id`, `path` e `version`, usando versão exata |
| `supersedes` | ID de outro contrato substituído, ou `null`; versões do mesmo contrato mantêm seu ID |

`draft` permite discussão, mas requisitos pendentes não autorizam implementação dependente deles. `ready` indica que as obrigações necessárias foram definidas; não representa aprovação humana por si só. `deprecated` exige referência ao substituto ou à estratégia de encerramento. `retired` indica que não há mais consumidores ativos.

## 4. Contrato de contexto

O contexto tem duas partes: **normativa**, em `contract.md`, e **operacional**, em `context.md`. A primeira define o trabalho; a segunda permite retomá-lo.

### 4.1. Parte normativa: contract.md

Campos e seções obrigatórios:

| Seção | Conteúdo exigido |
| --- | --- |
| Identidade | Cabeçalho, ID da feature, branch `feature/<id>-<nome>` e commit-base completo |
| Problema e resultado | Problema observado, atores afetados e resultado desejado |
| Escopo | Comportamentos incluídos e exclusões concretas |
| Fontes | Caminhos ou URLs que fundamentam requisitos; fontes externas incluem data de consulta |
| Requisitos | IDs `REQ-F001-001`, descrição observável e origem |
| Aceite | IDs `AC-F001-001`, requisitos relacionados, cenário, resultado esperado e método de verificação |
| Dependências | Contratos de modelos e módulos com ID, caminho e versão exata |
| Restrições | Limites técnicos ou de produto realmente aplicáveis à feature |
| Decisões e dúvidas | Referências a ADRs, hipóteses identificadas e pendências com impacto |

Cada requisito DEVE ter ao menos um critério de aceite. Cada critério DEVE definir o que comprova seu cumprimento. Termos como “rápido”, “seguro” ou “intuitivo” exigem definição operacional quando forem condições de aceite.

### 4.2. Parte operacional: context.md

DEVE registrar:

- Estado da feature: `specified`, `implementing`, `verifying`, `done` ou `blocked`.
- Último commit verificado, como SHA completo, e existência de alterações ainda não commitadas no momento do registro.
- Resumo do que foi feito, com referências a arquivos, requisitos e decisões.
- Verificações executadas e falhas conhecidas, apontando para `evidence.md`.
- Pendências, bloqueios concretos e próximo passo executável.
- Hipóteses ainda não verificadas e seus impactos.

O estado `done` exige todos os critérios de aceite atendidos e verificações obrigatórias aprovadas na revisão avaliada. `blocked` exige descrever o impedimento e a condição para removê-lo. Um resumo de sessão não pode declarar sucesso sem evidência.

### 4.3. Invariantes de contexto

- **CTX-001:** fatos, hipóteses e decisões DEVEM ser distinguíveis.
- **CTX-002:** requisitos DEVEM apontar para sua origem; inferências DEVEM ser identificadas.
- **CTX-003:** o contexto DEVE pertencer à feature da branch ativa.
- **CTX-004:** mudança de escopo DEVE atualizar o contrato e explicitar o impacto nos critérios existentes.
- **CTX-005:** uma nova sessão DEVE ler projeto, contrato da feature, contexto operacional e dependências relevantes antes de alterar código.
- **CTX-006:** segredos e dados pessoais desnecessários NÃO DEVEM integrar os artefatos.
- **CTX-007:** fontes externas mutáveis DEVEM ter revisão, versão ou ressalva de que seu conteúdo não está fixado.

## 5. Contrato de modelo

Define significado e validade dos dados independentemente do módulo que os manipula.

Seções obrigatórias:

| Seção | Conteúdo exigido |
| --- | --- |
| Semântica | Conceito representado e termos correspondentes no glossário |
| Identidade | Como instâncias são identificadas, ou declaração de que é objeto de valor |
| Estrutura | Campo, tipo, obrigatoriedade, nulabilidade, unidade, formato e valor padrão quando houver |
| Invariantes | Regras `INV-<modelo>-001` que DEVEM ser verdadeiras em todo estado válido |
| Ciclo de vida | Estados, transições permitidas, condições e estados finais, ou justificativa de não aplicação |
| Representações | Mapeamento entre domínio, transporte e persistência; identificar representações iguais intencionalmente |
| Validação | Onde cada regra é aplicada e como erros são representados |
| Evolução | Compatibilidade, consumidores afetados e migração quando necessária |
| Exemplos | Pelo menos um caso válido e casos inválidos representativos das regras |
| Verificação | Referências aos testes ou verificações de cada invariante |

### Invariantes de modelo

- **MODL-001:** tipo estrutural e significado de domínio DEVEM ser definidos; `string` sozinho não define um identificador, moeda ou data.
- **MODL-002:** ausência, `null`, vazio e zero DEVEM ter semântica explícita quando admitidos.
- **MODL-003:** valores monetários DEVEM declarar moeda, precisão e arredondamento; datas DEVEM declarar formato e interpretação de fuso quando aplicável.
- **MODL-004:** estados inválidos DEVEM ser rejeitados na fronteira responsável; dados legados incompatíveis exigem tratamento explícito.
- **MODL-005:** alterações de representação persistida ou pública DEVEM avaliar consumidores e migração antes de serem consideradas compatíveis.

Exemplo ilustrativo: `Money` contém `amountMinor` inteiro e `currency` de um conjunto declarado. Uma regra de proibição de valores negativos só existe se o domínio a exigir; não deve ser inferida do nome do modelo.

## 6. Contrato de módulo

Define uma fronteira pública de comportamento. Um módulo pode ser biblioteca, componente, serviço ou subsistema; não precisa corresponder a uma pasta.

Seções obrigatórias:

| Seção | Conteúdo exigido |
| --- | --- |
| Responsabilidade | Capacidade oferecida e responsabilidades pertencentes a outros módulos |
| Interface pública | Operações ou eventos identificados por `OP-<modulo>-001`, entradas e saídas referenciando modelos |
| Precondições | O que o chamador deve garantir e o comportamento diante de violação |
| Pós-condições | O que o módulo garante em caso de sucesso |
| Falhas | Erros observáveis, condições de ocorrência, efeitos parciais e possibilidade de repetição |
| Efeitos | Escritas, mensagens, chamadas externas, recursos alterados e limites transacionais |
| Concorrência | Ordenação, conflitos, idempotência e garantias de entrega quando aplicáveis |
| Dependências | Interfaces públicas consumidas, com contratos e versões exatas |
| Acesso | Regras de autorização e tratamento de dados exigidos por essa fronteira, quando aplicáveis |
| Limites operacionais | Metas mensuráveis de latência, capacidade ou disponibilidade somente quando exigidas |
| Verificação | Cenários de sucesso, erro e borda vinculados às operações e garantias |
| Evolução | Consumidores afetados, estratégia de compatibilidade e migração |

Seções condicionais DEVEM informar `não se aplica` com uma justificativa curta quando isso evitar ambiguidade.

### Invariantes de módulo

- **MOD-001:** consumidores DEVEM depender da interface pública; acesso a detalhes internos exige mudança explícita da fronteira.
- **MOD-002:** entradas e saídas DEVEM referenciar modelos definidos ou primitivas com semântica suficiente.
- **MOD-003:** sucesso, falha e efeitos parciais DEVEM ser distinguíveis pelo consumidor.
- **MOD-004:** garantias de atomicidade, idempotência e entrega NÃO DEVEM ser presumidas.
- **MOD-005:** comportamento implementado DEVE corresponder às pós-condições, inclusive em cenários de erro especificados.

Exemplo ilustrativo: `Orders.createOrder` recebe `CreateOrderInput`, retorna `Order` ou erros definidos e declara se reserva estoque. Se houver chave de idempotência, o contrato deve definir escopo, duração e comportamento para reutilização com dados diferentes.

## 7. Rastreabilidade e evidências

`evidence.md` DEVE conter uma tabela por feature:

| Critério | Contratos e regras relacionados | Verificação | Resultado | Revisão avaliada |
| --- | --- | --- | --- | --- |
| AC-F001-001 | MOD-orders@1.0.0 / OP-orders-001; MODL-order@1.0.0 / INV-order-001 | Comando, teste ou procedimento manual reproduzível | pass, fail ou pending | SHA completo |

Cada registro inclui data, resumo observado e referência ao resultado quando necessário. Verificação manual DEVE identificar o responsável e os passos. Ausência de evidência é `pending`, nunca `pass`.

A revisão avaliada é o commit de código e contratos sobre o qual a verificação rodou. O commit seguinte pode registrar apenas a evidência: não é necessário criar um ciclo impossível em que o documento contenha o SHA do próprio commit. Se código, contrato ou configuração relevante mudar, as evidências afetadas precisam ser renovadas.

## 8. Versões e branches

### Versão semântica

- **PATCH:** correção editorial sem alterar obrigações, significado ou conjunto de entradas e saídas válidas.
- **MINOR:** capacidade ou informação adicional compatível com os consumidores existentes e obrigações já assumidas.
- **MAJOR:** mudança incompatível de comportamento, significado, precondições ou obrigações; remoções e restrições de valores antes aceitos entram aqui.

A compatibilidade DEVE ser analisada na direção de consumo. Adicionar um valor a uma enumeração de saída pode quebrar consumidores que fazem tratamento exaustivo. Não classificar adições automaticamente como MINOR.

Em `0.x`, mudanças incompatíveis DEVEM ao menos incrementar MINOR e ser marcadas como incompatíveis no registro de mudança. Após a primeira adoção estável, usar `1.0.0` e aplicar MAJOR para incompatibilidades.

O Git identifica o estado exato do conjunto de arquivos; a versão semântica expressa a evolução das obrigações. `context.md` e `evidence.md` usam histórico Git, sem número semântico independente. Mudanças no contrato da feature seguem as mesmas regras de compatibilidade considerando o escopo e os compromissos de aceite.

### Uma branch por feature

1. Criar `feature/F001-<nome>` a partir da base escolhida e registrar o commit-base.
2. Definir o contrato de contexto e os contratos de modelos e módulos necessários.
3. Implementar código e atualizar os contratos na mesma branch.
4. Atualizar o contexto nas pausas relevantes e registrar evidências das revisões verificadas.
5. Revisar código, contratos, dependências e critérios de aceite no mesmo PR.
6. Integrar em `main` preservando os documentos. A branch pode ser removida após o merge.

Features independentes partem de `main`. Uma feature dependente de outra DEVE declarar essa dependência; se usar branch empilhada, o PR deve explicitar a base e ser atualizado após a integração da dependência.

Se duas features alterarem o mesmo contrato compartilhado, a integração DEVE resolver a compatibilidade semântica e renovar as verificações afetadas. Resolver apenas o conflito textual não é suficiente.

### Fixação das skills

`skills.lock.json` DEVE identificar cada skill usada pelo nome, origem, commit imutável e hash SHA-256 dos arquivos efetivamente utilizados, incluindo recursos lidos ou executados. Skills locais ainda sem commit podem ser identificadas pelo hash, mas essa condição deve ser explícita. O conteúdo correspondente deve permanecer recuperável no Git ou em origem fixada acessível.

Isso permite recuperar as instruções e o contexto documental utilizados. Não garante reprodução exata de respostas de IA ou de sistemas externos.

## 9. Papel das skills

Cada skill deste processo DEVE declarar suas entradas, precondições, saídas, verificações e condição de encerramento:

| Atividade | Entradas | Saídas e condição de conclusão |
| --- | --- | --- |
| Especificar | Pedido, projeto, glossário e fontes relevantes | Contrato da feature com requisitos e aceite rastreáveis; pendências identificadas |
| Modelar | Requisitos e linguagem do domínio | Contratos de modelos com invariantes e regras de evolução |
| Definir módulos | Requisitos e modelos | Interfaces, garantias, erros, efeitos e dependências explícitos |
| Implementar | Contratos definidos para o trecho de trabalho | Código e verificações correspondentes, sem ampliar silenciosamente o escopo |
| Revisar | Diff, contratos e evidências | Violações e lacunas identificadas por ID, com distinção entre regra obrigatória e sugestão |
| Registrar retomada | Estado real do trabalho | Contexto operacional atualizado e próximo passo executável |

Uma skill DEVE interromper somente a parte dependente de informação ausente e registrar a lacuna; trabalho independente pode continuar. Conflitos entre pedido e contrato exigem explicitar a alteração necessária, respeitando a intenção mais recente do usuário. Nenhuma skill pode declarar aprovação humana inexistente ou publicar alterações externas sem autorização aplicável.

## 10. Verificação proposta

A implementação local está em `scripts/contracts.mjs`; após aplicação ao clone, fica em `contract-tools/scripts/contracts.mjs`. Os contratos gerados usam JSON entre delimitadores YAML `---`, um subconjunto YAML válido, para permitir validação sem dependências externas. `templates/README.md` descreve requisitos, aceite, invariantes, operações e evidências estruturados. Mantenha esses dados coerentes com as seções Markdown. O validador verifica os registros estruturados; a revisão verifica a semântica e a tabela de evidências.

Validação automática deve verificar cabeçalhos, IDs únicos, referências existentes, versões declaradas correspondentes, branch da feature e cobertura dos critérios na tabela de evidências. Em PRs, a branch deve ser obtida dos metadados do PR, pois o checkout de CI pode estar em detached HEAD.

Testes verificam as invariantes dos modelos e os comportamentos dos módulos. Revisão humana ou assistida avalia significado, escopo, compatibilidade e suficiência das evidências. Um campo preenchido ou um link existente não prova conformidade semântica.

Um PR está apto à integração quando todos os critérios obrigatórios possuem evidência válida para a revisão relevante, verificações exigidas passaram, dependências estão consistentes e não há pendência que impeça o escopo entregue. Mecanismos de bloqueio em CI e proteção de branches precisam ser implementados separadamente.
