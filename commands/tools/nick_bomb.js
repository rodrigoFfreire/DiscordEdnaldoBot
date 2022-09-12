const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick_bomb')
        .setDescription('Muda o Nickname de todos os utilizadores do servidor excepto o Server Owner')
        .addStringOption((option) =>
            option
                .setName('nick')
                .setDescription('Novo Nickname')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const member_role_check = interaction.guild.members.cache.get(interaction.user.id);
        if (!member_role_check.roles.cache.has('816657464032100393')) return interaction.reply({content: 'N\u00e3o tens permiss\u00e3o para usar este comando!', ephemeral: true});
        const newnick = interaction.options.getString('nick');
        if (newnick.length > 32) return interaction.reply({ content : `O limite máximo de caracteres são 32! (${newnick.length})`});
        try {
            interaction.guild.members.fetch()
                .then(members => {
                    members.forEach(member => {
                            if (member.user.id === '286998797249282050') return;
                            if (member.user.id === '488298163980075010') return;
                        try {
                            member.setNickname(newnick);
                        } catch {
                            console.log('Algo de errado nao esta certo :/');
                        } 
                    })
                })
        } catch (error) {
            console.error(error);
        }
        interaction.reply({content:`Nicknames de toda a gente est\u00e3o a ser alterados para \"${newnick}\"`, ephemeral: true});
        console.log(`NICK_BOMB UTILIZADO POR ${interaction.user.id}`);
    },

};