const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim() ?? "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/responses";
const MODEL = "gpt-4o";

export { OPENROUTER_API_KEY, OPENROUTER_API_URL, MODEL };