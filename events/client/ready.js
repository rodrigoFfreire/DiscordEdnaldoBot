require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ednaldo Bot ${process.env.VERSION} ${client.user.tag} is online!`);
        client.user.setPresence({activities:[{name: `with your moms balls`, type: `PLAYING`}]})
    }
}