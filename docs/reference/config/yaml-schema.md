---
title: "Configuration Schema"
category: "Reference"
---

# bmdrm.yaml Specification

The configuration file controls the build process and runtime settings.

## Full Example

```yaml
version: 2

project:
  name: "My Documentation"
  region: "us-east-1"

build:
  command: "npm run build"
  output_dir: "out"
  node_version: "20.x"

routes:
  - src: "/api/*"
    dest: "functions/api.js"
  - src: "/(.*)"
    dest: "/index.html"

security:
  headers:
    "X-Frame-Options": "DENY"
    "X-XSS-Protection": "1; mode=block"

env:
  production:
    API_URL: "https://api.prod.bmdrm.com"
  staging:
    API_URL: "https://api.stage.bmdrm.com"
```

## Properties

### `version` (Required)
Must be `2`.

### `build`
*   **command**: The shell command to build your static assets.
*   **output_dir**: The directory containing index.html after build.
