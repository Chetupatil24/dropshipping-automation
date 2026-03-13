require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');

async function main() {
  // === TEST PRINTROVE ===
  console.log('\n=== PRINTROVE ===');
  try {
    const tokenRes = await axios.post('https://api.printrove.com/api/external/token', {
      email: process.env.PRINTROVE_EMAIL,
      password: process.env.PRINTROVE_PASSWORD
    }, { timeout: 10000 });
    const token = tokenRes.data.token || tokenRes.data.access_token;
    console.log('Token OK:', !!token, '| Token preview:', token ? token.substring(0, 20) + '...' : 'null');
    const h = { Authorization: 'Bearer ' + token };
    
    const endpoints = [
      '/api/external/products',
      '/api/external/catalog',
      '/api/external/product-catalog',
    ];
    for (const ep of endpoints) {
      try {
        const r = await axios.get('https://api.printrove.com' + ep, { headers: h, timeout: 10000 });
        const d = r.data;
        console.log(ep, '→', r.status, '| Keys:', Object.keys(d).join(','), '| Sample:', JSON.stringify(d).substring(0, 300));
      } catch (e) {
        console.log(ep, '→ ERR', e.response?.status, e.message.substring(0, 80));
      }
    }
  } catch (e) {
    console.log('Printrove auth failed:', e.response?.data || e.message);
  }

  // === TEST QIKINK ===
  console.log('\n=== QIKINK ===');
  try {
    const creds = Buffer.from(process.env.QIKINK_API_KEY + ':' + process.env.QIKINK_API_SECRET).toString('base64');
    const h = { Authorization: 'Basic ' + creds, 'Content-Type': 'application/json' };
    const base = process.env.QIKINK_BASE_URL || 'https://api.qikink.com';
    
    const endpoints = ['/api/products', '/api/catalog', '/api/order', '/'];
    for (const ep of endpoints) {
      try {
        const r = await axios.get(base + ep, { headers: h, timeout: 8000 });
        console.log(ep, '→', r.status, '| Sample:', JSON.stringify(r.data).substring(0, 200));
      } catch (e) {
        console.log(ep, '→ ERR', e.response?.status, e.message.substring(0, 80));
      }
    }
  } catch (e) {
    console.log('Qikink test failed:', e.message);
  }
}

main().catch(console.error);
