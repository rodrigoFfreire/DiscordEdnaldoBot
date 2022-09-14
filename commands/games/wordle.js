const { SlashCommandBuilder } = require('discord.js');

const { start } = require('./wordle_subcommands/wordleStart');
const { result } = require('./wordle_subcommands/wordleShare');
const { erase } = require('./wordle_subcommands/wordleDelete');
const { answer } = require('./wordle_subcommands/wordleAnswer');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Joga uma partida de Wordle!')
        .addSubcommand((subcommand) => 
            subcommand
                .setName('start')
                .setDescription('Inicia um novo jogo de Wordle!')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('deletesingle')
                .setDescription('Apaga um único jogo')
                .addIntegerOption((option) =>
                    option
                        .setName('deleteid')
                        .setDescription('Id do jogo pretendido')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('deleteall')
                .setDescription('Apaga todos os jogos!!! ⚠️')
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('deletecustom')
                .setDescription('Insere um comando SQL (Garante que o comando está correto!)')
                .addStringOption((option) =>
                    option
                        .setName('command')
                        .setDescription('Comando SQL')
                        .setRequired(true)
                )
                .addStringOption((option) => 
                    option
                        .setName('values')
                        .setDescription('Valores do comando SQL (separados por virgulas)')
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
                .setName('share')
                .setDescription('Mostra um jogo de Wordle previamente terminado!')
                .addIntegerOption((option) =>
                    option
                        .setName('shareid')
                        .setDescription('Id do jogo pretendido')
                        .setRequired(true)
                )
        ),
	async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'start') {
            await start(interaction);
        } else if (interaction.options.getSubcommand() === 'answer') {
            const word = interaction.options.getString('word');
            await answer(interaction, word);
        } else if (interaction.options.getSubcommand() === 'share') {
            const gameId = interaction.options.getInteger('shareid');
            await result(interaction, gameId);
        } else if (interaction.options.getSubcommand() === 'deletesingle') {
            const gameId = interaction.options.getInteger('deleteid');
            await erase(interaction, 0, gameId);
        } else if (interaction.options.getSubcommand() === 'deleteall') {
            await erase(interaction, 1);
        } else if (interaction.options.getSubcommand() === 'deletecustom') {
            const cmd = interaction.options.getString('command');
            const cmd_values = interaction.options.getString('values');
            await erase(interaction, 2, 0, cmd, cmd_values);
        } else return;
	},
};