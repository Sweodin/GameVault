import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory for game images
const gameImagesDir = path.join(__dirname, 'public', 'assets', 'games');

// Create directories if they don't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Check if game images exist, if not create placeholder images
function setupGameImages() {
  // Make sure the directory exists
  ensureDirectoryExists(gameImagesDir);

  // List of game image filenames from mockGames.ts
  const gameImages = [
    'elden-ring.jpg',
    'counter-strike-2.jpg',
    'league-of-legends.jpg',
    'world-of-warcraft.jpg',
    'valorant.jpg',
    'minecraft.jpg',
    'fortnite.jpg',
    'apex-legends.jpg',
    'dota-2.jpg',
    'starfield.jpg'
  ];

  // Check each game image
  gameImages.forEach(imageName => {
    const imagePath = path.join(gameImagesDir, imageName);
    
    // If the image doesn't exist, create a placeholder
    if (!fs.existsSync(imagePath)) {
      console.log(`Game image missing: ${imageName}`);
      console.log(`Please add the image manually to: ${imagePath}`);
      
      // You can uncomment this to create placeholder images automatically
      // createPlaceholderImage(imagePath, imageName);
    } else {
      console.log(`Game image exists: ${imageName}`);
    }
  });

  console.log('\nSetup complete!');
  console.log('If any game images are missing, please add them manually to:');
  console.log(gameImagesDir);
}

// Run the setup
setupGameImages();
