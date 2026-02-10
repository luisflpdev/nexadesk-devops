# NexaDesk DevOps Runbook

## 📌 Purpose

This runbook provides operational procedures for deploying, validating and responding to incidents in the NexaDesk platform.

This document is designed to support safe deployments and fast incident recovery for staging and production environments.

---

## ☸ Environments

### Staging

Namespace:
nexadesk-staging

Deploy command:
kubectl apply -f environments/staging/

---

### Production

Namespace:
nexadesk-prod

Deploy command:
kubectl apply -f environments/prod/

---

## 🚀 Deployment Checklist

Before deployment:

[ ] CI Pipeline passed  
[ ] Docker images built successfully  
[ ] Kubernetes manifests validated  
[ ] No failing pods in cluster  
[ ] Ingress configuration valid

Verify images exist:
docker pull ghcr.io/luisflpdev/nexadesk-api:latest
docker pull ghcr.io/luisflpdev/nexadesk-frontend:latest
docker pull ghcr.io/luisflpdev/nexadesk-worker:latest

---

## 🧪 Post Deployment Validation

Check Pods:
kubectl get pods -n nexadesk-staging
kubectl get pods -n nexadesk-prod

Check Services:
kubectl get svc -n nexadesk-staging
kubectl get svc -n nexadesk-prod

Check Ingress:
kubectl get ingress -A

---

## ❤️ Health Checks

API:
GET /healthz  
GET /readyz

Worker:
GET :9090/healthz  
GET :9090/metrics

Frontend:
Open browser root URL

---

## 📊 Observability

Worker exposes Prometheus metrics:
/metrics

---

## 🚨 Incident Response

### Pod Crash

Check logs:
kubectl logs <pod-name> -n <namespace>

Restart deployment:
kubectl rollout restart deployment <deployment-name> -n <namespace>

---

### Image Pull Failure

Check image exists in GHCR:
ghcr.io/luisflpdev/

Redeploy:
kubectl rollout restart deployment <deployment-name> -n <namespace>

---

### Service Unreachable

Check endpoints:
kubectl get endpoints -n <namespace>

Check ingress rules:
kubectl describe ingress -n <namespace>

---

### High Error Rate

Check logs and restart if needed:
kubectl logs <pod-name> -n <namespace>
kubectl rollout restart deployment <deployment-name> -n <namespace>

---

## 🔄 Rollback Procedure

View rollout history:
kubectl rollout history deployment <deployment-name> -n <namespace>

Rollback:
kubectl rollout undo deployment <deployment-name> -n <namespace>

---

## 🔐 Security Notes

- Do not store secrets in repository
- Use environment isolation (staging/prod)
- Validate container sources before deploy

---

## 🧠 Operational Best Practices

- Always deploy to staging first
- Monitor logs for first 10 minutes after deploy
- Validate health endpoints after deployment
- Keep rollback command ready before production deploy

---

## 👨‍💻 Maintainer

Luís Costa  
Computer Engineering — DevOps / Cloud Engineering
