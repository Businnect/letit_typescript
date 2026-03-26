import { afterAll, describe, expect, test } from "vitest";

import { client, removeValue, repositoryLogo, uniqueName } from "./live-api.helpers";

const createdJobSlugs: string[] = [];

afterAll(async () => {
  for (const slug of createdJobSlugs.splice(0)) {
    await client.job.delete(slug).catch(() => undefined);
  }
});

describe("live API job", () => {
  test("creates and deletes a job", async () => {
    const companyLogo = await repositoryLogo();

    const response = await client.job.createWithCompany({
      companyName: uniqueName("letit-typescript-acme"),
      companyDescription: "Remote-first company.",
      companyWebsite: "https://acme.example",
      jobTitle: "Senior TypeScript Developer",
      jobDescription: "Build SDKs and APIs.",
      jobHowToApply: "https://acme.example/apply",
      companyLogo,
      jobLocation: "REMOTE",
    });

    createdJobSlugs.push(response.slug);

    expect(response.slug).not.toBe("");

    await client.job.delete(response.slug);

    removeValue(createdJobSlugs, response.slug);
  });
});