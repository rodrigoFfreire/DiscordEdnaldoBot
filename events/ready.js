const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require('dotenv').config();

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        const clientId = process.env.CLIENT_ID;
	    const guildId = process.env.GUILD_ID;
	    const rest = new REST({
		    version: "9"
	    }).setToken(process.env.TOKEN);

		if (process.env.COMMANDS_STATE === 'DEV') {
			(async () => {
				try {
					console.log('Started refreshing application (/) commands.');
		
					await rest.put(
						Routes.applicationGuildCommands(clientId, guildId),
						{ body: commands },
					);
		
					console.log('Successfully reloaded application (/) commands.');
				} catch (error) {
					console.error(error);
				}
			})();
		}
	    console.log('Ednaldo is Ready!');
	    client.user.setPresence({activities:[{name: `with your moms balls`, type: `PLAYING`}]});
    }
}