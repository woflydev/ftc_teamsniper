import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';

// Replace with your bot token and client ID
const TOKEN = 'MTI0MjQ0ODg4MjEyMjg4NzE4OQ.G4FXsy.fE367uLz6ff60x9EikgVhzDINtED9ktIMdHTus';
const CLIENT_ID = '1242448882122887189';

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

// Load the configuration from a file if it exists
try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.delay) {
        delay = config.delay;
    }
    if (config.channelId) {
        channelId = config.channelId;
    }
} catch (error) {
    console.error('No configuration file found or invalid JSON. Using default settings.');
}

let latestTeamNumber = null;

const checkForNewTeam = async () => {
    try {
        const response = await fetch('https://sniperapi.woflydev.com/latest?year=2023');
        const data = await response.json();

        if (data.latestTeamNumber && data.latestTeamNumber !== latestTeamNumber) {
            latestTeamNumber = data.latestTeamNumber;
            if (channelId) {
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    channel.send(`A new team has been made: ${latestTeamNumber}`);
                } else {
                    console.error('Channel not found!');
                }
            } else {
                console.error('Channel ID not set!');
            }
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
                description: 'Number of seconds',
                required: true,
            },
        ],
    },
    {
        name: 'setchannel',
        description: 'Set the channel ID for notifications',
        options: [
            {
                name: 'channelid',
                type: 3, // STRING
                description: 'Channel ID',
                required: true,
            },
        ],
    },
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

    const { commandName, options } = interaction;

    if (commandName === 'setdelay') {
        const newDelay = options.getInteger('seconds');
        if (newDelay > 0) {
            delay = newDelay * 1000;
            clearInterval(checkForNewTeam);
            setInterval(checkForNewTeam, delay);

            // Save the new delay to a configuration file
            fs.writeFileSync('config.json', JSON.stringify({ delay: delay, channelId: channelId }), 'utf8');

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
            fs.writeFileSync('config.json', JSON.stringify({ delay: delay, channelId: channelId }), 'utf8');

            await interaction.reply(`Channel set to ${channel.name}`);
        } else {
            await interaction.reply('Invalid channel ID.');
        }
    }
});

client.login(TOKEN);
