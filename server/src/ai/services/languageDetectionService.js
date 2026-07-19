import Groq from 'groq-sdk';
import { SUPPORTED_LANGUAGES } from './localizationService.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

export const detectLanguage = async (text) => {
  if (!text || text.trim().length === 0) return 'en';
  
  if (!process.env.GROQ_API_KEY) {
    return 'en'; // Deterministic fallback
  }

  const prompt = `You are StadiumOS Language Detector.
Given the text, identify its language from this list of codes: ${SUPPORTED_LANGUAGES.map(l => l.code).join(', ')}.
If it's not in the list, or ambiguous, return "en".
Return ONLY the 2-letter language code in JSON format. Do not return any other text.
Format: {"language": "code"}

Text: "${text}"`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      temperature: 0.1,
      max_tokens: 20
    });

    const raw = completion.choices[0]?.message?.content || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      if (SUPPORTED_LANGUAGES.find(l => l.code === data.language)) {
        return data.language;
      }
    }
    return 'en';
  } catch (error) {
    console.error('Language detection failed:', error.message);
    return 'en';
  }
};
