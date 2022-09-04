module.exports = (client) => {
  client.presencePicker = async (options) => {
    const presence = Math.floor(Math.random() * options.length);

    await client.user
      .setPresence({
        activities: [
          {
            name: options[options].text,
            type: options[option].type,
          },
        ],
        status: options[option].status,
      })
      .catch(console.error);
  };
};
