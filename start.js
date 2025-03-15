/**
 * Start script for the Cover Letter Generator
 * This script starts both the Next.js frontend and the Python ML backend
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const FRONTEND_PORT = 3000;
const BACKEND_PORT = 5000;
const BACKEND_DIR = path.join(__dirname, 'backend');

// Check if Python is installed
function checkPythonInstalled() {
  try {
    const pythonProcess = spawn('python', ['--version']);
    pythonProcess.on('error', (err) => {
      console.error('❌ Python is not installed or not in PATH');
      console.log('Please install Python 3.8+ to use the ML backend');
      process.exit(1);
    });
    return true;
  } catch (error) {
    console.error('❌ Python is not installed or not in PATH');
    console.log('Please install Python 3.8+ to use the ML backend');
    process.exit(1);
  }
}

// Start the Next.js frontend
function startFrontend() {
  console.log('🚀 Starting Next.js frontend...');
  const frontendProcess = spawn('npm', ['run', 'dev', '--', '-p', FRONTEND_PORT], {
    stdio: 'inherit',
    shell: true
  });
  
  frontendProcess.on('error', (err) => {
    console.error('❌ Failed to start frontend:', err);
  });
  
  return frontendProcess;
}

// Start the Python ML backend
function startBackend() {
  console.log('🚀 Starting Python ML backend...');
  
  // Check if run_server.py exists
  const serverScript = path.join(BACKEND_DIR, 'run_server.py');
  if (!fs.existsSync(serverScript)) {
    console.error('❌ Backend server script not found:', serverScript);
    return null;
  }
  
  // Set environment variables for the backend
  const env = { ...process.env, PORT: BACKEND_PORT };
  
  const backendProcess = spawn('python', [serverScript], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    env,
    shell: true
  });
  
  backendProcess.on('error', (err) => {
    console.error('❌ Failed to start backend:', err);
  });
  
  return backendProcess;
}

// Main function
function main() {
  console.log('🔍 Starting Cover Letter Generator...');
  
  // Check if Python is installed
  checkPythonInstalled();
  
  // Start both servers
  const frontend = startFrontend();
  const backend = startBackend();
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    if (frontend) frontend.kill();
    if (backend) backend.kill();
    process.exit(0);
  });
}

// Run the main function
main(); 