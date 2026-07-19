import Groq from 'groq-sdk';
import { getLanguageDetails } from './localizationService.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.AI_MODEL || 'llama-3.1-8b-instant';

export const translateText = async (text, targetLangCode) => {
  if (!text || text.trim().length === 0) return text;
  if (!process.env.GROQ_API_KEY || targetLangCode === 'en') return text;

  const targetLang = getLanguageDetails(targetLangCode);

  const prompt = `You are the StadiumOS AI Translation Engine.
Translate the following text into ${targetLang.name} (${targetLang.nativeName}).

CRITICAL CONTEXT PRESERVATION RULES:
1. DO NOT translate stadium specific identifiers, such as:
   - Gate names (e.g., Gate A, Gate C)
   - Parking zones (e.g., P2, P4)
   - Exits (e.g., Exit D, Exit 4)
   - Seat/Section identifiers (e.g., Seat A12, Section E)
   - IDs (e.g., Ticket ID, Match ID, Volunteer ID)
2. DO NOT translate acronyms (e.g., VIP, SOS).
3. Ensure tone is professional and helpful.
4. Return ONLY the translated text. No pleasantries, no quotes around the response, no JSON.

Text to translate:
"${text}"`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: MODEL,
      temperature: 0.1,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error('Translation failed:', error.message);
    return text;
  }
};
