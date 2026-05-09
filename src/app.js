import 'dotenv/config';
import path from 'path';
import {
    OPENROUTER_API_KEY,
    OPENROUTER_API_URL,
    MODEL,
    LOGGING_ENABLED,
    LOG_DIR_PATH
} from './config.js';
import fs from 'fs';
import readline from 'readline';
import { extractResponseText, formatTextWithAnsiCodes } from './helpers.js';

let logFilePath = '';

const chat = async (input, history = []) => {
    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            input: [...history, { type: 'message', role: 'user', content: input}],
            reasoning: { effort: 'medium' },
        }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    if (LOGGING_ENABLED) {
        fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2));
    }

    const text = extractResponseText(data);

    if (!text) {
        throw new Error('No response text found in the API response');
    }

    return {
        text,
        reasoningTokens: data?.usage?.output_tokens_details?.reasoning_tokens ?? 0
    };
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const main = async () => {
    if (LOGGING_ENABLED) {
        if (!fs.existsSync(LOG_DIR_PATH)) {
            fs.mkdirSync(LOG_DIR_PATH);
        }

        logFilePath = path.join(process.cwd(), LOG_DIR_PATH, `${new Date().toISOString().replace(/[:.]/g, '-')}.txt`);
    }
    while (true) {
        const input = await ask('Enter your message (or type "exit" to quit): ');
        if (input.toLowerCase() === 'exit') {
            console.log('Goodbye!');
            break;
        }
        const response = await chat(input);
        console.log(formatTextWithAnsiCodes(response.text.reasoning, 'reasoning'));
        console.log(formatTextWithAnsiCodes(response.text.messages, 'message'));
        console.log(`Reasoning tokens used: ${response.reasoningTokens}`);
    }

    rl.close();
};

main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});