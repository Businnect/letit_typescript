# LetIt TypeScript SDK

A professional TypeScript client for the LetIt API, featuring high-performance support for Microposts and Job management.

## API Documentation

For detailed information on the underlying REST API, endpoints, and authentication schema, see the official documentation:

- API Reference: https://api.letit.com/docs/client/

## Features

- Job Management: Create job postings with company metadata, application details, and logo uploads.
- Micropost System: Create text or media microposts with multipart file support.
- Admin Blog Listing: List public admin blogs with optional filters and pagination.
- Typed Client API: Use typed request and response contracts for client, job, and micropost flows.
- Error Handling: Non-success responses throw `LetitApiError` with HTTP status and raw response body.

## Installation

```bash
npm install letit
```

## Quick Start

### Initialize the Client

Create a client with your API token and optional base URL.

```ts
import { createClient } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});
```

### Create a Job with a Company Logo

The SDK handles multipart form creation and file uploads for job posting requests.

```ts
import { readFile } from "node:fs/promises";

import { createClient, type FilePayload } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});

const companyLogo: FilePayload = {
	filename: "logo.png",
	bytes: await readFile("./logo.png"),
	mimeType: "image/png",
};

const response = await client.job.createWithCompany({
	companyName: "Acme Corp",
	companyDescription: "Building next-gen developer tools.",
	companyWebsite: "https://acme.example",
	jobTitle: "Senior TypeScript Developer",
	jobDescription: "Building production SDKs and integrations.",
	jobHowToApply: "https://acme.example/careers",
	companyLogo,
	jobLocation: "REMOTE",
});

console.log(`Job created successfully: ${response.slug}`);
```

### Create a Micropost

Create a micropost with a title, body, and optional media attachment.

```ts
import { createClient } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});

const response = await client.micropost.create({
	title: "New Update",
	body: "The TypeScript SDK is now live!",
	postType: "TEXT",
});

console.log(`Post created with ID: ${response.public_id}`);
```

### Edit a Micropost Vote

Toggle your vote for a micropost using its public ID.

```ts
import { createClient } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});

const vote = await client.micropost.vote("public-id-of-micropost");
console.log(`Current vote state: ${vote.user_voted}`);
```

### List Public Admin Blogs

Retrieve public admin blogs and apply optional filters such as title, category, and pagination.

```ts
import { createClient } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});

const blogs = await client.blog.list({
	title: "release",
	category: "ANNOUNCEMENT",
	skip: 0,
	limit: 10,
});

console.log(`Loaded ${blogs.list.length} blogs out of ${blogs.total_list}`);
```

### Get Public Admin Blog By Slug

Retrieve a single public admin blog by slug. The API may return `null` if no article matches.

```ts
import { createClient } from "letit";

const client = createClient({
	apiKey: "your-api-token",
	baseUrl: "https://api.letit.com",
});

const article = await client.blog.get("my-blog-slug");

if (!article) {
	console.log("No article found for this slug");
} else {
	console.log(`Found article: ${article.title}`);
}
```

## Environment Variables

The integration tests use the following environment variables:

- `LETIT_API_TOKEN`: API token used to authenticate against the live LetIt API.
- `LETIT_BASE_URL`: Optional override for the API base URL. Defaults to `https://api.letit.com`.

## Testing

Run the test suite using the standard Node.js toolchain.

```bash
npm run typecheck
npm run build
```

To run the live API integration tests:

```powershell
$env:LETIT_API_TOKEN="your-token"
npm run test:live
```

```bash
LETIT_API_TOKEN="your-token" npm run test:live
```