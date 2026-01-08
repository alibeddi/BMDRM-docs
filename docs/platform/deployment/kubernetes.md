---
title: "Kubernetes Deployment"
category: "Platform"
---

# Deploying to Kubernetes

BMDRM is cloud-agnostic and runs natively on Kubernetes (K8s).

## Helm Charts

We provide official Helm charts for deployment.

```bash
helm repo add bmdrm https://charts.bmdrm.com
helm install my-cluster bmdrm/core --version 2.4.0
```

## Configuration (values.yaml)

Customize your deployment using `values.yaml`.

```yaml
replicaCount: 3

image:
  repository: bmdrm/core
  pullPolicy: IfNotPresent
  tag: "v2.5.0"

service:
  type: LoadBalancer
  port: 80

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi
```
