const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Always run the Next.js build process regardless of database connection
try {
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
  
  // Ensure the routes-manifest.json is copied to the expected location
  const nextDir = path.join(process.cwd(), '.next');
  const vercelOutputDir = path.join(process.cwd(), '.vercel', 'output');
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(vercelOutputDir)) {
    fs.mkdirSync(vercelOutputDir, { recursive: true });
  }
  
  // Copy the routes-manifest.json file if it exists
  const routesManifestSource = path.join(nextDir, 'routes-manifest.json');
  const routesManifestDest = path.join(vercelOutputDir, 'routes-manifest.json');
  
  if (fs.existsSync(routesManifestSource)) {
    fs.copyFileSync(routesManifestSource, routesManifestDest);
    console.log('Routes manifest copied successfully!');
  } else {
    console.warn('Warning: routes-manifest.json not found in .next directory');
  }
  
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
// Copy the Next.js build output to the Vercel output directory
const nextOutputDir = path.join(process.cwd(), '.next');
const vercelOutputDir = path.join(process.cwd(), '.vercel', 'output');
const staticDir = path.join(vercelOutputDir, 'static');

// Create the static directory if it doesn't exist
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Copy the Next.js static files to the Vercel output directory
const nextStaticDir = path.join(nextOutputDir, 'static');
if (fs.existsSync(nextStaticDir)) {
  console.log('Copying Next.js static files...');
  // This is a simple implementation - in a real scenario you'd want to use a recursive copy function
  const files = fs.readdirSync(nextStaticDir);
  files.forEach(file => {
    const sourcePath = path.join(nextStaticDir, file);
    const destPath = path.join(staticDir, file);
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

console.log('Vercel build completed successfully!');
