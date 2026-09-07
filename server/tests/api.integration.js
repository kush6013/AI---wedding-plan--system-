// Tests for the API layer
// These tests run when a backend server is running on port 5000
// Run with: node tests/api.integration.test.js
// NOTE: Requires the server to be running AND using a local/test MongoDB

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return response.json();
};

// Simple test runner (no extra dependencies)
const tests = [];
const runTest = (name, fn) => tests.push({ name, fn });

const runAll = async () => {
  let passed = 0;
  let failed = 0;

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  PASS: ${name}`);
      passed++;
    } catch (err) {
      console.log(`  FAIL: ${name}`);
      console.log(`    Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
};

// =====================================================
// TESTS
// =====================================================

runTest('GET /api/health returns success', async () => {
  const data = await apiRequest('/health');
  if (!data.success) throw new Error('Health check should return success: true');
});

runTest('Create a wedding', async () => {
  const data = await apiRequest('/weddings', {
    method: 'POST',
    body: JSON.stringify({
      clientName: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      coupleName: 'Test Couple',
      weddingDate: '2026-12-01',
      weddingLocation: 'Test Palace',
      weddingCity: 'Test City',
      weddingDescription: 'A test wedding',
      weddingTheme: 'Traditional Indian',
      guestCount: 200,
    }),
  });

  if (!data.success) throw new Error(`Expected success, got: ${JSON.stringify(data)}`);
  global.testWeddingId = data.data._id;
});

runTest('Create wedding fails without required fields', async () => {
  const data = await apiRequest('/weddings', {
    method: 'POST',
    body: JSON.stringify({ clientName: 'Missing data' }),
  });

  if (data.success) throw new Error('Should fail without required fields');
});

runTest('Get all weddings returns array', async () => {
  const data = await apiRequest('/weddings');
  if (!data.success) throw new Error('Should succeed');
  if (!Array.isArray(data.data)) throw new Error('data should be an array');
});

runTest('Get wedding by ID', async () => {
  if (!global.testWeddingId) throw new Error('No wedding created yet');
  const data = await apiRequest(`/weddings/${global.testWeddingId}`);
  if (!data.success) throw new Error('Should succeed');
});

runTest('Create a function for the wedding', async () => {
  if (!global.testWeddingId) throw new Error('No wedding created yet');
  const data = await apiRequest('/functions', {
    method: 'POST',
    body: JSON.stringify({
      wedding: global.testWeddingId,
      functionName: 'Haldi',
      date: '2026-11-30',
      venue: 'Resort',
      importance: 'high',
    }),
  });

  if (!data.success) throw new Error(`Expected success: ${JSON.stringify(data)}`);
  global.testFunctionId = data.data._id;
});

runTest('AI function plan endpoint validation', async () => {
  const data = await apiRequest('/ai/function-video-plan', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (data.success) throw new Error('Should fail without weddingId and functionId');
});

runTest('AI function plan requires valid IDs', async () => {
  const data = await apiRequest('/ai/function-video-plan', {
    method: 'POST',
    body: JSON.stringify({ weddingId: 'invalid', functionId: 'invalid' }),
  });

  if (data.success) throw new Error('Should fail with invalid IDs');
});

runTest('Get video plans for wedding', async () => {
  if (!global.testWeddingId) throw new Error('No wedding created yet');
  const data = await apiRequest(`/weddings/${global.testWeddingId}/video-plans`);
  if (!data.success) throw new Error('Should succeed');
  if (!Array.isArray(data.data)) throw new Error('data should be an array');
});

runTest('Get album designs for wedding', async () => {
  if (!global.testWeddingId) throw new Error('No wedding created yet');
  const data = await apiRequest(`/weddings/${global.testWeddingId}/album-designs`);
  if (!data.success) throw new Error('Should succeed');
  if (!Array.isArray(data.data)) throw new Error('data should be an array');
});

runTest('Invalid wedding ID format is rejected', async () => {
  const data = await apiRequest('/weddings/not-a-valid-id');
  if (data.success) throw new Error('Should fail with invalid ID');
});

runTest('Delete the test wedding', async () => {
  if (!global.testWeddingId) throw new Error('No wedding created yet');
  const data = await apiRequest(`/weddings/${global.testWeddingId}`, {
    method: 'DELETE',
  });
  if (!data.success) throw new Error('Should succeed');
});

console.log('Running API integration tests...\n');
runAll();