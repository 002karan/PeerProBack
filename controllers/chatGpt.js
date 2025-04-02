const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://models.inference.ai.azure.com",
    defaultHeaders: { "api-key": process.env.OPENAI_API_KEY }, // Required for Azure
});
const chatGpt =async (req, res) =>
{
    try {
        const { prompt } = req.body;

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            temperature: 1.0,
            max_tokens: 100,
            model: "gpt-4o",
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch response" });
    }
}

module.exports = chatGpt;