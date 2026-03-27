import { BlogResource } from "./blog";
import { JobResource } from "./job";
import { MicropostResource } from "./micropost";

export const PRODUCTION_BASE_URL = "https://api.letit.com";

export interface LetitClientOptions {
  baseUrl?: string;
  apiKey: string;
  fetch?: typeof fetch;
}

export class LetitApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "LetitApiError";
    this.status = status;
    this.body = body;
  }
}

export class ClientContext {
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly fetchImpl: typeof fetch;

  constructor(options: LetitClientOptions) {
    this.baseUrl = sanitizeBaseUrl(options.baseUrl ?? PRODUCTION_BASE_URL);
    this.apiKey = options.apiKey;
    this.fetchImpl = options.fetch ?? fetch;
  }

  async send(path: string, init: RequestInit): Promise<string> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "USER-API-TOKEN": this.apiKey,
        ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...init.headers,
      },
    });

    const body = await response.text();

    if (!response.ok) {
      const detail = parseApiDetail(body);
      throw new LetitApiError(detail ?? `status ${response.status}`, response.status, body);
    }

    return body;
  }
}

export class LetitClient {
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly blog: BlogResource;
  readonly micropost: MicropostResource;
  readonly job: JobResource;

  readonly #context: ClientContext;

  constructor(options: LetitClientOptions) {
    this.#context = new ClientContext(options);
    this.baseUrl = this.#context.baseUrl;
    this.apiKey = this.#context.apiKey;
    this.blog = new BlogResource(this.#context);
    this.micropost = new MicropostResource(this.#context);
    this.job = new JobResource(this.#context);
  }
}

export function createClient(options: LetitClientOptions): LetitClient {
  return new LetitClient(options);
}

function sanitizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function parseApiDetail(body: string): string | undefined {
  try {
    const payload = JSON.parse(body) as { detail?: unknown };
    return typeof payload.detail === "string" ? payload.detail : undefined;
  } catch {
    return undefined;
  }
}