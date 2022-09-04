module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (e) {
                console.error(e);
                await interaction.reply({
                    content: `Erro ao utilizar o comando!`,
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            if (!button) return new Error('This button was not found!');
            
            if (button.data.name === 'pretonazi') {
                await interaction.message.delete();
            }

            try {
                await button.execute(interaction, client);
            } catch (e) {
                console.error(e);
            }
        }
    }
}