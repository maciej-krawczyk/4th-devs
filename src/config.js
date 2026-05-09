const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim() ?? "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/responses";
const MODEL = "openai/gpt-oss-120b:free";
const LOGGING_ENABLED = process.env.LOGGING_ENABLED === 'true';
const LOG_DIR_PATH = 'logs/';

export {
    OPENROUTER_API_KEY,
    OPENROUTER_API_URL,
    MODEL,
    LOGGING_ENABLED,
    LOG_DIR_PATH
};