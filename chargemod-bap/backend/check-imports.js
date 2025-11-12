import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function checkFile(filePath) {
  const fullPath = resolve(__dirname, filePath);
  if (existsSync(fullPath)) {
    console.log(`✅ ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${filePath} - MISSING`);
    return false;
  }
}

console.log('🔍 Checking required files...\n');

const filesToCheck = [
  'src/server.js',
  'src/routes/stations.js',
  'src/routes/bookings.js',
  'src/routes/beckn.js',
  'src/controllers/stations.js',
  'src/controllers/bookings.js',
  'src/models/Station.js',
  'src/models/Booking.js',
  'src/scripts/seedStations.js',
  '.env'
];

let allExist = true;

filesToCheck.forEach(file => {
  if (!checkFile(file)) {
    allExist = false;
  }
});

console.log('\n📋 Summary:');
if (allExist) {
  console.log('🎉 All files are present! You can run: npm run dev');
} else {
  console.log('⚠️ Some files are missing. Please create them first.');
}