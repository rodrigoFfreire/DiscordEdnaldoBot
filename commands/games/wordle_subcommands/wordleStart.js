const { WORDLEWORDS } = require('../../../constants/wordle/constants.js');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    start: async (interaction) => {
        let sql_command = '';
        let gameId;

        const allowedChannel = 1017443366226645032;
        if (interaction.channel.id != allowedChannel) return await interaction.reply({
            content : 'O comando /wordle start apenas pode ser utilizado em <#1017443366226645032>',
            ephemeral : true
        });

        const interactionAuthor = await interaction.guild.members.fetch(interaction.user.id)
        const secretWord = WORDLEWORDS[Math.floor(Math.random() * 2309)];

        // Create new database
        const db = await open({
            filename : './db/wordle/wordle.db',
            driver : sqlite3.Database
        }).catch((err) => {interaction.reply({content : 'Erro no comando! - open db', ephemeral : true}); return console.error(err)});

        // Insert new row
        sql_command = `INSERT INTO games (player_id, secret_word, attempts_num, win, finished, thread_id, att0, att1, att2, att3, att4, att5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
        await db.run(sql_command, [`${interactionAuthor.id}`,`${secretWord}`,0,0,0,0,'none','none','none','none','none','none'])
            .catch((err) => {interaction.reply({content : 'Erro no comando! - new game', ephemeral : true}); return console.error(err.message)});

        // Get newly created game´s game_id
        sql_command = `SELECT * FROM games ORDER BY game_id DESC LIMIT 1`;
        await db.each(sql_command, (err, row) => {
            if (err) {
                interaction.reply({content : 'Erro no comando! - get game id', ephemeral : true}); 
                return console.error(err.message)
            }
            gameId = row.game_id;
        });

        // Creates new channel where the game will happen
        await interaction.guild.channels.create({
            name: `${interactionAuthor.user.username}-${gameId}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
               {
                 id: interaction.guild.roles.everyone,
                 deny: [PermissionFlagsBits.ViewChannel],
               },
               {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
               }
            ],
          })

        // Changes thread_id to correct value
        const thread = await interaction.guild.channels.cache.find(t => t.name === `${interactionAuthor.user.username.toLowerCase()}-${gameId}`);
        sql_command = `UPDATE games SET thread_id = ? WHERE game_id = ?`
        await db.run(sql_command, [thread.id, gameId])
          .catch((err) => {interaction.reply({content : 'Erro no comando! - change thread_id', ephemeral : true}); return console.error(err.message)})

        // Closes database
        await db.close()
            .catch((err) => {interaction.reply({content : 'Erro no comando! - close db', ephemeral : true}); return console.error(err.message)})

        await interaction.reply({content: 'Novo jogo criado com successo', ephemeral:true});
        return await thread.send(`O teu jogo de Wordle comecou aqui <@${interactionAuthor.id}>`);

    }
}