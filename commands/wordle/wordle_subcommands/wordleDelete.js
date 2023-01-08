const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    erase: async (interaction, mode = 0, id = 0, customCmd = '', customCmd_values = '') => {
        const member_role_check = interaction.guild.members.cache.get(interaction.user.id);
        if (!member_role_check.roles.cache.has('816657464032100393')) return await interaction.reply({content: 'N\u00e3o tens permiss\u00e3o para usar este comando!', ephemeral: true});

        console.log(`WORDLE DELETE UTILIZADO POR ${interaction.user.id}`);
        let sql_command;

        // Open database
        const db = await open({
            filename : './db/wordle/wordle.db',
            driver : sqlite3.Database
        }).catch((err) => {interaction.reply({content : 'Erro no comando! - open db', ephemeral : true}); return console.error(err)});

        // Choose correct mode of operation
        if (mode !== 2) {
            if (mode === 0) {
                let thread;
                // Delete channel
                sql_command = `SELECT * FROM games WHERE game_id = ?`;
                await db
                    .each(sql_command, [id], (err, row) => {
                        if (err) console.error(err);
                        if (row) {
                            await (async function() {
                                thread = await interaction.guild.channel.cache.find(t => t.id === row.thread_id)
                                await thread.delete();
                            })();
                        }
                    });

                sql_command = `DELETE FROM games WHERE game_id = ?`;

            }
            else {
                sql_command = `DELETE FROM games`;
                const wordleCategory = await interaction.guild.channels.fetch('1019351329551954041');
                console.log(wordleCategory);
                wordleCategory.children.forEach(channel => {
                    channel.delete();
                });
            }

            // Delete db entry
            await db
                .run(sql_command, [id])
                .catch((err) => {console.error(err.message); return interaction.reply({content : 'Erro no comando!', ephemeral : true});});
            
        } else {
            sql_command = customCmd;
            const customCmd_values_ = customCmd_values.replace(/\s+/g, '').split(',');
            console.log('HERE\n', customCmd + '\n', customCmd_values + '\n', customCmd_values_);
            await db
                .run(sql_command, [...customCmd_values_])
                .catch((err) => {console.error(err.message); return interaction.reply({content : 'Erro no comando!', ephemeral : true});});
        }

        // Close Database and .reply()
        await db
            .close()
            .catch((err) => {interaction.reply({content : 'Erro no comando!', ephemeral : true})});

        return await interaction.reply({content : '/wordle delete executado com sucesso!'});
    }

}