---
title: "Integrating with Auth0"
category: "Tutorials"
---

# Auth0 Integration Guide

Secure your documentation portal using Auth0 as an Identity Provider (IdP).

## 1. Configure Auth0

1.  Log in to your Auth0 Dashboard.
2.  Navigate to **Applications**.
3.  Create a new **Regular Web App**.
4.  Set the **Allowed Callback URLs** to:
    `http://localhost:3000/api/auth/callback`

## 2. Environment Variables

Create a `.env.local` file with your credentials.

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
```

## 3. Middleware Protection

Protect your routes using Next.js Middleware.

```javascript
// middleware.js
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: '/docs/protected/:path*',
};
```
