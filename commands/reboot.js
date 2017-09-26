let hasPM2;

try {
  require.resolve("pm2");
  hasPM2 = "PM2 est bien installé et lancé";
} catch (e) {
  hasPM2 = "Un soucis avec PM2, il est introuvable";
}

exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  await message.reply(`le bot redemmarre.... ${hasPM2}`);
  process.exit(1);
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: [],
  permLevel: "papa"
};

exports.help = {
  name: "reboot",
  category: "Systeme",
  description: "Reboot le bot.",
  usage: "reboot"
};
