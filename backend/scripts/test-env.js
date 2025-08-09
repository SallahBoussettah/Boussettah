require('dotenv').config();

console.log('🔍 Environment Variables Test');
console.log('============================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('');
console.log('📧 Email Configuration:');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL || '❌ MISSING');
console.log('SMTP_APP_PASSWORD:', process.env.SMTP_APP_PASSWORD ? '✅ SET (length: ' + process.env.SMTP_APP_PASSWORD.length + ')' : '❌ MISSING');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ MISSING');
console.log('');
console.log('🗄️  Database Configuration:');
console.log('DB_HOST:', process.env.DB_HOST || '❌ MISSING');
console.log('DB_NAME:', process.env.DB_NAME || '❌ MISSING');
console.log('DB_USER:', process.env.DB_USER || '❌ MISSING');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ SET' : '❌ MISSING');

// Test email service if credentials are available
if (process.env.SMTP_EMAIL && process.env.SMTP_APP_PASSWORD) {
  console.log('\n📧 Testing email service...');
  
  const emailService = require('../services/emailService');
  
  emailService.testConnection()
    .then(result => {
      console.log('Email connection test:', result ? '✅ SUCCESS' : '❌ FAILED');
    })
    .catch(error => {
      console.log('Email connection test: ❌ FAILED');
      console.log('Error:', error.message);
    });
} else {
  console.log('\n❌ Cannot test email service - missing credentials');
}