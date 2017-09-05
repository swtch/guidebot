const Command = require("../base/Command.js");

class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: "mylevel",
      description: "Tells you your permission level for the current message location.",
      category: "Miscelaneous",
      usage: "mylevel",
      guildOnly: true
    });
  }

  async run(message, args, level) {
    message.reply(`Your permission level is: ${level}`);
  }
}

module.exports = MyLevel;
