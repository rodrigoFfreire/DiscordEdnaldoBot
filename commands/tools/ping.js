const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Responde com Pong (Comando de Teste)!'),
	async execute(interaction, client) {
		console.log(`PING UTILIZADO POR ${interaction.user.id}`);
		await interaction.reply({content:'Pong!', ephemeral: true});
	},
};