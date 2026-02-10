# NexaDesk DevOps Platform

## 📌 Overview

NexaDesk is a cloud-native microservices demo platform demonstrating real-world DevOps, CI/CD, Docker and Kubernetes deployment practices.

Services:

- Frontend — React + Vite SPA served via Nginx
- API — Node.js REST backend
- Worker — Background job processor exposing metrics

The project includes CI pipelines, Docker image builds, Kubernetes staging/production environments and operational runbook procedures.

---

## 🧱 Architecture

Traffic Flow:

User → Ingress → Frontend → API → Worker

Containers are built via GitHub Actions and stored in:
ghcr.io/luisflpdev/

---

## 📂 Project Structure

apps/
api/
worker/
frontend/

environments/
staging/
prod/

.github/workflows/

RUNBOOK.md

---

## 🚀 CI/CD Pipelines

### CI

Runs on Pull Request and Push:

- Dependency install
- Lint validation
- Build validation

### Release

Builds Docker images and prepares Kubernetes deployment update.

---

## ☸ Kubernetes Environments

### Staging

Namespace:
nexadesk-staging

Deploy:
kubectl apply -f environments/staging/

---

### Production

Namespace:
nexadesk-prod

Deploy:
kubectl apply -f environments/prod/

---

## 🔍 Health Endpoints

API:
/healthz
/readyz
/version

Worker:
:9090/healthz
:9090/metrics

Frontend:
/

---

## 🌐 Ingress Routing

/ → Frontend
/api/\* → API

---

## 📊 Observability

Worker exposes Prometheus-ready metrics endpoint:
/metrics

---

## 🔐 Security

- Namespace isolation per environment
- No secrets stored in repository
- Images stored in GHCR registry

---

## 🧠 DevOps Practices Demonstrated

- CI/CD pipelines
- Docker multi-stage builds
- Kubernetes manifests
- Environment separation (staging/prod)
- Health probes and readiness checks
- Operational runbook usage

---

## 👨‍💻 Author

Luís Costa  
Computer Engineering Student — DevOps / Cloud Focus
