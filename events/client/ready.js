require('dotenv').config();
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const options = [
            {
                type: ActivityType.Playing,
                text: 'with your moms balls',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                text: 'Better Call Deez Nuts',
                status: 'idle'
            },
            {
                type: ActivityType.Listening,
                text: 'to Coca Cola Light Remix',
                status: 'dnd'
            },
        ];
        
        setInterval(client.presencePicker, 10 * 1000);
        console.log(`Ednaldo Bot ${process.env.VERSION} ${client.user.tag} is online!`);
    }
}