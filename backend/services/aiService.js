// backend/services/aiService.js
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || process.env.LLM_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.mistral.ai/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'pixtral-12b-2409';

const VALID_CATEGORIES = ['Pothole', 'Streetlight', 'Garbage', 'Drainage', 'Water Leakage', 'Others'];

/**
 * Reads an image from a URL or local disk path and encodes it as a base64 data URL.
 */
async function imageToBase64DataUrl(imageSource) {
  // Remote URL (e.g. Cloudinary HTTPS URL)
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    const response = await axios.get(imageSource, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const mime = contentType.split(';')[0].trim();
    const buffer = Buffer.from(response.data);
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }
  // Local file fallback
  const abs = path.resolve(imageSource.replace(/^\//, ''));
  const buffer = fs.readFileSync(abs);
  const ext = path.extname(imageSource).replace('.', '').toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
    : ext === 'png' ? 'image/png'
      : ext === 'webp' ? 'image/webp'
        : 'image/jpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

/**
 * Helper to safely extract and parse JSON from LLM text response.
 */
function parseJsonResponse(rawText, fallback = {}) {
  if (!rawText || typeof rawText !== 'string') return fallback;
  try {
    const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex extraction for JSON objects or arrays
    const jsonMatch = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (subErr) {
        // failed fallback
      }
    }
    console.warn('[aiService] JSON parsing failed for response:', rawText);
    return fallback;
  }
}

/**
 * Sends the citizen-uploaded image to Mistral Vision (Pixtral) and:
 *  1. Classifies which civic-issue category the image belongs to.
 *  2. Verifies whether it is a genuine real-world civic problem photo.
 *
 * @param {string} imageFilePath  - Image URL or local relative path (e.g. /uploads/issues/xxx.jpg)
 * @param {string} userCategory   - The category the citizen chose in the form
 * @returns {{ detectedCategory: string, aiVerified: boolean, confidence: number, aiNote: string }}
 */
export async function classifyIssueImage(imageFilePath, userCategory = '') {
  if (!MISTRAL_API_KEY) {
    console.warn('[aiService] MISTRAL_API_KEY / LLM_API_KEY not set — skipping AI classification.');
    return { detectedCategory: userCategory || 'Others', aiVerified: false, confidence: 0, aiNote: 'AI key not configured.' };
  }

  let dataUrl;
  try {
    dataUrl = await imageToBase64DataUrl(imageFilePath);
  } catch (err) {
    console.warn('[aiService] Could not read image file:', err.message);
    return { detectedCategory: userCategory || 'Others', aiVerified: false, confidence: 0, aiNote: 'Image file unreadable.' };
  }

  const systemPrompt =
    `You are a civic issue classifier for a smart city platform. ` +
    `You will receive a photo uploaded by a citizen and must analyze it carefully. ` +
    `Respond ONLY with a valid JSON object — no markdown, no explanation, nothing else.`;

  const userPrompt =
    `Analyze this image and respond with a JSON object in exactly this format:
{
  "detectedCategory": "<one of: Pothole | Streetlight | Garbage | Drainage | Water Leakage | Others>",
  "aiVerified": <true if the image clearly shows a real civic problem, false if it looks fake/irrelevant>,
  "confidence": <integer 0-100 representing your confidence in the classification>,
  "aiNote": "<one sentence describing what you see in the image>"
}

Categories:
- Pothole: damaged/broken road surface, craters on road
- Streetlight: broken, missing, or non-functioning street/road lights
- Garbage: uncollected waste, overflowing bins, illegal dumping
- Drainage: blocked drains, open manholes, flooded gutters
- Water Leakage: burst pipes, water gushing/pooling from pipes, pipeline damage
- Others: any other civic infrastructure issue not in the above list

The citizen selected: "${userCategory || 'not specified'}"`;

  try {
    const payload = {
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            { type: 'text', text: userPrompt },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.1,
    };

    if (LLM_BASE_URL.includes('mistral.ai')) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await axios.post(
      `${LLM_BASE_URL}/chat/completions`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content || '';
    const parsed = parseJsonResponse(raw, {});

    const detectedCategory = VALID_CATEGORIES.includes(parsed.detectedCategory)
      ? parsed.detectedCategory
      : (userCategory || 'Others');

    return {
      detectedCategory,
      aiVerified: !!parsed.aiVerified,
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 0)),
      aiNote: parsed.aiNote || '',
    };
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error('[aiService] Mistral classification failed:', msg);
    return {
      detectedCategory: userCategory || 'Others',
      aiVerified: false,
      confidence: 0,
      aiNote: `AI classification failed: ${msg}`,
    };
  }
}

/**
 * Generates an AI-driven work plan (list of steps) for a specific civic issue based on its image.
 */
export async function generateWorkPlan(imageFilePath, category) {
  if (!MISTRAL_API_KEY) return ['Assess the site', 'Secure the area', 'Perform repairs', 'Document completion'];

  let dataUrl;
  try {
    dataUrl = await imageToBase64DataUrl(imageFilePath);
  } catch (err) {
    return ['Unable to analyze image for custom plan. Follow standard operating procedures.'];
  }

  const prompt = `Based on this photo of a ${category} issue, provide a concise 4-step technical work plan to fix it. Return ONLY a JSON array of strings, e.g. ["Step 1", "Step 2", "Step 3", "Step 4"].`;

  try {
    const response = await axios.post(`${LLM_BASE_URL}/chat/completions`, {
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: 'You are a city infrastructure engineer. Respond ONLY with a valid JSON array of 4 strings.' },
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            { type: 'text', text: prompt },
          ],
        },
      ],
      max_tokens: 350,
      temperature: 0.2,
    }, {
      headers: { Authorization: `Bearer ${MISTRAL_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const raw = response.data?.choices?.[0]?.message?.content || '[]';
    const parsed = parseJsonResponse(raw, []);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ['Inspect damage', 'Procure materials', 'Execute repair', 'Final inspection'];
  } catch (err) {
    console.error('[aiService] Mistral generateWorkPlan error:', err.response?.data?.error?.message || err.message);
    return ['Inspect damage', 'Procure materials', 'Execute repair', 'Final inspection'];
  }
}

/**
 * Verifies if a resolution photo actually shows the problem fixed compared to the original photo.
 */
export async function verifyResolution(originalImagePath, resolutionImagePath, category) {
  if (!MISTRAL_API_KEY) return { isResolved: true, note: 'AI verification skipped.' };

  try {
    const beforeUrl = await imageToBase64DataUrl(originalImagePath);
    const afterUrl = await imageToBase64DataUrl(resolutionImagePath);

    const prompt = `Compare these two images of a ${category} issue (Before and After). Determine if the issue is resolved. Respond in JSON: {"isResolved": boolean, "note": "one sentence explanation"}`;

    const payload = {
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: 'You are a quality control inspector. Respond ONLY with JSON.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: beforeUrl } },
            { type: 'image_url', image_url: { url: afterUrl } },
          ],
        },
      ],
      max_tokens: 250,
      temperature: 0.1,
    };

    if (LLM_BASE_URL.includes('mistral.ai')) {
      payload.response_format = { type: 'json_object' };
    }

    const response = await axios.post(`${LLM_BASE_URL}/chat/completions`, payload, {
      headers: { Authorization: `Bearer ${MISTRAL_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    const raw = response.data?.choices?.[0]?.message?.content || '{}';
    const parsed = parseJsonResponse(raw, { isResolved: true, note: 'AI comparison parsed fallback.' });
    return {
      isResolved: typeof parsed.isResolved === 'boolean' ? parsed.isResolved : true,
      note: parsed.note || 'AI verified resolution status.',
    };
  } catch (err) {
    console.error('[aiService] Mistral verifyResolution error:', err.response?.data?.error?.message || err.message);
    return { isResolved: true, note: 'AI comparison failed, defaulting to trust.' };
  }
}

// Legacy export kept for backward compatibility
export async function validateIssueImage(imageBuffer, category) {
  return { isReal: false, confidence: 0, description: 'Use classifyIssueImage() instead.' };
}
