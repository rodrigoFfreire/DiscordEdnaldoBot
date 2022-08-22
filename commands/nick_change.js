const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nick_change')
		.setDescription('Muda o nickname de qualquer utilizador')
        .addStringOption((option) => 
            option
                .setName('nick')
                .setDescription('Novo Nickname')
                .setRequired(true)
        )
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription('Utilizador')
                .setRequired(true)
        ),
	async execute(interaction) {
        const member_role_check = interaction.guild.members.cache.get(interaction.user.id);
        if (!member_role_check.roles.cache.has('816657464032100393')) return interaction.reply({content: 'N\u00e3o tens permiss\u00e3o para usar este comando!', ephemeral: true}); 
        
        const target_member = interaction.guild.members.cache.get(interaction.options.getUser('target').id);
        const newnick = interaction.options.getString('nick');

        if (interaction.options.getUser('target').id === '286998797249282050') return interaction.reply({
            content: `N\u00e3o \u00e9 poss\u00edvel mudar o Nickname do Server Owner ${target_member}`,
            ephemeral : "true",
        });

        if (interaction.options.getUser('target').id === '488298163980075010') return interaction.reply({
            content: `N\u00e3o \u00e9 poss\u00edvel mudar o Nickname do Server Owner ${target_member}`,
            ephemeral : "true",
        });

        target_member.setNickname(newnick);
        interaction.reply({
            content: `Nickname de ${target_member} alterado para \"${newnick}\" com sucesso!`,
            ephemeral : "true",
        });
        console.log(`NICK_CHANGE UTILIZADO POR ${interaction.user.id}`);   
        
        
    },
};