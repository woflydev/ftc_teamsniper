import fetch from 'node-fetch';

let hasFetchedOnce = false;
let latestTeamNumber = null;

const checkForNewTeam = async (client, channelId, roleId) => {
    try {
        const response = await fetch('https://sniperapi.woflydev.com/api/latest?year=2023');
        const data = await response.json();
        const channel = client.channels.cache.get(channelId);

        if (data.latestTeamNumber && data.latestTeamNumber !== latestTeamNumber) {
            latestTeamNumber = data.latestTeamNumber;
            hasFetchedOnce = true;
            if (channelId) {
                if (channel) {
                    const roleMention = roleId ? `<@&${roleId}>` : '';
                    channel.send(`${roleMention}\n## New team detected!\nLatest team: **${latestTeamNumber}**.`);
                } else {
                    console.error('Channel not found!');
                }
            } else {
                console.error('Channel ID not set!');
                channel.send("Channel ID not set!");
            }
        } else {
            console.log('\nNo new team found.');
            console.log("Most recent team number: ", latestTeamNumber);
            if (hasFetchedOnce) {
                channel.send("No new team found.\nMost recent team number: **" + latestTeamNumber + "**\n");
            }
        }
    } catch (error) {
        console.error('Error fetching latest team:', error);
    }
};

export { checkForNewTeam };
