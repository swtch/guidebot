const command = require(`${process.cwd()}/base/command.js`);

module.exports = class extends command {
  constructor(client) {
    super(client, {
      name: "mylevel",
      description: "Tells you your permission level for the current message location.",
      category: "Miscelaneous",
      usage: "mylevel",
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.reply(`Your permission level is: ${level}`);
  }
};