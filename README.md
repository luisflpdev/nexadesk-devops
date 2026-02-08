# NexaDesk — Release Confiável com CI/CD, GitOps e Observabilidade

Este repositório demonstra uma proposta DevOps ponta a ponta para a plataforma SaaS NexaDesk:

- API (Node.js), Worker assíncrono (Node.js) e Frontend (SPA)
- Deploy em Kubernetes (cluster existente) e banco gerenciado fora do cluster

## Problema atual (resumo)

- Deploy manual e dependente de janelas: 7 a 12 dias do merge até produção
- Incidentes pós-release e rollback manual
- Baixa visibilidade (logs sem correlação entre serviços)

## Objetivo (60 dias)

Reduzir lead time e aumentar confiabilidade com evidências usando:

- CI/CD declarativo (GitHub Actions)
- GitOps (Argo CD) com ambientes versionados (staging/prod)
- Observabilidade (métricas, logs e tracing) e práticas SRE (SLIs/SLOs)
- Métricas DORA para medir evolução

## Estrutura do repositório

- apps/: serviços (api, worker, frontend)
- .github/workflows/: pipelines
- environments/staging e environments/prod: manifests Kubernetes por ambiente

## Fluxo de entrega (resumo)

1. PR -> CI (lint/test)
2. Merge na main -> build/push de imagens
3. Atualização de manifests em staging
4. Argo CD aplica staging
5. Promoção para prod (aprovação) -> Argo CD aplica prod

## Runbook

Veja RUNBOOK.md (checklist de deploy + resposta a incidentes)
