exports.run = async (client, message, [action, user], level) => { // eslint-disable-line no-unused-vars
  
  if (!action) return message.reply("Oui et? `add`, `remove` ou `view` ???  Pour plus d'info: `help sbweb` ");
  if (!["add", "remove", "view"].includes(action)) return message.reply("Action inconnu Miskine, `add`, `remove` ou `view` ???  Pour plus d'info: `help sbweb` " );

  if (action === "view") { const roleMembers  = message.guild.roles.find("name","soundboard").members;
    let output = "= Utilisateurs ayant accés à la sounboard web =\n\nUtilisation:: sbweb <add/remove/view> @user\n\n";
    roleMembers.forEach(e => { output += `   •    ${e.user.username}\n`;
    });
    return message.channel.send(output, {code: "AsciiDoc"});
  }

  if (action && !user) return message.reply("Oui d'accord mais qui? `add/remove @user` !!!  Plus d'info: `help sbweb` ");
  if (!message.mentions.users.first()) return message.channel.send(`T'as pas tout compris, il me faut une mention comme ça : ${message.author} `);

  const memberId = message.mentions.users.first().id;
  const member = message.guild.members.find("id", memberId);

  if (action === "add") {
    member.addRole("364760344629084160");
    return message.channel.send(":ok_hand: " + member + " est maintenant autorisé à utiliser la soundboard!");
  }

  else if (action === "remove") {
    member.removeRole("364760344629084160");
    return message.channel.send(":middle_finger:  " + member + " ne peut plus utiliser la soundboard. CHEH!");
  }

  else { return message.reply("T'as pas tout compris, fait moi plaisir tape `help sbweb`"); }

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
  description: "Permet d'autoriser ou de bloquer un membre d'utiliser la sounboard web. `view' pour consulter la liste des autorisés. ",
  usage: "sbweb <add/remove/view> @user"
};