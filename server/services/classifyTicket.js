import "dotenv/config";
import Groq from "groq-sdk"

console.log("API key loaded:", !!process.env.LLM_API_KEY);

const groq = new Groq({ apiKey: process.env.LLM_API_KEY});

async function classifyTicket(title, description) {
  const prompt = `You are a support ticket triage assistant. Given a ticket, respond with ONLY valid JSON, no markdown, no explanation, in this exact shape:
{
  "category": "Billing" | "Technical" | "Bug" | "Other",
  "urgency": "Low" | "Medium" | "High",
  "suggestedResponse": "a short 1-2 sentence draft reply to the customer"
}

Ticket title: ${title}
Ticket description: ${description}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const raw = completion.choices[0].message.content;
  console.log(raw);

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse LLM response:", raw);
    throw new Error("LLM returned invalid JSON");
  }
}

export default classifyTicket;