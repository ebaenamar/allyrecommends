const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we have a database connection
const hasDatabase = !!process.env.POSTGRES_URL;

console.log(`Building with database connection: ${hasDatabase ? 'YES' : 'NO'}`);

// If we have a database connection, run the normal build process
if (hasDatabase) {
  try {
    console.log('Running database migrations...');
    execSync('npx tsx lib/db/migrate', { stdio: 'inherit' });
    console.log('Running Next.js build...');
    execSync('next build', { stdio: 'inherit' });
    console.log('Build completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// If we don't have a database connection, create a static landing page
console.log('No database connection found. Creating static landing page...');

// Ensure the .vercel/output directory exists
const outputDir = path.join(process.cwd(), '.vercel', 'output');
const staticDir = path.join(outputDir, 'static');
const configPath = path.join(outputDir, 'config.json');

// Create directories if they don't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Create a simple index.html file
const indexPath = path.join(staticDir, 'index.html');
fs.writeFileSync(
  indexPath,
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllyRecommends - Your Dietary Ally</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(to bottom, #f0fdf4, #ffffff);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .container {
      max-width: 800px;
      padding: 2rem;
    }
    h1 {
      color: #22c55e;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #4b5563;
      font-size: 1.25rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .logo {
      width: 200px;
      height: 200px;
      margin-bottom: 2rem;
    }
    .score {
      background-color: #22c55e;
      color: white;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto 2rem;
    }
    .badge {
      display: inline-block;
      background-color: #f0fdf4;
      color: #22c55e;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 500;
      margin-bottom: 1.5rem;
      border: 1px solid #22c55e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Eat Better. Feel Better. Live Better.</div>
    <h1>AllyRecommends</h1>
    <p>Your Personal Dietary Ally for Healthier Choices</p>
    <div class="score">85</div>
    <p>We're currently updating our health score system to help you make even better food choices. Check back soon!</p>
  </div>
</body>
</html>
`
);

// Create a config.json file
fs.writeFileSync(
  configPath,
  JSON.stringify({
    version: 3,
    routes: [
      {
        src: '/(.*)',
        dest: '/index.html'
      }
    ]
  })
);

console.log('Static build completed successfully!');
