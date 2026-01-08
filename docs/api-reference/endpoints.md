---
title: API Endpoints
order: 1
category: "API Reference"
---

# API Reference

Interact with the BMDRM platform programmatically.

## Base URL
`https://api.bmdrm.com/v1`

## Authentication
Include your API key in the `Authorization` header.

```http
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Get All Projects

Returns a list of all projects associated with the API key.

**Request**

```bash
curl -X GET https://api.bmdrm.com/v1/projects \
  -H "Authorization: Bearer <token>"
```

**Response**

```json
{
  "data": [
    {
      "id": "proj_123",
      "name": "My Documentation",
      "status": "active",
      "created_at": "2023-10-01T12:00:00Z"
    },
    {
      "id": "proj_456",
      "name": "Landing Page",
      "status": "archived",
      "created_at": "2023-09-15T08:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1
  }
}
```

### Create a Project

Creates a new project.

**Request**

```bash
curl -X POST https://api.bmdrm.com/v1/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Project", "region": "us-east-1"}'
```
