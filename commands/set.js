const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars


  const settings = client.settings.get(message.guild.id);
  

  if (action === "add") {
    if (!key) return message.reply("Merci de préciser la \"key\" à ajouter");
    if (settings[key]) return message.reply("Cette \"key\" existe déja");
    if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.reply(`${key} à até ajouté avec comme valeur: ${value.join(" ")}`);
  } else
  if (action === "edit") {
    if (!key) return message.reply("Merci de préciser la \"key\" à editer");
    if (key === "game" & value.length >= 1) {
      client.user.setPresence({ status: "online", game: { name: value.join(" "), type: 0 } }).catch(console.error);
      return message.reply(`"Playing Game" à até modifié avec comme valeur: \`${value.join(" ")}\``);}
    if (key === "avatar" & value.length >= 1) { client.user.setAvatar(value.toString())
      .then(message.channel.send("Avatar mis à jour avec grand succés"))
      .catch(error => {client.log("err", error, "CMD" ); message.reply("C'est bien un liens vers une image?");});
    return; }
    if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
    if (!settings[key]) return message.reply("Cette \"key\" n'existe pas");
    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.reply(`${key} à até modifié avec comme valeur: ${value.join(" ")}`);
  } else
  

  if (action === "del") {
    if (!key) return message.reply("Merci de préciser la \"key\" à supprimer");
    if (!settings[key]) return message.reply("Cette \"key\" n'existe pas");
    const response = await client.awaitReply(message, `Etes vous sur de vouloir supprimer ${key}?`);
    if (["o", "oui", "ouais"].includes(response)) {
      delete settings[key];
      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} à bien été supprimer.`);
    } else
    if (["n","no","non"].includes(response)) {
      message.reply("Action annulé.");
    }
  } else
  

  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Papa"
};

exports.help = {
  name: "set",
  category: "Systeme",
  description: "Voir/editer la conf du bot",
  usage: "set <view/get/edit> <paramétre> <valeur>"
};