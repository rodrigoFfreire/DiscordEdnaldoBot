module.exports = (client) => {
  client.presencePicker = async (options) => {
    const options = [
        {
            type: ActivityType.Playing,
            text: 'with your moms balls',
            status: 'online'
        },
        {
            type: ActivityType.Watching,
            text: 'Better Call Deez Nuts',
            status: 'idle'
        },
        {
            type: ActivityType.Listening,
            text: 'to Coca Cola Light Remix',
            status: 'dnd'
        },
    ];

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
