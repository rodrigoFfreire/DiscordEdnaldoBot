const { WORDLEWORDS } = require('../../../constants/wordle/constants.js');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    result: async (interaction, gameId) => {
        const requestedId = gameId;
        let gameInfo = [];
        let sql_command;
        let halt = true;

        // Open Database
        const db = await open({
            filename : './db/wordle/wordle.db',
            driver : sqlite3.Database
        }).catch((err) => {interaction.reply({content : 'Erro no comando! - open db', ephemeral : true}); return console.error(err)});

        sql_command = `SELECT * FROM games WHERE finished = ? AND game_id = ?`;
        await db
            .each(sql_command, [1, requestedId], (err, row) => {
                if (err) {
                    console.error(err);
                    interaction.reply({content : 'Erro no comando! - check for opened game', ephemeral : true});
                }
                if (row) {
                    gameInfo = [row.attempts_num, row.att0, row.att1, row.att2, row.att3, row.att4, row.att5];
                    gameInfo.splice(-1, 6 - row.attempts_num);
                    gameInfo.splice(0, 1);
                    halt = false;
                }
            });
        await db.close().catch(err => console.error(err));

        // Prevents Bot Shutting Down
        if (halt === true) return;

        // Organize and send data
        let data = ``;
        gameInfo.forEach(att => {
            const seperateString = att.split(';');
            data = data + `${seperateString[1]} - ${seperateString[0]}\n`;
        });
        data = data + `\n**ID: ${requestedId}**`
        await interaction.reply({ content: data });

    }
}