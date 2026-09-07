// AI Service - handles communication with OpenRouter (an OpenAI-compatible API)
// This is the ONLY place where we call the AI provider.
// All controllers use this service instead of calling the AI directly.

// We still use the official "openai" npm package.
// OpenRouter speaks the SAME API format as OpenAI,
// so we can reuse this SDK and just change the server address (baseURL).
const OpenAI = require('openai');

// We create the OpenRouter client lazily (only when AI is actually used).
// This way, the server can start even if OPENROUTER_API_KEY is not set yet.
// The user only needs the key when they click "Generate".
let openrouter = null;

// Function to get the OpenRouter client.
// It is created on first use so the server doesn't crash at startup.
const getOpenRouterClient = () => {
  if (!openrouter) {
    // The OpenAI SDK needs to know WHICH server to talk to.
    // baseURL points the SDK at OpenRouter instead of OpenAI.
    openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }
  return openrouter;
};

/**
 * Sends a prompt to OpenRouter and returns the AI response
 * @param {string} prompt - the prompt to send to the AI
 * @returns {Object} - parsed JSON response from the AI
 */
const generateAIResponse = async (prompt) => {
  try {
    // Check for the API key first and give a friendly error
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error(
        'OPENROUTER_API_KEY is not set. Add it to your .env file in the server folder.'
      );
    }

    // Get (or create) the OpenRouter client
    const client = getOpenRouterClient();

    // Call OpenRouter with the model from OPENROUTER_MODEL.
    // Defaults to "openrouter/free", OpenRouter's free model router.
    const completion = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional Indian wedding video and album planning expert. Always respond with valid JSON only, no markdown formatting, no code blocks, no extra text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Controls creativity (0 = strict, 1 = creative)
      max_tokens: 4000, // Maximum length of AI response
    });

    // Extract the text content from AI response
    const content = completion.choices[0].message.content.trim();

    // Parse the JSON response
    // Sometimes the AI wraps JSON in ```json ... ``` so we need to clean it
    let cleanedContent = content;
    if (content.startsWith('```')) {
      // Remove markdown code block markers
      cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    }

    // Parse the cleaned string into a JavaScript object
    const parsed = JSON.parse(cleanedContent);
    return parsed;
  } catch (error) {
    // If JSON parsing fails, the AI didn't return valid JSON
    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON. Please try again.');
    }
    throw error;
  }
};

module.exports = { generateAIResponse };