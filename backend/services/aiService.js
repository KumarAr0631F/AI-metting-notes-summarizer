// aiService.js

import fetch from "node-fetch";

export async function generateSummary(text, prompt) {
    const apiKey = process.env.GROQ_API_KEY;
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    const body = {
        model: "llama-3.1-8b-instant", // generic Groq model
        messages: [
            { role: "system", content: prompt || "Summarize the following meeting notes:" },
            { role: "user", content: text }
        ],
        max_tokens: 200
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No summary generated.";
}
