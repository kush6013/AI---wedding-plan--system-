// Prompt Builder - creates structured prompts for the AI
// Each function builds a specific type of prompt based on wedding data
// The prompts instruct the AI to return structured JSON output

/**
 * Builds a prompt for generating a function-wise video plan
 * @param {Object} wedding - wedding details
 * @param {Object} func - function details (Haldi, Mehendi, etc.)
 * @returns {string} - the complete prompt string
 */
const buildFunctionVideoPlanPrompt = (wedding, func) => {
  return `You are a professional Indian wedding video planner and cinematographer.

Generate a detailed function-wise video planning guide for the following wedding function.

WEDDING DETAILS:
- Couple: ${wedding.coupleName}
- Wedding Theme: ${wedding.weddingTheme || 'Traditional Indian'}
- Wedding Location: ${wedding.weddingLocation}
- Wedding City: ${wedding.weddingCity || 'Not specified'}
- Guest Count: ${wedding.guestCount || 'Not specified'}
- Wedding Description: ${wedding.weddingDescription || 'No description provided'}

FUNCTION DETAILS:
- Function Name: ${func.functionName}
- Date: ${func.date ? new Date(func.date).toLocaleDateString('en-IN') : 'Not specified'}
- Time: ${func.startTime || 'Not specified'} to ${func.endTime || 'Not specified'}
- Venue: ${func.venue || 'Not specified'}
- Description: ${func.description || 'No description'}
- Importance: ${func.importance || 'medium'}

Generate a JSON response with this EXACT structure (no extra text, just valid JSON):
{
  "functionName": "${func.functionName}",
  "recommendedDuration": "e.g. 45-60 seconds",
  "mood": "Description of the mood/tone for this function's video",
  "importantMoments": ["list of key moments to capture"],
  "mustCaptureShots": ["essential shots that must be in the video"],
  "cinematicShots": ["creative/artistic shot suggestions"],
  "candidMoments": ["suggested candid/uncut moments to capture"],
  "familyMoments": ["important family interactions to record"],
  "coupleMoments": ["special couple moments specific to this function"],
  "decorShots": ["decoration and venue shots to capture"],
  "entryExitShots": ["entrance and exit moment suggestions"],
  "suggestedMusicStyle": "music genre/style recommendation",
  "transitionSuggestions": ["video transition ideas between scenes"],
  "editingNotes": ["practical editing tips for the editor"]
}

Rules:
- Provide practical, actionable advice
- Keep suggestions relevant to the specific function type
- Consider Indian wedding traditions and customs
- Return ONLY valid JSON, no markdown or extra text
- Make suggestions specific to the couple's theme and location`;
};

/**
 * Builds a prompt for generating an overall wedding highlight video plan
 * @param {Object} wedding - wedding details
 * @param {Array} functions - list of all functions
 * @returns {string} - the complete prompt string
 */
