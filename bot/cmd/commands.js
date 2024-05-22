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

export default commands;