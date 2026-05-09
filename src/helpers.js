export const extractResponseText = (data) => {
    if (typeof data?.output_text === 'string' && data.output_text.trim()) {
        return {
            reasoning: '',
            messages: data.output_text.trim()
        }
    }

    if (Array.isArray(data?.output)) {
        const reasoning = data.output
            .filter((item) => item.type === 'reasoning')
            .flatMap((item) => item.content
                .filter((part) => part.type === 'reasoning_text')
                .map((part) => part.text))
            .join('\n')
            .trim();
        const messages = data.output
            .filter((item) => item.type === 'message' && item.role === 'assistant')
            .flatMap((item) => item.content
                .filter((part) => part.type === 'output_text')
                .map((part) => part.text))
            .join('\n')
            .trim();

        return {
            reasoning,
            messages,
        }
    }

    return null;
};

const ansiEscapeCodes = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    inverse: '\x1b[7m',
    strikethrough: '\x1b[9m'
};

export const formatTextWithAnsiCodes = (text, type) => {
    switch (type) {
        case 'reasoning':
            return `${ansiEscapeCodes.italic}${text}${ansiEscapeCodes.reset}`;
        case 'message':
            return text; // No special formatting for messages
        default:
            return text; // Return unformatted text for unknown types
    }
}