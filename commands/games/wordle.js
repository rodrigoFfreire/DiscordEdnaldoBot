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
                .setName('share')
                .setDescription('Mostra um jogo de Wordle previamente terminado!')
                .addIntegerOption((option) =>
                    option
                        .setName('gameid')
                        .setDescription('Id do jogo pretendido')
                        .setRequired(true)
                )
        ),
	async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'start') {
            await start(interaction);
        } else if (interaction.options.getSubcommand() === 'delete') {
            await erase(interaction);
        } else if (interaction.options.getSubcommand() === 'answer') {
            const word = interaction.options.getString('word');
            await answer(interaction, word);
        } else if (interaction.options.getSubcommand() === 'share') {
            const gameId = interaction.options.getInteger('gameid');
            await result(interaction, gameId);
        }
	},
};