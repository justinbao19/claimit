import { describe, expect, it } from "vitest";

import { createEmptyResume, renderToHtml } from "../index.js";

describe("render engine", () => {
  it("renders the ats template with resume content", async () => {
    const resume = createEmptyResume();
    resume.basics.name = "Jordan Resume";
    resume.experience.push({
      id: "11111111-1111-4111-8111-111111111111",
      company: "Clarity",
      title: "Lead PM",
      date_range: {
        start: "2023-01",
        ongoing: true,
      },
      highlights: ["Built an AI workflow used by 1,000 users"],
      achievement_ids: [],
    });

    const html = await renderToHtml(resume, "ats_minimal");
    expect(html).toContain("Jordan Resume");
    expect(html).toContain("Lead PM");
    expect(html).toContain("Experience");
  });
});
