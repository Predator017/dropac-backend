const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const jwtLogger = require('./logger/jwtLogger');

// Resolve .env path
const envPath = path.join(__dirname, '../../.env');
console.log(envPath);
dotenv.config({ path: envPath });

const generateSecret = () => crypto.randomBytes(64).toString('hex');

const updateJWTSecrets = () => {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = envContent.split('\n');

  const newAccess = generateSecret();
  const newRefresh = generateSecret();

  let jwtSecretPreviousSet = false;
  let jwtRefreshSecretPreviousSet = false;
  let jwtSecretCurrentSet = false;
  let jwtRefreshSecretCurrentSet = false;

  const updatedEnv = env.map(line => {
    if (line.startsWith('JWT_SECRET_PREVIOUS=')) {
      jwtSecretPreviousSet = true;
      return `JWT_SECRET_PREVIOUS=${process.env.JWT_SECRET_CURRENT || ''}`;
    }
    if (line.startsWith('JWT_REFRESH_SECRET_PREVIOUS=')) {
      jwtRefreshSecretPreviousSet = true;
      return `JWT_REFRESH_SECRET_PREVIOUS=${process.env.JWT_REFRESH_SECRET_CURRENT || ''}`;
    }
    if (line.startsWith('JWT_SECRET_CURRENT=')) {
      jwtSecretCurrentSet = true;
      return `JWT_SECRET_CURRENT=${newAccess}`;
    }
    if (line.startsWith('JWT_REFRESH_SECRET_CURRENT=')) {
      jwtRefreshSecretCurrentSet = true;
      return `JWT_REFRESH_SECRET_CURRENT=${newRefresh}`;
    }
    return line;
  });

  // Add missing ones if they were not found above
  if (!jwtSecretPreviousSet) {
    updatedEnv.push(`JWT_SECRET_PREVIOUS=${process.env.JWT_SECRET_CURRENT || ''}`);
    jwtLogger.info('Added missing JWT_SECRET_PREVIOUS');
  }
  if (!jwtRefreshSecretPreviousSet) {
    updatedEnv.push(`JWT_REFRESH_SECRET_PREVIOUS=${process.env.JWT_REFRESH_SECRET_CURRENT || ''}`);
    jwtLogger.info('Added missing JWT_REFRESH_SECRET_PREVIOUS');
  }
  if (!jwtSecretCurrentSet) {
    updatedEnv.push(`JWT_SECRET_CURRENT=${newAccess}`);
    jwtLogger.info('Added missing JWT_SECRET_CURRENT');
  }
  if (!jwtRefreshSecretCurrentSet) {
    updatedEnv.push(`JWT_REFRESH_SECRET_CURRENT=${newRefresh}`);
    jwtLogger.info('Added missing JWT_REFRESH_SECRET_CURRENT');
  }

  // Write updated .env
  fs.writeFileSync(envPath, updatedEnv.join('\n'), 'utf8');
  jwtLogger.info('✅ JWT secrets updated successfully.');
};

updateJWTSecrets();
