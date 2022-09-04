require('dotenv').config();
const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(client.presencePicker, 10 * 1000);
        console.log(`Ednaldo Bot ${process.env.VERSION} ${client.user.tag} is online!`);
    }
}