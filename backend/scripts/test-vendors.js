/**
 * Quick vendor API connection test
 * Run: node scripts/test-vendors.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');

const QIKINK_CLIENT_ID = process.env.QIKINK_API_KEY;
const QIKINK_API_SECRET = process.env.QIKINK_API_SECRET;
const PRINTROVE_EMAIL = process.env.PRINTROVE_EMAIL;
const PRINTROVE_PASSWORD = process.env.PRINTROVE_PASSWORD;

async function testQikink() {
    console.log('\n🔵 Testing Qikink...');
    try {
        const credentials = Buffer.from(`${QIKINK_CLIENT_ID}:${QIKINK_API_SECRET}`).toString('base64');
        const res = await axios.get('https://api.qikink.com/api/products', {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            },
            params: { page: 1, per_page: 5 },
            timeout: 15000
        });
        console.log('✅ Qikink connected! Status:', res.status);
        console.log('   Products returned:', res.data?.data?.length || JSON.stringify(res.data).substring(0, 100));
    } catch (err) {
        if (err.response) {
            console.log('❌ Qikink failed:', err.response.status, JSON.stringify(err.response.data).substring(0, 200));
        } else {
            console.log('❌ Qikink error:', err.message);
        }
    }
}

async function testPrintrove() {
    console.log('\n🟣 Testing Printrove...');
    try {
        const tokenRes = await axios.post(
            'https://api.printrove.com/api/external/token',
            { email: PRINTROVE_EMAIL, password: PRINTROVE_PASSWORD },
            { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, timeout: 15000 }
        );
        const token = tokenRes.data?.access_token;
        if (!token) throw new Error('No token returned: ' + JSON.stringify(tokenRes.data));
        console.log('✅ Printrove token received! Expires:', tokenRes.data?.expires_at || 'N/A');

        // Test product catalog
        const prodRes = await axios.get('https://api.printrove.com/api/external/products', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            params: { page: 1, per_page: 5 },
            timeout: 15000
        });
        console.log('✅ Printrove catalog OK! Status:', prodRes.status);
        console.log('   Sample data:', JSON.stringify(prodRes.data).substring(0, 150));

    } catch (err) {
        if (err.response) {
            console.log('❌ Printrove failed:', err.response.status, JSON.stringify(err.response.data).substring(0, 200));
        } else {
            console.log('❌ Printrove error:', err.message);
        }
    }
}

(async () => {
    console.log('=== Vendor API Connection Test ===');
    console.log('Qikink Client ID:', QIKINK_CLIENT_ID || '(not set)');
    console.log('Printrove Email:', PRINTROVE_EMAIL || '(not set)');
    await testQikink();
    await testPrintrove();
    console.log('\n=== Done ===\n');
})();
