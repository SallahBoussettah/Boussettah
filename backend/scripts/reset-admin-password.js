const { Admin } = require('../models');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetAdminPassword() {
  try {
    console.log('🔄 Admin Password Reset Tool');
    console.log('================================');
    
    // Find admin
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    
    if (!admin) {
      console.log('❌ Admin account not found!');
      process.exit(1);
    }
    
    console.log(`📧 Admin Email: ${admin.email}`);
    console.log(`👤 Admin Username: ${admin.username}`);
    console.log('');
    
    // Get new password
    const newPassword = await new Promise((resolve) => {
      rl.question('Enter new password (min 6 characters): ', (answer) => {
        resolve(answer);
      });
    });
    
    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters long!');
      process.exit(1);
    }
    
    // Confirm password
    const confirmPassword = await new Promise((resolve) => {
      rl.question('Confirm new password: ', (answer) => {
        resolve(answer);
      });
    });
    
    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      process.exit(1);
    }
    
    // Update password
    await admin.update({ password: newPassword });
    
    console.log('');
    console.log('✅ Password updated successfully!');
    console.log(`📧 Admin Email: ${admin.email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log('');
    console.log('You can now login with your new password.');
    
    rl.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    rl.close();
    process.exit(1);
  }
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n❌ Password reset cancelled.');
  rl.close();
  process.exit(0);
});

resetAdminPassword();