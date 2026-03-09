import { describe, expect, it } from "vitest";

import { applyAnswers, createEmptyResume, gapAnalysis } from "../index.js";

describe("assistant", () => {
  it("generates questions for weak highlights and applies answers", async () => {
    const resume = createEmptyResume();
    resume.experience.push({
      id: "11111111-1111-4111-8111-111111111111",
      company: "Acme",
      title: "Product Manager",
      date_range: {
        start: "2024-01",
        ongoing: true,
      },
      highlights: ["Helped improve onboarding flow"],
      achievement_ids: [],
    });

    const analysis = await gapAnalysis(resume, { maxQuestions: 3, llm: null });
    expect(analysis.questions.length).toBeGreaterThan(0);

    const firstQuestion = analysis.questions[0];
    const result = await applyAnswers(
      resume,
      {
        [firstQuestion.id]: "increased conversion by 12%",
      },
      {
        questions: analysis.questions,
        llm: null,
      },
    );

    expect(result.resume.experience[0]?.highlights[0]).toContain("12%");
  });
});
