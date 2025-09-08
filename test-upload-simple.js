const fs = require('fs');
const path = require('path');

// Create a simple test file
const testContent = 'Hello World Test Image';
const testFilePath = path.join(__dirname, 'test-image.txt');
fs.writeFileSync(testFilePath, testContent);

console.log('Test file created:', testFilePath);
console.log('File size:', fs.statSync(testFilePath).size);
console.log('\nTo test upload:');
console.log('1. Open http://localhost:3001 in browser');
console.log('2. Login as admin');
console.log('3. Try to upload an image');
console.log('4. Check terminal logs for detailed error information');