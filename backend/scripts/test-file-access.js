const fs = require("fs");
const path = require("path");

function testFileAccess() {
  console.log("🔍 Testing file access and permissions...\n");

  // Test 1: Check uploads directory
  const uploadsDir = "/var/www/portfolio/backend/uploads";
  const artDir = path.join(uploadsDir, "art");

  console.log("1️⃣ Checking directories:");
  console.log(`   Uploads dir: ${uploadsDir}`);
  console.log(`   Art dir: ${artDir}`);

  if (fs.existsSync(uploadsDir)) {
    console.log("   ✅ Uploads directory exists");
    const uploadStats = fs.statSync(uploadsDir);
    console.log(`   📁 Permissions: ${uploadStats.mode.toString(8)}`);
  } else {
    console.log("   ❌ Uploads directory does not exist");
    return;
  }

  if (fs.existsSync(artDir)) {
    console.log("   ✅ Art directory exists");
    const artStats = fs.statSync(artDir);
    console.log(`   📁 Permissions: ${artStats.mode.toString(8)}`);
  } else {
    console.log("   ❌ Art directory does not exist");
    return;
  }

  // Test 2: List files in art directory
  console.log("\n2️⃣ Files in art directory:");
  try {
    const files = fs.readdirSync(artDir);
    console.log(`   📄 Found ${files.length} files`);

    files.slice(-5).forEach((file) => {
      const filePath = path.join(artDir, file);
      const stats = fs.statSync(filePath);
      console.log(
        `   - ${file} (${stats.size} bytes, ${stats.mode.toString(8)})`
      );
    });

    // Test 3: Test specific file access
    if (files.length > 0) {
      const testFile = files[files.length - 1]; // Latest file
      const testFilePath = path.join(artDir, testFile);

      console.log(`\n3️⃣ Testing access to latest file: ${testFile}`);

      try {
        fs.accessSync(testFilePath, fs.constants.R_OK);
        console.log("   ✅ File is readable");

        const stats = fs.statSync(testFilePath);
        console.log(`   📊 File stats:`);
        console.log(`      Size: ${stats.size} bytes`);
        console.log(`      Permissions: ${stats.mode.toString(8)}`);
        console.log(`      Owner: ${stats.uid}:${stats.gid}`);
        console.log(`      Modified: ${stats.mtime}`);
      } catch (error) {
        console.log("   ❌ File access error:", error.message);
      }
    }
  } catch (error) {
    console.log("   ❌ Error reading directory:", error.message);
  }

  // Test 4: Check NGINX user permissions
  console.log("\n4️⃣ Permission recommendations:");
  console.log("   Run these commands on your VPS:");
  console.log(
    "   sudo chown -R www-data:www-data /var/www/portfolio/backend/uploads"
  );
  console.log("   sudo chmod -R 755 /var/www/portfolio/backend/uploads");
  console.log("   sudo systemctl reload nginx");

  console.log("\n🎉 File access test completed!");
}

testFileAccess();
