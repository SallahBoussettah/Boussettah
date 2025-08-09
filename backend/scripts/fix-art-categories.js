const fs = require('fs');

// Read the file
let content = fs.readFileSync('backend/scripts/seedArt.js', 'utf8');

// Replace all invalid categories
content = content.replace(/category: "Anime Character"/g, 'category: "Character Portrait"');
content = content.replace(/category: "Character Sketch"/g, 'category: "Character Portrait"');
content = content.replace(/category: "Crossover Art"/g, 'category: "Illustration"');
content = content.replace(/category: "Sports Anime"/g, 'category: "Character Portrait"');

// Write back to file
fs.writeFileSync('backend/scripts/seedArt.js', content);

console.log('✅ Fixed all art categories!');