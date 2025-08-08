// Simple test to verify the API client works
async function testAPI() {
  try {
    console.log('🧪 Testing Frontend API Client...');
    
    const response = await fetch('http://localhost:5000/api/projects/featured?limit=6');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received:', data);
    
    if (data.projects && Array.isArray(data.projects)) {
      console.log(`📊 Found ${data.projects.length} featured projects`);
      data.projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.category})`);
      });
    }
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

// Run the test
testAPI();