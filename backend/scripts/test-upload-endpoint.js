const fetch = require('node-fetch');

async function testUploadEndpoint() {
  try {
    console.log('🧪 Testing upload endpoints on production server...\n');
    
    // Test 1: Test route accessibility
    console.log('1️⃣ Testing upload test endpoint...');
    try {
      const testResponse = await fetch('http://localhost:5000/api/upload/test');
      const testResult = await testResponse.json();
      console.log('✅ Local backend test:', testResult);
    } catch (error) {
      console.log('❌ Local backend test failed:', error.message);
    }
    
    // Test 2: Test through NGINX proxy
    console.log('\n2️⃣ Testing through NGINX proxy...');
    try {
      const proxyResponse = await fetch('https://boussettahsalah.online/api/upload/test');
      const proxyResult = await proxyResponse.json();
      console.log('✅ NGINX proxy test:', proxyResult);
    } catch (error) {
      console.log('❌ NGINX proxy test failed:', error.message);
    }
    
    // Test 3: Test upload endpoint authentication
    console.log('\n3️⃣ Testing upload endpoint authentication...');
    try {
      const uploadResponse = await fetch('https://boussettahsalah.online/api/upload/art', {
        method: 'POST'
      });
      const uploadResult = await uploadResponse.json();
      console.log('✅ Upload auth test:', uploadResult);
    } catch (error) {
      console.log('❌ Upload auth test failed:', error.message);
    }
    
    // Test 4: Test server health
    console.log('\n4️⃣ Testing server health...');
    try {
      const healthResponse = await fetch('https://boussettahsalah.online/api/health');
      const healthResult = await healthResponse.json();
      console.log('✅ Server health:', healthResult);
    } catch (error) {
      console.log('❌ Server health test failed:', error.message);
    }
    
    console.log('\n🎉 Upload endpoint testing completed!');
    console.log('\n📋 Next steps if tests fail:');
    console.log('  1. Check if backend server is running: pm2 status');
    console.log('  2. Check NGINX status: sudo systemctl status nginx');
    console.log('  3. Check NGINX error logs: sudo tail -f /var/log/nginx/error.log');
    console.log('  4. Check backend logs: pm2 logs');
    
  } catch (error) {
    console.error('❌ Test script failed:', error.message);
  }
}

testUploadEndpoint();