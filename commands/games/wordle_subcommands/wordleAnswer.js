const sqlite3 = require("sqlite3").verbose();
const { MessageActivityType } = require("discord.js");
const { open } = require("sqlite");
const { WORDLEWORDS,SQUARES } = require("../../../constants/wordle/constants.js");
const Wordle = require("../wordle_subcommands/helper_functions/wordleClass.js");

module.exports = {
    answer: async (interaction, word) => {
        let sql_command;
        const word_size = 5;
        const threadId = interaction.channel.id;
        const interactionAuthor = await interaction.guild.members.fetch(
            interaction.user.id
        );
        const answerWord = word.toUpperCase();
        let halt = false;
        let gameInfo = [];

        // Open database
        const db = await open({
            filename: "./db/wordle/wordle.db",
            driver: sqlite3.Database,
        }).catch((err) => {
            return interaction.reply({content: "Erro no comando! - open db",ephemeral: true,});
        });

        // Check if word is valid
        checkWord = (answerWord) => {
            return WORDLEWORDS.find((word) => word.toUpperCase() == answerWord)
                ? true
                : false;
        };
        if (answerWord.length !== word_size || !checkWord(answerWord)) {
            await db.close().catch((err) => console.error(err));
            return await interaction.reply({content: "Essa palavra n\u00e3o \u00e9 v\u00e1lida",ephemeral: true,});
        }

        // Find correct game and get data
        sql_command = `SELECT * FROM games WHERE finished = ? AND thread_id = ? AND player_id = ?`;
        await db.each(
            sql_command,
            [0, `${threadId}`, `${interactionAuthor.id}`],
            (err, row) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({
                        content: "Erro no comando! - find game",
                        ephemeral: true,
                    });
                }
                if (row) {
                    gameInfo = [
                        row.game_id,
                        row.secret_word,
                        row.attempts_num,
                        row.thread_id,
                        row.attempts,
                        row.message_id,
                    ];
                    halt = false;
                }
            }
        );

        // Avoids Bot shutting down
        if (halt === true) {
            await db.close().catch((err) => console.error(err));
            return interaction.reply({
                content: "N\u00e3o podes utilizar este comando aqui!",
                ephemeral: true,
            });
        }

        // Evaluate answer
        const thread = await interaction.guild.channels.cache.find(t => t.id == gameInfo[3]);
        const attempt = new Wordle(answerWord, gameInfo[1], word_size);
        attempt.logic();

        const result = [];
        attempt.colors.forEach((index) => {
            result.push(SQUARES[index]);
        });
        const answerSquares = result.join("");

        // First Attempt
        let resultMsg;
        if (gameInfo[2] === 0) {
            await interaction.reply({ content: "*Ednaldo is thinking...*" });

            await thread.send(`${answerSquares} - ${answerWord}`);
            await thread.messages
                .fetch({ limit: 1 })
                .then(m => {
                    resultMsg = m.first();
                })
                .catch((err) => console.error(err.message));

            sql_command = `UPDATE games SET message_id = ?, attempts_num = ?, attempts = ? WHERE game_id = ?`;
            await db
                .run(sql_command, [`${resultMsg.id}`, gameInfo[2] + 1, `${answerWord};${answerSquares}`, gameInfo[0]])
                .catch((err) => console.error(err));
 
            await interaction.deleteReply();
            // Attempts 2-5
        } else if (gameInfo[2] > 0 && gameInfo[2] < 6) {
            await interaction.reply({ content: "*Ednaldo is thinking...*" });
            await thread.messages
                .fetch(`${gameInfo[5]}`)
                .then((m) => {
                    resultMsg = m;
                })
                .catch(err => console.error(err.message));
            const resultMsg_oldContent = resultMsg.content;
            await resultMsg.edit(`${resultMsg_oldContent}\n${answerSquares} - ${answerWord}`);


            sql_command = `UPDATE games SET message_id = ?, attempts_num = ?, attempts = ? WHERE game_id = ?`;
            await db
                .run(sql_command, [`${resultMsg.id}`, gameInfo[2] + 1, `${gameInfo[4]}` + `\n${answerWord};${answerSquares}`, gameInfo[0]])
                .catch((err) => console.error(err));

            await interaction.deleteReply();
        }

        //Check Win or finished
        if (answerWord === gameInfo[1]) {
            sql_command = `UPDATE games SET win = ?, finished = ? WHERE game_id = ?`
            await db
                .run(sql_command, [1, 1, gameInfo[0]])
                .catch((err) => console.error(err));
            await db
                .close()
                .catch((err) => console.error(err));
            return await thread.send(`\n\n🥳Parab\u00e9ns, ganhaste este Wordle em ${gameInfo[2] + 1}/6 tentativas!🥳\nUtiliza /wordle share ${gameInfo[0]} para partilhares o teu jogo com outras pessoas!`);
        } else {
            if (gameInfo[2] + 1 === 6) {
                sql_command = `UPDATE games SET win = ?, finished = ? WHERE game_id = ?`
            await db
                .run(sql_command, [1, 1, gameInfo[0]])
                .catch((err) => console.error(err));
            await db
                .close()
                .catch((err) => console.error(err));
            return await thread.send(`\n\n😢Perdeste este jogo de Wordle!😢 A palavra correta era ${gameInfo[1]}\nUtiliza /wordle share ${gameInfo[0]} para partilhares o teu jogo com outras pessoas!`)
            }
        }
    },
};
