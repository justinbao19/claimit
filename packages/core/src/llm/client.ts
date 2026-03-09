import { z } from "zod";

export interface LLMConfig {
  provider: "openai" | "anthropic" | "local";
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

function parseJsonFromText(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```json\s*([\s\S]*?)```/i)?.[1] ?? text.match(/\{[\s\S]*\}/)?.[0];
    if (!fenced) {
      throw new Error("Response did not contain valid JSON.");
    }
    return JSON.parse(fenced);
  }
}

async function callOpenAiCompatible(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!config.apiKey && config.provider !== "local") {
    throw new Error(`Missing API key for provider "${config.provider}".`);
  }

  const endpoint = config.baseUrl ?? "https://api.openai.com/v1/chat/completions";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible call failed with ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content.map((part) => part.text ?? "").join("");
    if (text) {
      return text;
    }
  }

  throw new Error("OpenAI-compatible response did not include message content.");
}

async function callAnthropic(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!config.apiKey) {
    throw new Error("Missing API key for provider \"anthropic\".");
  }

  const endpoint = config.baseUrl ?? "https://api.anthropic.com/v1/messages";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2000,
      temperature: 0.2,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic call failed with ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const text = data.content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join("");
  if (!text) {
    throw new Error("Anthropic response did not include text content.");
  }
  return text;
}

async function callProvider(config: LLMConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  if (config.provider === "anthropic") {
    return callAnthropic(config, systemPrompt, userPrompt);
  }

  return callOpenAiCompatible(config, systemPrompt, userPrompt);
}

export function resolveDefaultLLMConfig(): LLMConfig | null {
  const provider = (process.env.LLM_PROVIDER as LLMConfig["provider"] | undefined) ?? "openai";
  const model = process.env.LLM_MODEL ?? (provider === "anthropic" ? "claude-3-5-sonnet-latest" : "gpt-4.1-mini");
  const apiKey =
    provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL;

  if (!apiKey && provider !== "local" && !baseUrl) {
    return null;
  }

  return { provider, model, apiKey, baseUrl };
}

export async function llmCall<T>(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
  outputSchema: z.ZodSchema<T>,
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await callProvider(config, systemPrompt, userPrompt);
      const parsed = parseJsonFromText(response);
      return outputSchema.parse(parsed);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw new Error(`LLM output validation failed: ${lastError?.message ?? "unknown error"}`);
}
