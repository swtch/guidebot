exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const command = client.commands.get("pubg-link");
  const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
  const pubgID = args[0];
  const  player = client.pubgLivePlayers.get(message.author.id);
  
  if (!pubgID) {
    if (level < client.levelCache[command.conf.permLevel]) return;
    message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
    return;
  }
  if (pubgID === "off") {
    if (!player) {return message.reply(":x: Impossibru, Aucun compte pubg associé.");}
    message.reply(`Tu ne recevras plus les stats de fin de game pour ton compte  **${player.pubgName}**. \`${settings.prefix}${command.help.usage}\` pour le reactivé`);
    client.pubgLivePlayers.delete(message.author.id);
    return;
  }
  if (pubgID === "view") {
    if (!client.pubgLivePlayers) {return message.reply("Aucun compte pubg associé.");}
    let output = "= Liste des comptes PUBG live-tracké =\n";
    client.pubgLivePlayers.forEach(pl => { output += `\n${pl.pubgName} :: id: ${pl.id} lastGameID: ${pl.lastGameID}`;});
    message.channel.send(output,{ code: "asciidoc"});
    return;
  }
  const msg = await message.channel.send(`:hourglass: Un instant <@!${message.author.id}>, je check ton profil PUBG.`);
  const { PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH } = require("pubg-api-redis");
  const api = new PubgAPI({ apikey: client.config.pubgTrackerApi, });
  api.getProfileByNickname(pubgID)
    .then(() => {
      msg.edit(`**Live Tracker activé: \`${pubgID}\` ** :white_check_mark: tu recevras un MP des que nous aurons les stats de ta prochaine game. `);
      client.pubgLivePlayers.set(message.author.id, {"id": message.author.id, "discordName" : `<@!${message.author.id}>` , "pubgName": pubgID, "lastGameID": ""});
    })
    .catch(error => { msg.edit(`:exclamation: Il semble avoir un soucis : \`${error}\`.`); });
};
    
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["link","pulink"],
  permLevel: "User"
};
    
exports.help = {
  name: "pubg-link",
  category: "PUBG",
  description: "Pour recevoir automatiquement un MP avec les stats de ta dernière game. \"pubg-link off\" pour ne plus recevoir les stats. \"pubg-link view\" pour visualiser les comptes live-trackés.",
  usage: "pubg-link <Ton Pseudo PUBG>"
};
     