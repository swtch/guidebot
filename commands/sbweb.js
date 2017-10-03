exports.run = async (client, message, [action, ...user], level) => { // eslint-disable-line no-unused-vars
    
  const memberId = message.mentions.users.first().id;
  const member = message.guild.members.find("id", memberId)

  if (!action) return message.reply("Oui et? `add` ou `remove` ???  Pour plus d'info: `help sbweb` ");
  else if (action & !user) return message.reply("Mais qui? `add/remove @user` !!!  Plus d'info: `help sbweb` ");
  else if (action === "add") {
    member.addRole("364760344629084160");
    return message.channel.send(":ok_hand: "+member+" est maintenant autorisé à utiliser la soundboard!");
  }
  else if (action === "remove") {
    member.removeRole("364760344629084160");
    return message.channel.send(":middle_finger:  "+member+" ne peut plus utiliser la soundboard. CHEH!");
  }
  else {return message.reply("T'as pas tout compris, fait moi plaisir tape `help sbweb`")}



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Modo"
};
    
exports.help = {
  name: "sbweb",
  category: "Modération",
  description: "Pour autoriser (add) ou bloquer (remove) un membre d'utliser la soundboard web.(via le role soundboard)",
  usage: "sbweb <add/remove> @user"
};