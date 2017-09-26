const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  message.channel.send(`= INFO =
• Usage Mémoire :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime        :: ${duration}
• Utilisateurs  :: ${client.users.size.toLocaleString()}
• Bot level     :: God Tier
• Serveur       :: ${client.guilds.get("151289667956768768")} le meilleur, TMTC.
• Channels      :: ${client.channels.size.toLocaleString()}
• Sound Box     :: ${client.sounds.size} sons
• Discord.js    :: ${version}
• Node version  :: ${process.version}`, {code: "asciidoc"})
    .catch((error) => {client.log("err", error,"PUBG");});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["stats","uptime"],
  permLevel: "User"
};

exports.help = {
  name: "info",
  category: "Systeme",
  description: "Donne quelques stats interréssantes. Enfin ... interréssantes... tout est relatif.",
  usage: "info"
};
