const { SlashCommandBuilder } = require('discord.js');

const { start } = require('./wordle_subcommands/wordleStart.js');
const { result } = require('./wordle_subcommands/wordleResult');
const { help } = require('./wordle_subcommands/wordleHelp');
const { erase } = require('./wordle_subcommands/wordleDelete');
const { answer } = require('./wordle_subcommands/wordleAnswer');

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
        if (interaction.options.getSubcommand() === 'help') {
            help(interaction);
        } else if (interaction.options.getSubcommand() === 'start') {
            await start(interaction);
        } else if (interaction.options.getSubcommand() === 'delete') {
            erase(interaction);
        } else if (interaction.options.getSubcommand() === 'answer') {
            answer(interaction);
        } else if (interaction.options.getSubcommand() === 'result') {
            result(interaction);
        }
	},
};