const buildHighlightVideoPlanPrompt = (wedding, functions) => {
  // Format all functions into a readable string
  const functionsList = functions
    .map(
      (f) =>
        `- ${f.functionName}: ${f.date ? new Date(f.date).toLocaleDateString('en-IN') : 'TBD'} at ${f.venue || 'TBD'} (Importance: ${f.importance || 'medium'})`
    )
    .join('\n');

  return `You are a professional Indian wedding highlight video director.

Create a complete wedding highlight video structure plan for the following wedding.

WEDDING DETAILS:
- Couple: ${wedding.coupleName}
- Wedding Theme: ${wedding.weddingTheme || 'Traditional Indian'}
- Wedding Location: ${wedding.weddingLocation}
- Wedding City: ${wedding.weddingCity || 'Not specified'}
- Guest Count: ${wedding.guestCount || 'Not specified'}
- Wedding Description: ${wedding.weddingDescription || 'No description provided'}

WEDDING FUNCTIONS:
${functionsList || 'No functions added yet'}

Generate a JSON response with this EXACT structure (no extra text, just valid JSON):
{
  "coupleName": "${wedding.coupleName}",
  "totalRecommendedDuration": "e.g. 5-7 minutes",
  "openingSequence": {
    "title": "Opening",
    "description": "How to start the highlight video",
    "duration": "e.g. 30-45 seconds",
    "shots": ["specific shots for this section"],
    "musicMood": "music suggestion"
  },
  "sections": [
    {
      "title": "Section name (e.g. Couple Introduction, Mehendi, Haldi, etc.)",
      "description": "What happens in this section",
      "duration": "e.g. 45-60 seconds",
      "shots": ["specific shots"],
      "transitions": "transition suggestions",
      "musicMood": "music suggestion"
    }
  ],
  "emotionalClimax": {
    "title": "Emotional Peak",
    "description": "The most emotional part of the video",
    "duration": "e.g. 30-45 seconds",
    "shots": ["specific shots"],
    "musicMood": "music suggestion"
  },
  "endingSequence": {
    "title": "Ending",
    "description": "How to close the highlight video",
    "duration": "e.g. 20-30 seconds",
    "shots": ["specific shots"],
    "musicMood": "music suggestion"
  },
  "overallMusicDirection": "General music direction for the entire video",
  "colorGradingSuggestion": "Color grading style recommendation",
  "editingStyle": "Overall editing style recommendation",
  "keyTransitions": ["important transition points in the video"]
}

Rules:
- Arrange sections in a logical emotional progression
- Build from fun/energetic to emotional/romantic
- Consider the flow between different functions
- Include practical timing for each section
- Return ONLY valid JSON, no markdown or extra text`;
};

/**
 * Builds a prompt for generating album design suggestions
 * @param {Object} wedding - wedding details
 * @param {Array} functions - list of all functions
 * @returns {string} - the complete prompt string
 */
const buildAlbumDesignPrompt = (wedding, functions) => {
  const functionsList = functions
    .map((f) => `- ${f.functionName} (Importance: ${f.importance || 'medium'})`)
    .join('\n');

  return `You are a professional Indian wedding album designer.

Create a complete wedding album design concept for the following wedding.

WEDDING DETAILS:
- Couple: ${wedding.coupleName}
- Wedding Theme: ${wedding.weddingTheme || 'Traditional Indian'}
- Wedding Location: ${wedding.weddingLocation}
- Wedding City: ${wedding.weddingCity || 'Not specified'}
- Wedding Description: ${wedding.weddingDescription || 'No description provided'}

WEDDING FUNCTIONS:
${functionsList || 'No functions added yet'}

Generate a JSON response with this EXACT structure (no extra text, just valid JSON):
{
  "albumTheme": "Overall album theme name",
  "colorPalette": ["primary color", "secondary color", "accent color", "background color"],
  "typographySuggestion": "Font style recommendation for text overlays",
  "coverConcept": {
    "title": "Cover page concept",
    "description": "Detailed cover page design idea",
    "elements": ["specific design elements to include"]
  },
  "pageStructure": [
    {
      "pageNumber": 1,
      "section": "Section name (e.g. Cover, Mehendi, Haldi, etc.)",
      "title": "Page title",
      "description": "What this page should contain",
      "photoCount": "suggested number of photos",
      "layoutType": "layout style (e.g. single large photo, grid, collage)"
    }
  ],
  "layoutSuggestions": [
    {
      "section": "Which section this applies to",
      "suggestion": "Detailed layout suggestion"
    }
  ],
  "photoSelectionAdvice": [
    "General tips for selecting photos for each section"
  ],
  "totalRecommendedPages": "e.g. 40-60 pages",
  "closingPageConcept": {
    "description": "How the album should end",
    "elements": ["design elements for the closing page"]
  }
}

Rules:
- Design should match the wedding theme
- Color palette should complement Indian wedding aesthetics
- Photo arrangement should tell a story
- Include practical page count recommendations
- Return ONLY valid JSON, no markdown or extra text`;
};

module.exports = {
  buildFunctionVideoPlanPrompt,
  buildHighlightVideoPlanPrompt,
  buildAlbumDesignPrompt,
};
