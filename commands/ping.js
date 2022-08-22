const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com Pong (Comando de Teste)!'),
	async execute(interaction) {
		return interaction.reply({content:'Pong!', ephemeral: true});
	},
};