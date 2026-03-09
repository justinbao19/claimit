import { describe, expect, it } from "vitest";

import { applyAnswers, createEmptyResume, gapAnalysis } from "../index.js";

describe("assistant", () => {
  it("returns an empty-state score for a blank resume", async () => {
    const resume = createEmptyResume();

    const analysis = await gapAnalysis(resume, { maxQuestions: 3, llm: null });

    expect(analysis.completeness_score).toBe(0);
    expect(analysis.questions).toEqual([]);
    expect(analysis.summary).toContain("No resume content found yet");
  });

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
    expect(firstQuestion).toBeDefined();
    if (!firstQuestion) {
      throw new Error("Expected the heuristic analysis to return at least one question.");
    }

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
