// Test Firebase Storage Connection
import { storage } from './src/firebase/config.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

console.log('🔥 Testing Firebase Storage...');
console.log('Storage instance:', storage);

// Create a test file
const testContent = 'Hello Firebase Storage!';
const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });

// Test upload
const testRef = ref(storage, 'test/test.txt');

console.log('📤 Attempting to upload test file...');

uploadBytes(testRef, testFile)
  .then(async (snapshot) => {
    console.log('✅ Upload successful!');
    console.log('Snapshot:', snapshot);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('📥 Download URL:', downloadURL);
  })
  .catch(error => {
    console.error('❌ Upload failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  });
