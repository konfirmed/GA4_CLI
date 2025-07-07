#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

console.log('🧠 GA4 CLI Setup');
console.log('==========================================');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  const continueSetup = readline.question('Do you want to update it? (y/n): ');
  if (continueSetup.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    process.exit(0);
  }
}

console.log('\n📋 You need to set up Google OAuth2 credentials first:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Create a new project or select an existing one');
console.log('3. Enable the Google Analytics Data API');
console.log('4. Go to "APIs & Services" > "Credentials"');
console.log('5. Create "OAuth 2.0 Client ID" for "Desktop Application"');
console.log('6. Download the credentials JSON file');

console.log('\n🔑 Enter your OAuth2 credentials:');
const clientId = readline.question('CLIENT_ID: ');
const clientSecret = readline.question('CLIENT_SECRET: ');

if (!clientId || !clientSecret) {
  console.log('❌ Both CLIENT_ID and CLIENT_SECRET are required!');
  process.exit(1);
}

// Create .env file
const envContent = `CLIENT_ID=${clientId}
CLIENT_SECRET=${clientSecret}
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📊 Try running your first report:');
  console.log('npm run build');
  console.log('node dist/index.js report -p YOUR_PROPERTY_ID -m users -d country');
  
  console.log('\n💡 Need help finding your property ID?');
  console.log('Go to Google Analytics > Admin > Property Details');
  console.log('The property ID is the numeric value (e.g., 123456789)');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error);
  process.exit(1);
}
