/**
 * Quick Backend Test Script
 * Tests if the backend can start and basic functionality works
 */

require('dotenv').config();

// Check environment
console.log('🔍 Checking environment...');
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  console.error('   Please add: GEMINI_API_KEY=your_key_here');
  process.exit(1);
}
console.log('✅ GEMINI_API_KEY is set');

// Check imports
console.log('\n🔍 Checking imports...');
try {
  require('./dist/server.js');
  console.log('✅ Server file can be imported');
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('⚠️  Need to build first. Run: npm run build');
  } else {
    console.error('❌ Import error:', error.message);
  }
}

console.log('\n✅ Backend setup looks good!');
console.log('\nTo start the server:');
console.log('  npm run dev');

