import { describe, expect, test } from "vitest";

import { client, uniqueName } from "./live-api.helpers";

describe("live API blog", () => {
  test("lists public admin blogs", async () => {
    const response = await client.blog.list({
      limit: 5,
      skip: 0,
    });

    expect(Array.isArray(response.list)).toBe(true);
    expect(typeof response.total_list).toBe("number");
    expect(typeof response.total_pages).toBe("number");

    if (response.list.length > 0) {
      const first = response.list.at(0);

      if (!first) {
        throw new Error("expected first blog item to exist");
      }

      expect(typeof first.slug).toBe("string");
      expect(typeof first.title).toBe("string");
      expect(typeof first.category).toBe("string");
      expect(typeof first.published_at).toBe("string");
    }
  });

  test("gets public admin blog by slug", async () => {
    const response = await client.blog.list({
      limit: 1,
      skip: 0,
    });

    if (response.list.length === 0) {
      const missing = await client.blog.get(uniqueName("non-existent-blog-slug"));
      expect(missing).toBeNull();
      return;
    }

    const first = response.list.at(0);

    if (!first) {
      throw new Error("expected first blog item to exist");
    }

    const article = await client.blog.get(first.slug);
    expect(article).not.toBeNull();

    if (!article) {
      throw new Error("expected article to exist for known slug");
    }

    expect(article.slug).toBe(first.slug);
  });
});
