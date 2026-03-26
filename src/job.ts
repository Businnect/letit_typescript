import { ClientContext } from "./client";
import { toBlob, type FilePayload } from "./shared";

export interface UserJobCreatedByUser {
  slug: string;
}

export type JobLocation = "REMOTE" | "ONSITE" | "HYBRID";

export interface CreateJobWithCompanyRequest {
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  jobTitle: string;
  jobDescription: string;
  jobHowToApply: string;
  jobPayInCryptocurrency?: boolean;
  companyLogo?: FilePayload;
  jobLocation?: JobLocation;
}

export class JobResource {
  readonly #context: ClientContext;

  constructor(context: ClientContext) {
    this.#context = context;
  }

  async createWithCompany(request: CreateJobWithCompanyRequest): Promise<UserJobCreatedByUser> {
    const form = new FormData();
    form.set("company_name", request.companyName);
    form.set("company_description", request.companyDescription);
    form.set("company_website", request.companyWebsite);
    form.set("job_title", request.jobTitle);
    form.set("job_description", request.jobDescription);
    form.set("job_how_to_apply", request.jobHowToApply);
    form.set(
      "job_pay_in_cryptocurrency",
      String(request.jobPayInCryptocurrency ?? false)
    );
    form.set("job_location", request.jobLocation ?? "REMOTE");

    if (request.companyLogo) {
      form.set("company_logo", toBlob(request.companyLogo), request.companyLogo.filename);
    }

    const body = await this.#context.send("/api/v1/client/job", {
      method: "POST",
      body: form,
    });

    return JSON.parse(body) as UserJobCreatedByUser;
  }

  async delete(slug: string): Promise<void> {
    await this.#context.send("/api/v1/client/job", {
      method: "DELETE",
      body: JSON.stringify({ slug }),
    });
  }
}