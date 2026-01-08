---
title: Installation
order: 1
category: "Getting Started"
---

# Installation Guide

Get up and running with BMDRM quickly.

## Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org) (v18+)
*   npm or yarn

## Quick Start

Run the following command to bootstrap a new project:

```bash
npx create-bmdrm-app@latest my-project
```

## Manual Setup

If you prefer to install dependencies manually:

```bash
# using npm
npm install bmdrm-core bmdrm-ui

# using yarn
yarn add bmdrm-core bmdrm-ui

# using pnpm
pnpm add bmdrm-core bmdrm-ui
```

### Configuration

Create a `bmdrm.config.js` file in your root directory:

```javascript
module.exports = {
  theme: 'dark',
  plugins: []
}
```
