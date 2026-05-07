import 'dotenv/config';
import { OPENROUTER_API_KEY, OPENROUTER_API_URL, MODEL } from './config.js';
import readline from 'readline';

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

    console.log('Full API response:', JSON.stringify(data, null, 2));

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
    while (true) {
        const input = await ask('Enter your message (or type "exit" to quit): ');
        if (input.toLowerCase() === 'exit') {
            console.log('Goodbye!');
            break;
        }
        const response = await chat(input);
        console.log(response);
    }

    rl.close();
};

main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});