# LetIt TypeScript SDK

A professional TypeScript client for the LetIt API, featuring high-performance support for Microposts and Job management.

## Requirements

- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Available scripts

```bash
npm run build
npm run dev
npm run typecheck
npm run test:live
```

## Usage

```ts
import { createClient } from "letit";

const client = createClient({
	baseUrl: "https://api.letit.com",
	apiKey: "token"
});

const micropost = await client.micropost.create({
	body: "Hello from TypeScript",
	title: "Update"
});

console.log(micropost.public_id);
```

## Tests

These tests hit the production Letit API.

```bash
set LETIT_API_TOKEN=your-token
npm run test:live
```
