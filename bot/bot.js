import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';

// Load the secret.json file to get the bot token and client ID
let secrets;
try {
    secrets = JSON.parse(fs.readFileSync('secret.json', 'utf8'));
} catch (error) {
    console.error('Error reading secret.json:', error);
    process.exit(1);
}

const { TOKEN, CLIENT_ID } = secrets;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Initial delay in milliseconds (5 minutes)
let delay = 300000;
let channelId = null;
let roleId = null;

// Load the configuration from a file if it exists
try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.delay) {
        delay = config.delay;
    }
    if (config.channelId) {
        channelId = config.channelId;
    }
    if (config.roleId) {
        roleId = config.roleId;
    }
} catch (error) {
    console.error('No configuration file found or invalid JSON. Using default settings.');
}

let latestTeamNumber = null;

const checkForNewTeam = async () => {
    try {
        const response = await fetch('https://sniperapi.woflydev.com/api/latest?year=2023');
        const data = await response.json();
        const channel = client.channels.cache.get(channelId);

        if (data.latestTeamNumber && data.latestTeamNumber !== latestTeamNumber) {
            latestTeamNumber = data.latestTeamNumber;
            if (channelId) {
                if (channel) {
                    const roleMention = roleId ? `<@&${roleId}>` : '';
                    channel.send(`${roleMention}\nA new team has been made! ${latestTeamNumber}`);
                } else {
                    console.error('Channel not found!');
                }
            } else {
                console.error('Channel ID not set!');
            }
        } else {
            console.log('\nNo new team found.');
            console.log("Most recent team number: ", latestTeamNumber)
        }
    } catch (error) {
        console.error('Error fetching latest team:', error);
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setInterval(checkForNewTeam, delay);
});

// Register slash commands
const commands = [
    {
        name: 'setdelay',
        description: 'Set the delay interval in seconds',
        options: [
            {
                name: 'seconds',
                type: 4, // INTEGER
                description: 'Number of seconds before the bot checks the SniperAPI again.',
                required: true,
            },
        ],
    },
    {
        name: 'setchannel',
        description: 'Set the channel ID for notifications.',
        options: [
            {
                name: 'channelid',
                type: 3, // STRING
                description: 'Channel ID',
                required: true,
            },
        ],
    },
    {
        name: 'setrole',
        description: 'Set the role ID for notifications.',
        options: [
            {
                name: 'roleid',
                type: 3, // STRING
                description: 'Role ID',
                required: true,
            },
        ],
    },
    {
        name: 'ping',
        description: 'Ping the bot.',
    },
    {
        name: 'help',
        description: 'What is this bot?',
    }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, guild } = interaction;

    if (commandName === 'setdelay') {
        const newDelay = options.getInteger('seconds');
        if (newDelay > 0) {
            delay = newDelay * 1000;
            clearInterval(checkForNewTeam);
            setInterval(checkForNewTeam, delay);

            // Save the new delay to a configuration file
            fs.writeFileSync('config.json', JSON.stringify({ delay: delay, channelId: channelId, roleId: roleId }), 'utf8');

            await interaction.reply(`Delay set to ${newDelay} seconds.`);
        } else {
            await interaction.reply('Please provide a valid number greater than 0.');
        }
    } else if (commandName === 'setchannel') {
        const newChannelId = options.getString('channelid');
        const channel = client.channels.cache.get(newChannelId);
        if (channel) {
            channelId = newChannelId;

            // Save the new channel ID to a configuration file
            fs.writeFileSync('config.json', JSON.stringify({ delay: delay, channelId: channelId, roleId: roleId }), 'utf8');

            await interaction.reply(`Channel set to ${channel.name}`);
        } else {
            await interaction.reply('Invalid channel ID.');
        }
    } else if (commandName === 'setrole') {
        const newRoleId = options.getString('roleid');
        const role = guild.roles.cache.get(newRoleId);
        if (role) {
            roleId = newRoleId;
            fs.writeFileSync('config.json', JSON.stringify({ delay: delay, channelId: channelId, roleId: roleId }), 'utf8');

            await interaction.reply(`Role set to ${role.name}`);
        } else {
            await interaction.reply('Invalid role ID.');
        }
    } else if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'help') {
        await interaction.reply(
        `This bot sends notifications when a new team is created.

        ## Commands:
        /setdelay [seconds] - Set the delay interval in seconds
        /setchannel [channel ID] - Set the channel ID for notifications
        /setrole [role ID] - Set the role ID for notifications
        /ping - Ping the bot
        /help - This message.

        ========================================

        ## Current settings:
        Delay: ${delay / 1000} seconds
        Channel ID: ${channelId}
        Role ID: ${roleId}`);
    }
});

client.login(TOKEN);
