const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('🧪 Testing upload functionality...');
    
    // Test 1: Check if upload route is accessible
    console.log('\n1️⃣ Testing upload route accessibility...');
    const testResponse = await fetch('http://localhost:5000/api/upload/test');
    const testResult = await testResponse.json();
    console.log('✅ Upload route test:', testResult);
    
    // Test 2: Check if uploads directory exists
    console.log('\n2️⃣ Checking uploads directory...');
    const uploadsDir = path.join(__dirname, '../uploads/art');
    if (fs.existsSync(uploadsDir)) {
      console.log('✅ Uploads directory exists:', uploadsDir);
      const files = fs.readdirSync(uploadsDir);
      console.log(`📁 Files in directory: ${files.length}`);
      if (files.length > 0) {
        console.log('📄 Recent files:', files.slice(-3));
      }
    } else {
      console.log('❌ Uploads directory does not exist');
    }
    
    // Test 3: Check server health
    console.log('\n3️⃣ Testing server health...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthResult = await healthResponse.json();
    console.log('✅ Server health:', healthResult);
    
    console.log('\n🎉 Upload system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUpload();