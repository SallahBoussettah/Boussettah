const { runMigrations } = require('./runMigrations');
const { migrateResetTokens } = require('./migrate-reset-tokens');

async function setupPasswordReset() {
  try {
    console.log('🚀 Setting up password reset functionality...\n');
    
    // Step 1: Run all migrations to ensure database is up to date
    console.log('📋 Step 1: Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed\n');
    
    // Step 2: Specifically handle reset token migration
    console.log('🔐 Step 2: Setting up password reset tokens...');
    await migrateResetTokens();
    console.log('✅ Password reset setup completed\n');
    
    console.log('🎉 Password reset functionality is now ready!');
    console.log('');
    console.log('📧 Features enabled:');
    console.log('  ✅ Email verification with 6-digit codes');
    console.log('  ✅ 15-minute token expiration');
    console.log('  ✅ Secure password reset flow');
    console.log('  ✅ Rate limiting protection');
    console.log('');
    console.log('🔗 API Endpoints available:');
    console.log('  POST /api/auth/request-reset-code');
    console.log('  POST /api/auth/verify-reset-code');
    console.log('  POST /api/auth/reset-password');
    console.log('');
    console.log('🌐 Frontend: /reset-password');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupPasswordReset()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { setupPasswordReset };