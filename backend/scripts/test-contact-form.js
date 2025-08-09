const fetch = require('node-fetch');

async function testContactForm() {
  try {
    console.log('🧪 Testing contact form functionality...\n');
    
    // Test 1: Check if contact endpoint is accessible
    console.log('1️⃣ Testing contact endpoint accessibility...');
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message'
        })
      });
      
      const result = await response.json();
      console.log('Response status:', response.status);
      console.log('Response body:', result);
      
    } catch (error) {
      console.error('❌ Contact endpoint test failed:', error.message);
    }
    
    // Test 2: Check email service configuration
    console.log('\n2️⃣ Testing email service...');
    const emailService = require('../services/emailService');
    
    try {
      const connectionTest = await emailService.testConnection();
      console.log('Email connection test:', connectionTest ? '✅ Success' : '❌ Failed');
    } catch (error) {
      console.error('❌ Email connection test failed:', error.message);
    }
    
    // Test 3: Check environment variables
    console.log('\n3️⃣ Checking email environment variables...');
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('SMTP_APP_PASSWORD:', process.env.SMTP_APP_PASSWORD ? '✅ Set' : '❌ Missing');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
    
    // Test 4: Check database connection
    console.log('\n4️⃣ Testing database connection...');
    try {
      const { Contact } = require('../models');
      const testContact = await Contact.create({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        status: 'new'
      });
      
      console.log('✅ Database test successful, contact ID:', testContact.id);
      
      // Clean up test contact
      await testContact.destroy();
      console.log('✅ Test contact cleaned up');
      
    } catch (error) {
      console.error('❌ Database test failed:', error.message);
    }
    
    console.log('\n🎉 Contact form testing completed!');
    
  } catch (error) {
    console.error('❌ Test script failed:', error.message);
  }
}

testContactForm();