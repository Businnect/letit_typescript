import { afterAll, describe, expect, test } from "vitest";

import { client, removeValue, uniqueName } from "./live-api.helpers";

const createdMicropostIds: string[] = [];

afterAll(async () => {
  for (const publicId of createdMicropostIds.splice(0)) {
    await client.micropost.delete(publicId).catch(() => undefined);
  }
});

describe("live API micropost", () => {
  test("creates and deletes a micropost", async () => {
    const response = await client.micropost.create({
      body: uniqueName("The TypeScript SDK is now live"),
      title: uniqueName("New Update"),
      postType: "TEXT",
    });

    createdMicropostIds.push(response.public_id);

    expect(response.public_id).not.toBe("");
    expect(response.link.trim()).not.toBe("");

    await client.micropost.delete(response.public_id);

    removeValue(createdMicropostIds, response.public_id);
  });

  test("edits micropost vote", async () => {
    const response = await client.micropost.create({
      body: uniqueName("Vote toggle test body"),
      title: uniqueName("Vote toggle test title"),
      postType: "TEXT",
    });

    createdMicropostIds.push(response.public_id);

    const vote = await client.micropost.vote(response.public_id);
    expect(typeof vote.user_voted).toBe("boolean");

    await client.micropost.delete(response.public_id);

    removeValue(createdMicropostIds, response.public_id);
  });
});