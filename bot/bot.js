import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fetch from 'node-fetch';
import fs from 'fs';
import commands from './cmd/commands.js';
import secrets from './util/parse.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const { TOKEN, CLIENT_ID } = secrets;

let latestTeamNumber = null;
let delay = 300000;
let channelId = null;
let roleId = null;

// load latest config
try {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    if (config.delay) delay = config.delay;
    if (config.channelId) channelId = config.channelId;
    if (config.roleId) roleId = config.roleId;
} catch (error) { console.error('No configuration file found or invalid JSON.'); }

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
                } else console.error('Channel not found!');
            } else console.error('Channel ID not set!');
        } else {
            console.log('\nNo new team found.');
            console.log("Most recent team number: ", latestTeamNumber);
            channel.send("\nNo new teams found.\nMost recent team number: " + latestTeamNumber + "\n");
        }
    } catch (error) {
        console.error('Error fetching latest team:', error);
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setInterval(checkForNewTeam, delay);
});

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

    try {
        if (commandName === 'setdelay') {
            const newDelay = options.getInteger('seconds');
            if (newDelay > 0) {
                delay = newDelay * 1000;
                clearInterval(checkForNewTeam);
                setInterval(checkForNewTeam, delay);

                writeConfig();

                await interaction.reply(`Delay set to ${newDelay} seconds.`);
            } else {
                await interaction.editReply('Please provide a valid number greater than 0.');
            }
        } else if (commandName === 'setchannel') {
            const newChannelId = options.getString('channelid');
            const channel = client.channels.cache.get(newChannelId);
            if (channel) {
                channelId = newChannelId;
                writeConfig();
                await interaction.reply(`Channel set to ${channel.name}`);
            } else {
                await interaction.editReply('Invalid channel ID.');
            }
        } else if (commandName === 'setrole') {
            const newRoleId = options.getString('roleid');
            const role = guild.roles.cache.get(newRoleId);
            if (role) {
                roleId = newRoleId;
                writeConfig();
                await interaction.reply(`Role set to ${role.name}`);
            } else {
                await interaction.editReply('Invalid role ID.');
            }
        } else if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'help') {
            await interaction.reply(
            `This bot sends notifications when a new team is created.\n
            Commands:
            /setdelay [seconds] - Set the delay interval in seconds
            /setchannel [channel ID] - Set the channel ID for notifications
            /setrole [role ID] - Set the role ID for notifications
            /ping - Ping the bot
            /help - This message.

            ========================================

            Current settings:
            Delay: ${delay / 1000} seconds
            Channel ID: ${channelId}
            Role ID: ${roleId}`);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        if (!interaction.replied) {
            await interaction.reply('There was an error while executing this command!', {ephemeral: true});
        } else {
            await interaction.followUp('There was an error while executing this command!');
        }
    }
});


function writeConfig() {
    fs.writeFileSync('config.json', JSON.stringify(
        { 
            delay: delay, 
            channelId: 
            channelId, 
            roleId: roleId 
        }
    ), 'utf8');
}

client.login(TOKEN);