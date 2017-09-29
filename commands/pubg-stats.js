exports.run = async (client, message, [pubgID, type, serv], level) => {  // eslint-disable-line no-unused-vars
  const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
  const { PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH } = require("pubg-api-redis");
  const Discord = require("discord.js");
  const command = client.commands.get("pubg-stats");
  if (message.channel.id !== "349886150309183488") {
    message.reply(" :no_entry: Non, non, non! Pas ici, là : <#349886150309183488>");
    return;
  }
  if (!pubgID) {
    const tracked = client.pubgLivePlayers.get(message.author.id);
    if (!tracked) return message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
    pubgID = tracked.pubgName;
    type = "squad-fpp";
    serv = "eu";
  }

  const msg = await message.channel.send(`:hourglass: Un instant <@!${message.author.id}>, je récupére tes stats.`);
  const api = new PubgAPI({ apikey: client.config.pubgTrackerApi, });
  api.getProfileByNickname(pubgID)
    .then((profile) => {
      //console.log(profile)
      //const data = profile.content;
      const stats = profile.getStats({
        region: serv.toLowerCase() , // defaults to profile.content.selectedRegion
        season: profile.content.defaultSeason, // defaults to profile.content.defaultSeason
        match: type.toLowerCase() // defaults to SOLO
      });
      var imgURL = stats.avatar.substring(0, stats.avatar.lastIndexOf(".")) + "_full.jpg";
      const embed = new Discord.RichEmbed()
        .setTitle(String(stats.match + " | " + stats.region + " | Saison " + stats.season).toUpperCase())
        .setAuthor(String(pubgID).toUpperCase(), imgURL)
        .setColor(0xff9933)
        .setFooter("© Sw3tch | data:pubgtracker.com", "http://www.pubgtv.fr/wp-content/uploads/2017/08/THEHUT-300x221.png")
        .setThumbnail(imgURL)
        .setTimestamp(stats.lastUpdated)
        .setURL("https://pubgtracker.com/profile/pc/" + pubgID + "?region=" + serv)
        .addField(":beginner: RATING"
          , "Rank #**" + stats.rankData.rating
        + "**\nElo** " + stats.skillRating.rating
        + "\n**Best Rank** #" + stats.skillRating.bestRank
        + "\n**Best Elo** " + stats.skillRating.bestRating
        + "\n**Games **" + stats.performance.roundsPlayed
        + "**", true)
        .addField(":trophy: WINS",
          "Top1 **" + stats.performance.wins
        + "\n**Win Ratio **" + stats.performance.winRatio
        + "%\n**Top10 **" + stats.performance.top10s
        + "\n**Top10 Ratio **" + stats.performance.top10Ratio + "%"
        + "\n**> Top10 **" + (stats.performance.losses - stats.performance.top10s)
        + "**", true)
        .addField(":crossed_swords: KILLS",
          "Kills **" + stats.combat.kills
        + "**\nK/D **" + stats.performance.killDeathRatio
        + "**\nHeadshots  **" + stats.combat.headshotKills
        + "**\nAssists **" + stats.combat.assists
        + "**\nKill/Games **" + stats.perGame.killsPg
        + "**\nKills Record **" + stats.combat.roundMostKills
        + "**\nLongest Kill **" + stats.distance.longestKill
        + "m**", true)
        .addField(":skull:  OTHER",
          "\nDamage Dealt **" + stats.support.damageDealt
        + "**\nHeals **" + stats.support.heals
        + "**\nBoosts **" + stats.support.boosts
        + "**\nSuicides **" + stats.combat.suicides
        + "**\nTeamkills **" + stats.combat.teamKills
        + "**\nRoadkills **" + stats.combat.roadKills
        + "**\nVehicle Destroys **" + stats.combat.vehicleDestroys + "**"
          , true);
      msg.edit({ embed });
      //message.channel.send({ embed });
    })
    .catch(error => {
      msg.edit(`:x: \`${error}\` **${pubgID}** ne semble pas avoir de stats sur les serveurs \`${serv}\` en \`${type}\``);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
      console.error(error);
      client.log("err", error, "PUBG-STATS");
    });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["purank", "pustats", "pubg-rank", "pubg"],
  permLevel: "User"
};

exports.help = {
  name: "pubg-stats",
  category: "PUBG",
  description: "Obtenir le classement d'un joueur ainsi que ses stats PUBG pour la saison actuel, dans le type de game et la region de votre choix",
  usage: "pubg-stats <PseudoPUBG> <solo/duo/squad/solo-fpp/duo-fpp/squad-fpp> <eu/na/as/...>"
};
