require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Player } = require('discord-player');
const { DisTube } = require('distube');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddListWhenCreatingQueue: false,
	emitAddSongWhenCreatingQueue: false
});
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];
client.player = new Player(client, {
	ytdlOptions: {
		quality: 'highestaudio',
		highWaterMark: 1 << 25
	}
})
const functionFolders = fs.readdirSync('./functions');



for (const folder of functionFolders) {
	const functionFiles = fs
		.readdirSync(`./functions/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of functionFiles)
		require(`./functions/${folder}/${file}`)(client);
}

client.eventHandler();
client.commandHandler();
client.componentHandler();
client.login(process.env.TOKEN);