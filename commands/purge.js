exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const user = message.mentions.users.first();
  const amount = parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
  if (message.member.id !== "152141690650492928") {return;}

  if (!amount && user) return message.reply("Oui, mais combien de message ???");
  if (!amount && !user) return message.reply("Non, pas comme ça! Je veux un utilisateur et un nombre de messages à effacer, ou juste un nombre.");
  message.channel.fetchMessages({
    limit: amount+1,
  }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  });
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["clear", "clean"],
  permLevel: "Modo"
};
  
exports.help = {
  name: "purge",
  category: "Modération",
  description: "Efface les X derniers messages ou les X derniers messages d'un même utilisateur.",
  usage: "purge <nombre> <@user(facultatif)>"
};