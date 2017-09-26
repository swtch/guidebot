exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const Discord = require("discord.js");
  const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
  if (!args[0]) {     const command = client.commands.get("request");
    if (level < client.levelCache[command.conf.permLevel]) return;
    message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
    return; }
  else {
    const url = args.find(u => {return u.startsWith("http");});
    const embed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Suggestion de commande ou de sons:")
      .setURL(url)
      .setDescription(args.join(" "))
      .setFooter(`${settings.prefix}request <description> <liens vers son> |  ©sw3tch`)
      .setColor(0xff0066);
    message.guild.channels.find("id", "353996227894837248").send({ embed });
    message.reply("C'est noté chef ! Tu peux consulter ta requête ainsi que les autres ici: <#353996227894837248>");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "request",
  category: "General",
  description: "pour faire une suggestion d'amelioration pour le bot, ou pour proposer un nouveau son pour la Sound Box.",
  usage: "request <...description...> <liens vers son(facultatif)>"
};