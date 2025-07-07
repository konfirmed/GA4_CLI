#!/usr/bin/env node

// Simple test script to verify CLI functionality
const { execSync } = require('child_process');

console.log('🧪 Testing GA4 CLI...\n');

// Test 1: Basic help
console.log('✅ Testing basic help...');
try {
  const helpOutput = execSync('node dist/index.js --help', { encoding: 'utf8' });
  console.log('✅ Help command works');
} catch (error) {
  console.log('❌ Help command failed:', error.message);
}

// Test 2: Custom help
console.log('✅ Testing custom help...');
try {
  const customHelpOutput = execSync('node dist/index.js help', { encoding: 'utf8' });
  console.log('✅ Custom help works');
} catch (error) {
  console.log('❌ Custom help failed:', error.message);
}

// Test 3: Report command help
console.log('✅ Testing report command help...');
try {
  const reportHelpOutput = execSync('node dist/index.js report --help', { encoding: 'utf8' });
  console.log('✅ Report help works');
} catch (error) {
  console.log('❌ Report help failed:', error.message);
}

// Test 4: Compare command help
console.log('✅ Testing compare command help...');
try {
  const compareHelpOutput = execSync('node dist/index.js compare --help', { encoding: 'utf8' });
  console.log('✅ Compare help works');
} catch (error) {
  console.log('❌ Compare help failed:', error.message);
}

// Test 5: Events command help
console.log('✅ Testing events command help...');
try {
  const eventsHelpOutput = execSync('node dist/index.js events --help', { encoding: 'utf8' });
  console.log('✅ Events help works');
} catch (error) {
  console.log('❌ Events help failed:', error.message);
}

// Test 6: Pages command help
console.log('✅ Testing pages command help...');
try {
  const pagesHelpOutput = execSync('node dist/index.js pages --help', { encoding: 'utf8' });
  console.log('✅ Pages help works');
} catch (error) {
  console.log('❌ Pages help failed:', error.message);
}

console.log('\n🎉 All CLI tests completed!');
console.log('\n📋 Next steps:');
console.log('1. Set up your Google Cloud project and enable Analytics API');
console.log('2. Create OAuth2 credentials');
console.log('3. Set CLIENT_ID and CLIENT_SECRET in .env file');
console.log('4. Run: ga4-cli report -p YOUR_PROPERTY_ID -m users -d country');
console.log('\n📖 See README.md for detailed setup instructions.');
