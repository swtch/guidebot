const { inspect } = require("util");

// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
const Command = require("../base/Command.js");

class Set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "View or change settings for your server.",
      category: "System",
      usage: "set <view/get/edit> <key> <value>",
      guildOnly: true,
      aliases: ["setting", "settings", "conf"],
      permLevel: 3
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars
  // Retrieve current guild settings
    const settings = this.client.settings.get(message.guild.id);

    // First, if a user does `-set edit <key> <new value>`, let's change it
    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");

      // `value` being an array, we need to join it first.
      settings[key] = value.join(" ");

      // One the settings is modified, we write it back to the collection
      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} successfully edited to ${value.join(" ")}`);
    } else
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${settings[key]}`);
    } else {
      message.channel.send(inspect(settings), {code: "json"});
    }
  }
}

module.exports = Set;
