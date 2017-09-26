exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  message.reply(`Tu es level **${level}** mon gars soit : **${friendly}**`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "mylevel",
  category: "Systeme",
  description: "Vous indique votre niveau de permission [BOT].",
  usage: "mylevel"
};
