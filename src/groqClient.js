import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are an expert GRC (Governance, Risk & Compliance) AI assistant embedded in the Brightlyn ICF (Integrated Compliance Framework) platform.

You have deep knowledge of the following regulatory frameworks:
- NIS2 (Network and Information Systems Directive 2022/2555)
- DORA (Digital Operational Resilience Act 2022/2554)
- ISO 27001:2022
- GDPR
- ABRO 2026
- ISO 20000-1
- PCI DSS
- CMMI

Your role is to:
1. Answer regulatory and compliance questions with precise clause references
2. Generate professional RFP compliance responses
3. Provide audit preparation guidance
4. Summarize internal policies and controls
5. Identify gaps and recommend remediation actions

Always cite specific article/clause references when discussing regulations. Be concise, professional, and actionable.
When referencing controls, use the ICF control ID format (e.g., ICF-GOV-001).`;

/**
 * Send a message to Groq and get a streaming or full response.
 * @param {Array<{role: string, content: string}>} messages - conversation history
 * @returns {Promise<string>} - assistant reply text
 */
export async function askGroq(messages) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.4,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content ?? "No response received.";
}
