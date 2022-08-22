module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

	    const command = interaction.client.commands.get(interaction.commandName);
	    const command_name = interaction.commandName;

	    if (!command) return;

	    try {	
		    await command.execute(interaction);
	    } catch (error) {
		    console.error(error);
            await interaction.reply({ content: 'Houve um erro a executar este comando!', ephemeral: true });
	    }
    }
}														