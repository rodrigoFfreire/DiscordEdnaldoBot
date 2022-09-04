const { ActivityType } = require('discord.js');

module.exports = (client) => {
  client.presencePicker = async () => {
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
    client.user.setPresence({
        activities: [
          {
            name: options[presence].text,
            type: options[presence].type,
          },
        ],
        status: options[presence].status,
      });
  };
};
