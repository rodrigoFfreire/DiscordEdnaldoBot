const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Joga uma partida de Wordle!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('help')
                .setDescription('Info acerca de todos os subcomandos associados a /wordle')
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('start')
                .setDescription('Inicia um novo jogo de Wordle!')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('delete')
                .setDescription('Apaga um jogo de Wordle ativo!')
                .addIntegerOption((option) =>
                    option
                        .setName('gameid')
                        .setDescription('Id do jogo pretendido')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('answer')
                .setDescription('Resposta ao jogo')
                .addStringOption((option) =>
                    option
                        .setName('word')
                        .setDescription('Palavra de resposta')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('result')
                .setDescription('Mostra um jogo de Wordle previamente terminado!')
                .addIntegerOption((option) =>
                    option
                        .setName('resultid')
                        .setDescription('Id do jogo pretendido')
                        .setRequired(true)
                )
        ),
	async execute(interaction, client) {
        const allowedChannel = 1017443366226645032;
        if (interaction.channel.id === allowedChannel) return await interaction.reply({
            content : 'O comando /wordle apenas pode ser utilizado em <#1017443366226645032>',
            ephemeral : true
        });
        const interactionAuthor = await interaction.guild.members.fetch(interaction.user.id)
        console.log(interactionAuthor.user.username);
        return await interaction.reply({
            content : 'nigga',
            ephemeral : true
        });

	},
};