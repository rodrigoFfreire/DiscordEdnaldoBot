require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.presencePicker, 10000);
    console.log(`Ednaldo Bot ${process.env.VERSION} ${client.user.tag} is online!`);
  },
};
