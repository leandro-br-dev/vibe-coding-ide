// Simple test script to check if the FileExplorer functionality works
console.log('Testing File Explorer functionality...');

// This script would be run in the browser DevTools console
const testFileExplorer = () => {
  // Check if electronAPI is available
  if (typeof window !== 'undefined' && window.electronAPI) {
    console.log('✅ ElectronAPI is available');
    
    // Test project opening
    console.log('🧪 Testing project opening...');
    window.electronAPI.openProject({ projectPath: '' })
      .then(result => {
        console.log('✅ Project opened successfully:', result);
      })
      .catch(error => {
        console.log('❌ Project opening failed:', error);
      });
      
  } else {
    console.log('❌ ElectronAPI not available - preload script issue');
  }
};

// Export for use in DevTools
if (typeof window !== 'undefined') {
  window.testFileExplorer = testFileExplorer;
}