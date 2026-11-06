# Dados estruturados dos contratos

Use `template` e `init` para gerar os documentos. O JSON do cabeçalho é canônico para validação; explique decisões e cenários no corpo Markdown. Atualize ambos ao mudar obrigações.

## Requisito e aceite (contract.md da feature)

```json
{
  "requirements": [
    {"id":"REQ-F001-001","description":"Descrição observável","source":"Fonte real, caminho ou URL e revisão/data"}
  ],
  "acceptance": [
    {"id":"AC-F001-001","requirements":["REQ-F001-001"],"scenario":"Estado inicial e ação","expected":"Resultado observável","verification":"Comando ou procedimento reproduzível"}
  ],
  "depends_on": [
    {"id":"MODL-order","path":"contracts/models/order.md","version":"1.0.0"}
  ]
}
```

## Invariante (contrato de modelo)

```json
{"invariants":[{"id":"INV-order-001","rule":"Regra real do domínio","verification":"Teste ou procedimento"}]}
```

## Operação (contrato de módulo)

```json
{"operations":[{"id":"OP-orders-001","input":"Modelo e semântica","output":"Modelo e semântica","preconditions":"Condições e tratamento da violação","postconditions":"Garantias de sucesso","errors":"Falhas observáveis e repetição","effects":"Efeitos e atomicidade","verification":"Cenários de sucesso, erro e borda"}]}
```

## Registro de evidência (evidence.md)

Para todo critério, crie um registro, inclusive enquanto não executado:

```json
{"records":[{"criterion":"AC-F001-001","rules":[],"verification":"Procedimento planejado","result":"pending","revision":null}]}
```

Depois da execução, preencha `result` com `pass` ou `fail`, `revision` com SHA completo da revisão efetivamente avaliada, `date` com data/hora ISO 8601, `observed` com resultado observado e `method` com `automated` ou `manual`. Para verificação manual, inclua `reviewer` real. Quando houver regra de modelo ou módulo relacionada, inclua em `rules` objetos com `contract`, `version` e `rule`. Nenhuma regra relacionada pode ser inventada só para preencher a tabela.

Mantenha também a tabela Markdown de evidências legível. O CLI verifica os registros estruturados; o revisor confere coerência com a tabela e suficiência do procedimento.
