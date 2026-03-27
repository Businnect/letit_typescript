import { ClientContext } from "./client";

export interface AdminBlog {
  body: string;
  category: string;
  cover: string;
  is_featured: boolean;
  published_at: string;
  slug: string;
  summary: string;
  title: string;
}

export interface ListAdminBlogsRequest {
  title?: string;
  category?: string;
  skip?: number;
  limit?: number;
}

export interface ListAdminBlogsResponse {
  list: AdminBlog[];
  total_list: number;
  total_pages: number;
}

export type GetAdminBlogResponse = AdminBlog | null;

export class BlogResource {
  readonly #context: ClientContext;

  constructor(context: ClientContext) {
    this.#context = context;
  }

  async list(request: ListAdminBlogsRequest = {}): Promise<ListAdminBlogsResponse> {
    const query = new URLSearchParams();

    if (request.title) {
      query.set("title", request.title);
    }

    if (request.category) {
      query.set("category", request.category);
    }

    if (request.skip !== undefined) {
      query.set("skip", String(request.skip));
    }

    if (request.limit !== undefined) {
      query.set("limit", String(request.limit));
    }

    const search = query.toString();
    const path = `/api/v1/client/admin/blog/list${search ? `?${search}` : ""}`;
    const body = await this.#context.send(path, {
      method: "GET",
    });

    return JSON.parse(body) as ListAdminBlogsResponse;
  }

  async get(slug: string): Promise<GetAdminBlogResponse> {
    const query = new URLSearchParams();
    query.set("slug", slug);

    const body = await this.#context.send(`/api/v1/client/admin/blog?${query.toString()}`, {
      method: "GET",
    });

    return JSON.parse(body) as GetAdminBlogResponse;
  }
}