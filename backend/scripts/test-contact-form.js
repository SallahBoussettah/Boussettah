// Load environment variables from the correct path
require('dotenv').config();

async function testContactForm() {
  try {
    console.log('🧪 Testing contact form functionality...\n');
    
    // Test 1: Check environment variables first
    console.log('1️⃣ Checking environment variables...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('SMTP_APP_PASSWORD:', process.env.SMTP_APP_PASSWORD ? '✅ Set' : '❌ Missing');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
    
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
      console.log('\n❌ Email credentials missing! Check .env file and restart PM2 with --update-env');
      return;
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
      
      // Just test if we can query the table
      const contactCount = await Contact.count();
      console.log('✅ Database connection successful');
      console.log(`📊 Current contacts in database: ${contactCount}`);
      
    } catch (error) {
      console.error('❌ Database test failed:', error.message);
    }
    
    console.log('\n🎉 Contact form testing completed!');
    
  } catch (error) {
    console.error('❌ Test script failed:', error.message);
  }
}

testContactForm();