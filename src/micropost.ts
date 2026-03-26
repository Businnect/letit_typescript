import { ClientContext } from "./client";
import { toBlob, type FilePayload } from "./shared";

export interface CreatedWithPublicIdAndLink {
  public_id: string;
  link: string;
}

export type PostType = "TEXT" | "MEDIA";

export interface CreateMicropostRequest {
  body: string;
  title?: string;
  postType?: PostType;
  allowComments?: boolean;
  isDraft?: boolean;
  file?: FilePayload;
}

export class MicropostResource {
  readonly #context: ClientContext;

  constructor(context: ClientContext) {
    this.#context = context;
  }

  async create(request: CreateMicropostRequest): Promise<CreatedWithPublicIdAndLink> {
    const form = new FormData();
    form.set("body", request.body);
    form.set("post_type", request.postType ?? "TEXT");
    form.set("allow_comments", String(request.allowComments ?? true));
    form.set("is_draft", String(request.isDraft ?? false));

    if (request.title) {
      form.set("title", request.title);
    }

    if (request.file) {
      form.set("file", toBlob(request.file), request.file.filename);
    }

    const body = await this.#context.send("/api/v1/client/micropost", {
      method: "POST",
      body: form,
    });

    return JSON.parse(body) as CreatedWithPublicIdAndLink;
  }

  async delete(publicId: string): Promise<void> {
    await this.#context.send("/api/v1/client/micropost", {
      method: "DELETE",
      body: JSON.stringify({ public_id: publicId }),
    });
  }
}