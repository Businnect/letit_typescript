import { describe, expect, test } from "vitest";

import { LetitClient } from "../src/index";
import { liveApiBaseUrl, uniqueName } from "./live-api.helpers";

describe("live API client", () => {
  test("rejects invalid API token", async () => {
    const invalidClient = new LetitClient({
      apiKey: "fake-key",
      baseUrl: liveApiBaseUrl,
    });

    await expect(
      invalidClient.micropost.create({
        body: "Hello from invalid token test",
        title: uniqueName("invalid-token"),
      })
    ).rejects.toMatchObject({
      name: "LetitApiError",
      status: 401,
    });
  });
});