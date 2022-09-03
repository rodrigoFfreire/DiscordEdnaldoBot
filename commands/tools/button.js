const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('Responde com um bot\u00c3o surpresa!'),
	async execute(interaction, client) {
		console.log(`BUTTON UTILIZADO POR ${interaction.user.id}`);
		const button = new ButtonBuilder()
            .setCustomId('pretonazi')
            .setLabel('Surpresa!')
            .setStyle(ButtonStyle.Success);

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)]
        })
	},
};