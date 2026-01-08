---
title: "JavaScript SDK Setup"
category: "SDKs"
---

# Getting Started with JavaScript SDK

The BMDRM JavaScript SDK is written in TypeScript and supports both Node.js and Browser environments.

## Installation

```bash
npm install @bmdrm/sdk
# or
yarn add @bmdrm/sdk
```

## Initialization

Initialize the client with your public key.

```javascript
import { BMDRMClient } from '@bmdrm/sdk';

const client = new BMDRMClient({
  apiKey: 'pk_live_123456789',
  region: 'us-east-1',
  retries: 3
});

// Verify connection
await client.ping();
console.log('Connected to BMDRM!');
```

## Streaming Data

```javascript
const stream = client.createStream('financial-events');

stream.write({
  symbol: 'AAPL',
  price: 150.23,
  timestamp: Date.now()
});

stream.on('error', (err) => {
  console.error('Stream failed:', err);
});
```
