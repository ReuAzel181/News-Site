const { put } = require('@vercel/blob');

async function testBlob() {
  try {
    console.log('Testing Vercel Blob...');
    console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
    console.log('Token length:', process.env.BLOB_READ_WRITE_TOKEN?.length);
    
    // Test with simple text content
    const testContent = 'Hello World Test';
    const filename = `test-${Date.now()}.txt`;
    
    console.log('Attempting upload with filename:', filename);
    
    const result = await put(filename, testContent, {
      access: 'public',
    });
    
    console.log('Upload successful!');
    console.log('URL:', result.url);
    console.log('Download URL:', result.downloadUrl);
    
  } catch (error) {
    console.error('Blob test failed:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });
testBlob();