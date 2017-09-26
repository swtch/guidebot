exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const Discord = require("discord.js");
  message.channel.createInvite()
    .then(invite => {
      const embed = new Discord.RichEmbed()
        .setTitle("Invitation Discord The Hut:")
        .setDescription("```" + invite.url + "```")
        .setAuthor(client.user.username, client.user.avatarURL)
        .setURL(invite.url)
        .setThumbnail("http://www.pubgtv.fr/wp-content/uploads/2017/08/THEHUT-300x221.png")
        .setColor(0x00cc66);
      message.channel.send({ embed });
    }).catch(console.error);
};
    
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};
    
exports.help = {
  name: "invite",
  category: "General",
  description: "Vous fournit une invitation pour le Discord The Hut",
  usage: "invite"
};
