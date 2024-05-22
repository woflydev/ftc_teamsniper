import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fs from 'fs';
import commands from './cmd/commands.js';
import { secrets, writeConfig } from './util/filehandler.js';
import { checkForNewTeam } from './util/operation.js';

const { TOKEN, CLIENT_ID } = secrets;
const rest = new REST({ version: '10' }).setToken(TOKEN);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

let delay = 300000; // 5 min
let channelId = null;
let roleId = null;
let intervalId = 0;

try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.delay) delay = config.delay;
    if (config.channelId) channelId = config.channelId;
    if (config.roleId) roleId = config.roleId;
} catch (error) { console.error('No configuration file found or invalid JSON. Using default settings.'); }

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    intervalId = setInterval(() => checkForNewTeam(client, channelId, roleId), delay);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, guild } = interaction;

    if (commandName === 'setdelay') {
        const newDelay = options.getInteger('seconds');
        if (newDelay > 0) {
            delay = newDelay * 1000;
            clearInterval(intervalId);
            intervalId = setInterval(() => checkForNewTeam(client, channelId, roleId), delay);
            console.log(`DEBUG: New delay set is ${delay/1000}`);
            writeConfig();
            await interaction.reply(`# Delay set!\nThe bot will now check the API every ${newDelay} seconds.`);
        } else {
            await interaction.reply(`# Error!\nMust be valid number greater than 0.`)
        }
    } else if (commandName === 'setchannel') {
        const newChannelId = options.getString('channelid');
        const channel = client.channels.cache.get(newChannelId);
        if (channel) {
            channelId = newChannelId;
            writeConfig();

            await interaction.reply(`Channel set to ${channel.name}`);
        } else {
            await interaction.reply('Invalid channel ID.');
        }
    } else if (commandName === 'setrole') {
        const newRoleId = options.getString('roleid');
        const role = guild.roles.cache.get(newRoleId);
        if (role) {
            roleId = newRoleId;
            writeConfig();
            await interaction.reply(`Role set to ${role.name}`);
        } else {
            await interaction.reply('Invalid role ID.');
        }
    } else if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'help') {
        await interaction.reply(
            "# Help!!\n" +
            "## What this do?\n" +
            "This bot pings a specified role when a new FTC team is created.\n" +
            "It uses a custom backend API server at [SniperAPI](https://sniperapi.woflydev.com/hello).\n" +
            "## Current Settings\n" +
            "Delay: `" + delay / 1000 + " seconds`\n" +
            "Notification Channel ID: `" + channelId + "`\n" +
            "Notification Role ID: `" + roleId + "`\n" +
            "## Available Bot Commands\n" +
            "Set the **delay interval** in seconds. ```/setdelay [seconds]```\n" +
            "Set the **Channel ID** used for notifications. ```/setchannel [channel ID]```\n" +
            "Set the **Role ID** used for notifications. ```/setrole [role ID]```\n" +
            "**Ping** the bot. ```/ping```\n" +
            "**Display** this message. ```/help```\n" +
            "## How do I Configure Roles?\n" +
            "1. Create a new role in your server for bot spam.\n" +
            "2. Right-click the role and select `Copy Role ID`.\n" +
            "3. Paste the ID into the `roleid` field in the `/setrole` command.\n"
        )
    }
});

// login
client.login(TOKEN);

// register cmd
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