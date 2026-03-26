import { readFile } from "node:fs/promises";

import { PRODUCTION_BASE_URL, createClient, type FilePayload } from "../src/index";

const apiKey = process.env.LETIT_API_TOKEN;

if (!apiKey) {
  throw new Error("LETIT_API_TOKEN must be set to run live API integration tests");
}

export const liveApiBaseUrl = process.env.LETIT_BASE_URL ?? PRODUCTION_BASE_URL;

export const client = createClient({
  apiKey,
  baseUrl: liveApiBaseUrl,
});

export function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function removeValue(values: string[], value: string): void {
  const index = values.indexOf(value);

  if (index >= 0) {
    values.splice(index, 1);
  }
}

export async function repositoryLogo(): Promise<FilePayload> {
  const bytes = await readFile(new URL("../.github/logo.png", import.meta.url));

  return {
    filename: "logo.png",
    bytes,
    mimeType: "image/png",
  };
}