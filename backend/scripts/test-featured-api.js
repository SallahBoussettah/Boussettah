require('dotenv').config();
const { default: fetch } = require('node-fetch');

async function testFeaturedAPI() {
  try {
    console.log('🧪 Testing Featured Projects API...');
    console.log('API URL:', 'http://localhost:5000/api/projects/featured');
    
    const response = await fetch('http://localhost:5000/api/projects/featured?limit=6');
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
    if (data.projects && Array.isArray(data.projects)) {
      console.log(`📊 Found ${data.projects.length} featured projects`);
      data.projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.category}) - Featured: ${project.featured}`);
      });
    } else {
      console.log('⚠️  No projects array found in response');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFeaturedAPI();