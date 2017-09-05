class Command {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "General",
    usage = "No usage provided.",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = 0
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;
