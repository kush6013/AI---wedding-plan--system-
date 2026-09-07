// Tests for the prompt builder utilities
// These tests run without a database or network connection
// Run with: npm test

const test = require('node:test');
const assert = require('node:assert');
const {
  buildFunctionVideoPlanPrompt,
  buildHighlightVideoPlanPrompt,
  buildAlbumDesignPrompt,
} = require('../src/utils/promptBuilder');

// Sample data used across tests
const sampleWedding = {
  coupleName: 'Rahul & Priya',
  weddingTheme: 'Traditional Indian',
  weddingLocation: 'The Grand Palace',
  weddingCity: 'Jaipur',
  weddingDescription: 'Royal Rajasthani wedding',
  guestCount: 500,
};

const sampleFunction = {
  functionName: 'Haldi',
  date: '2026-02-14',
  startTime: '10:00',
  endTime: '12:00',
  venue: 'Resort Lawn',
  description: 'Bright yellow ceremony',
  importance: 'high',
};

const sampleFunctions = [
  { functionName: 'Haldi', date: '2026-02-14', venue: 'Resort', importance: 'high' },
  { functionName: 'Sangeet', date: '2026-02-15', venue: 'Hall', importance: 'critical' },
];

test('buildFunctionVideoPlanPrompt includes function details', () => {
  const prompt = buildFunctionVideoPlanPrompt(sampleWedding, sampleFunction);

  assert.ok(prompt.includes('Rahul & Priya'), 'Should include couple name');
  assert.ok(prompt.includes('Haldi'), 'Should include function name');
  assert.ok(prompt.includes('Jaipur'), 'Should include wedding city');
  // Every prompt must include mustCaptureShots and editingNotes in the JSON template
  assert.ok(prompt.includes('mustCaptureShots'), 'Should specify output structure');
  assert.ok(prompt.includes('editingNotes'), 'Should specify editing notes structure');
});

test('buildHighlightVideoPlanPrompt lists all functions', () => {
  const prompt = buildHighlightVideoPlanPrompt(sampleWedding, sampleFunctions);

  assert.ok(prompt.includes('Haldi'), 'Should list Haldi');
  assert.ok(prompt.includes('Sangeet'), 'Should list Sangeet');
  assert.ok(prompt.includes('totalRecommendedDuration'), 'Should request duration');
  assert.ok(prompt.includes('emotionalClimax'), 'Should request emotional climax section');
});

test('buildHighlightVideoPlanPrompt handles empty functions', () => {
  const prompt = buildHighlightVideoPlanPrompt(sampleWedding, []);
  assert.ok(
    prompt.includes('No functions added yet'),
    'Should handle missing functions gracefully'
  );
});

test('buildAlbumDesignPrompt includes album fields', () => {
  const prompt = buildAlbumDesignPrompt(sampleWedding, sampleFunctions);

  assert.ok(prompt.includes('albumTheme'), 'Should request album theme');
  assert.ok(prompt.includes('colorPalette'), 'Should request color palette');
  assert.ok(prompt.includes('pageStructure'), 'Should request page structure');
  assert.ok(prompt.includes('photoSelectionAdvice'), 'Should request photo advice');
});

test('prompts require JSON output only', () => {
  const cases = [
    buildFunctionVideoPlanPrompt(sampleWedding, sampleFunction),
    buildHighlightVideoPlanPrompt(sampleWedding, sampleFunctions),
    buildAlbumDesignPrompt(sampleWedding, sampleFunctions),
  ];

  cases.forEach((prompt) => {
    assert.ok(
      prompt.includes('valid JSON'),
      'Prompt must instruct AI to return valid JSON'
    );
  });
});