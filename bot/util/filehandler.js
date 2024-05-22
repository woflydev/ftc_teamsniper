import fs from 'fs';

let secrets;
try {
    secrets = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
} catch (error) {
    console.error('Error reading secret.json:', error);
    process.exit(1);
}

function writeConfig() {
    fs.writeFileSync('config.json', JSON.stringify(
        { 
            delay: delay, 
            channelId: channelId, 
            roleId: roleId 
        }
    ), 'utf8');
}

export default {secrets, writeConfig};

