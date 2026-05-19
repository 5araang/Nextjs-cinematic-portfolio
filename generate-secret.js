const crypto = require('crypto');

/**
 * Generates a secure random 32-character hex string for JWT_SECRET.
 * Run this file using: node generate-secret.js
 */
const secret = crypto.randomBytes(32).toString('hex');

console.log('\n✨ Generated JWT Secret (Copy this to your .env file):');
console.log('-------------------------------------------------------');
console.log(secret);
console.log('-------------------------------------------------------\n');
