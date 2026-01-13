
const fs = require('fs');
const path = require('path');
const https = require('https');

// 1. Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';

console.log(`Reading key from: ${envPath}`);

try {
    if (fs.existsSync(envPath)) {
        const data = fs.readFileSync(envPath, 'utf8');
        const match = data.match(/OPENAI_API_KEY=(.+)/);
        if (match && match[1]) {
            apiKey = match[1].trim();
        }
    }
} catch (e) {
    console.error("Could not read .env.local", e);
}

if (!apiKey) {
    console.error("❌ ERROR: No OPENAI_API_KEY found in .env.local");
    console.log("Please make sure you have created 'frontend/.env.local' and added your key.");
    process.exit(1);
}

// 2. Test Key
console.log(`Testing Key (starts with): ${apiKey.substring(0, 5)}...`);

const req = https.request({
    hostname: 'api.openai.com',
    path: '/v1/models',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Nodejs-Test-Script'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log("\n✅ SUCCESS: Your OpenAI API key is VALID and working!");
            console.log("The server responded with HTTP 200.");
        } else {
            console.log(`\n❌ FAILED: The server responded with HTTP ${res.statusCode}`);
            try {
                const json = JSON.parse(data);
                console.error("Error Message:", json.error ? json.error.message : data);
                if (json.error && json.error.code === 'insufficient_quota') {
                    console.log("\n>>> TIP: You have run out of credits. Check billing at https://platform.openai.com/account/billing");
                }
                if (json.error && json.error.code === 'invalid_api_key') {
                    console.log("\n>>> TIP: The key is incorrect. Check for extra spaces or typos.");
                }
            } catch (e) {
                console.error("Raw Response:", data);
            }
        }
    });
});

req.on('error', e => console.error("\n❌ Network Error:", e.message));
req.end();
