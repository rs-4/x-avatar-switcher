import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import config from './config.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CACHE_FILE = path.join(__dirname, config.CACHE_FILE);
const ASSETS_DIR = path.join(__dirname, config.ASSETS_DIR);

// Twitter API client
const client = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_KEY_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

/**
 * Get current theme based on time
 */
function getCurrentTheme() {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour >= config.DAY_START_HOUR && currentHour < config.DAY_END_HOUR) {
    return 'day';
  }
  return 'night';
}

/**
 * Load cache from file
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('⚠️  Warning: Could not load cache file:');
  }
  return { lastAvatar: null, lastUpdated: null };
}

/**
 * Save cache to file
 */
function saveCache(theme) {
  try {
    const cache = {
      lastAvatar: theme,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log('💾 Cache updated successfully');
  } catch (error) {
    console.error('❌ Error saving cache:', error.message);
  }
}

/**
 * Verify Twitter API credentials
 */
function verifyCredentials() {
  const requiredEnvVars = [
    'API_KEY',
    'API_KEY_SECRET',
    'ACCESS_TOKEN',
    'ACCESS_TOKEN_SECRET'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || process.env[envVar].includes('your_')) {
      throw new Error(`${envVar} not configured in .env file`);
    }
  }
}

/**
 * Upload avatar to Twitter
 */
async function uploadAvatar(imagePath, imageName) {
  try {
    verifyCredentials();

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    console.log(`📤 Uploading ${imageName} to Twitter...`);
    
    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`📏 Image size: ${imageBuffer.length} bytes`);
    
    await client.v1.updateAccountProfileImage(imageBuffer);
    console.log(`✅ Avatar changed to ${imageName}`);
    
  } catch (error) {
    console.error('❌ Error uploading avatar:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🚀 Starting Twitter Avatar Switcher...');
  console.log('⏰ Current time:', new Date().toLocaleString());
  
  try {
    // Determine current theme
    const currentTheme = getCurrentTheme();
    console.log(`🎨 Current theme: ${currentTheme === 'day' ? '☀️  Day' : '🌙 Night'}`);
    
    // Load cache
    const cache = loadCache();
    console.log(`📋 Last avatar: ${cache.lastAvatar || 'none'}`);
    
    // Check if we need to switch
    if (cache.lastAvatar === currentTheme) {
      console.log('✨ Avatar is already up to date. No change needed.');
      return;
    }
    
    // Determine which image to use
    const imageName = currentTheme === 'day' ? config.AVATAR_DAY : config.AVATAR_NIGHT;
    const imagePath = path.join(ASSETS_DIR, imageName);
    
    // Upload new avatar
    await uploadAvatar(imagePath, imageName);
    
    // Update cache
    saveCache(currentTheme);
    
    console.log('🎉 Avatar switch completed successfully!\n');
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
