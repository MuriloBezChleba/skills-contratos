---
{
  "id": "CTX-F001",
  "kind": "context",
  "version": "0.1.0",
  "status": "ready",
  "owner": "usuário solicitante",
  "introduced_by": "F001",
  "depends_on": [],
  "supersedes": null,
  "feature": "F001",
  "branch": "feature/F001-contract-workflow",
  "base_commit": "4ae2317ddb22b046e26455e4f9c9b3aaaf62212d",
  "requirements": [
    {
      "id": "REQ-F001-001",
      "description": "Todas as skills promovidas devem compartilhar contexto versionável de projeto e feature.",
      "source": "Pedido do usuário nesta sessão: skills como contratos, contexto compartilhado no GitHub e uma branch por feature."
    },
    {
      "id": "REQ-F001-002",
      "description": "Cada feature deve usar uma branch e contratos rastreáveis de requisitos, dados e comportamento.",
      "source": "Pedido do usuário nesta sessão: skills como contratos, contexto compartilhado no GitHub e uma branch por feature."
    },
    {
      "id": "REQ-F001-003",
      "description": "A adaptação deve preservar o empacotamento upstream, as políticas de invocação e o histórico.",
      "source": "Pedido do usuário nesta sessão: skills como contratos, contexto compartilhado no GitHub e uma branch por feature."
    }
  ],
  "acceptance": [
    {
      "id": "AC-F001-001",
      "requirements": [
        "REQ-F001-001"
      ],
      "scenario": "Inspecionar o checkout adaptado e executar verificações locais.",
      "expected": "Todas as skills promovidas devem compartilhar contexto versionável de projeto e feature.",
      "verification": "node --test contract-tools/tests/integration.test.mjs; node scripts/sync-plugin-version.mjs --check"
    },
    {
      "id": "AC-F001-002",
      "requirements": [
        "REQ-F001-002"
      ],
      "scenario": "Inspecionar o checkout adaptado e executar verificações locais.",
      "expected": "Cada feature deve usar uma branch e contratos rastreáveis de requisitos, dados e comportamento.",
      "verification": "node --test contract-tools/tests/integration.test.mjs; node scripts/sync-plugin-version.mjs --check"
    },
    {
      "id": "AC-F001-003",
      "requirements": [
        "REQ-F001-003"
      ],
      "scenario": "Inspecionar o checkout adaptado e executar verificações locais.",
      "expected": "A adaptação deve preservar o empacotamento upstream, as políticas de invocação e o histórico.",
      "verification": "node --test contract-tools/tests/integration.test.mjs; node scripts/sync-plugin-version.mjs --check"
    }
  ]
}
---

## Problema e resultado

Transformar as skills em um fluxo com contratos e contexto compartilhado recuperável pelo Git.

## Escopo

Adaptar oito entrypoints, acrescentar contexto comum às 29 skills promovidas, registrar modelos e módulos, atualizar documentação e ferramentas locais. Não há publicação ou instalação global neste trabalho.

## Fontes

Pedido do usuário nesta sessão; CONTRATOS.md; instruções upstream em CLAUDE.md.

## Requisitos

Ver requirements no cabeçalho.

## Aceite

Ver acceptance no cabeçalho; critérios possuem evidências pendentes até revisão commitada.

## Dependências

Nenhum contrato de produto externo é necessário para esta adaptação de ferramentas.

## Restrições

Preservar licença e histórico; não publicar no repositório upstream.

## Decisões e dúvidas

Contexto canônico em context/ e contracts/. CI e instalação global ficam fora do escopo.
