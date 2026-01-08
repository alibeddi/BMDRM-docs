---
title: "CLI Command Reference"
category: "Reference"
---

# CLI Reference

The `bmdrm` command line tool is your swiss-army knife for managing the platform.

## Global Flags

*   `--verbose`: Enable debug logging.
*   `--json`: Output results as JSON.
*   `--profile <name>`: Use a specific configuration profile.

## Commands

### `bmdrm login`

Authenticates the CLI with the platform.

```bash
$ bmdrm login
> Opening browser to https://auth.bmdrm.com/device...
> Success! Logged in as user@example.com
```

### `bmdrm projects list`

Lists all active projects.

```bash
$ bmdrm projects list --json
[
  {
    "id": "p-1",
    "status": "active",
    "region": "eu-west-1"
  }
]
```

### `bmdrm deploy`

Deploys the current directory.

```bash
$ bmdrm deploy . --env production
> Building assets...
> Uploading (14MB)...
> Deployed to https://bmdrm.com/p/my-app
```
