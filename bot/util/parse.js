import fs from 'fs';

let secrets;
try {
    secrets = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
} catch (error) {
    console.error('Error reading secret.json:', error);
    process.exit(1);
}

export default secrets;