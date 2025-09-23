// Test API endpoints locally first
console.log('🧪 Testing API handlers locally...\n');

// Test health handler
console.log('Testing health.js:');
try {
  const healthHandler = require('./api/health.js');
  const mockReq = { method: 'GET', url: '/api/health' };
  const mockRes = {
    status: (code) => ({ json: (data) => console.log(`  Status ${code}:`, data) })
  };
  healthHandler(mockReq, mockRes);
} catch (error) {
  console.error('  Error:', error.message);
}

// Test test handler
console.log('\nTesting test.js:');
try {
  const testHandler = require('./api/test.js');
  const mockReq = { method: 'GET', url: '/api/test' };
  const mockRes = {
    status: (code) => ({ json: (data) => console.log(`  Status ${code}:`, data) })
  };
  testHandler(mockReq, mockRes);
} catch (error) {
  console.error('  Error:', error.message);
}

console.log('\n✅ Local tests complete!');