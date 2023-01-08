const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    result: async (interaction, gameId) => {
        console.log(`WORDLE SHARE UTILIZADO POR ${interaction.user.id}`);
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
            .each(sql_command, ['1', `${requestedId}`], (err, row) => {
                if (err) {
                    console.error(err);
                    interaction.reply({content : 'Erro no comando! - check for opened game', ephemeral : true});
                }
                if (row) {
                    gameInfo = [row.attempts, row.secret_word, row.player_id];
                    halt = false;
                }
            });
        await db.close().catch(err => console.error(err));

        // Prevents Bot Shutting Down
        if (halt === true) return;

        // Organize and send attempt graph
        let data = '';
        let raw = gameInfo[0].split('\n');
        raw.forEach(att => {
            let subArray = att.split(';');
            data = data + `${subArray[1]} - ${subArray[0]}\n`;
        });
        data = data + `\n**ID: ${requestedId}\t\tPalavra: ${gameInfo[1]}\t\tJogador: <@${gameInfo[2]}>**`
        return await interaction.reply({ content: data });

    }
}