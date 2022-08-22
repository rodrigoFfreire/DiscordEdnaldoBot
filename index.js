const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents, Message } = require('discord.js');
const interactionCreate = require('./events/interactionCreate');
const allIntents = new Intents(32767);
dotenv.config();


const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_BANS
	]
});

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const eventFiles = fs
	.readdirSync('./events')
	.filter(file => file.endsWith('.js'));


for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	} else {
		client.on(event.name, (...args) => event.execute(...args, commands));
	}
}


client.login(process.env.TOKEN);
