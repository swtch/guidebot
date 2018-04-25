module.exports = (client) => {
  const Enmap = require("enmap");


  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  client.log = (type, msg, title) => {
    if (!title) title = "Log";
    console.log(`[${type}] [${title}] ${msg}`);
    if (client.isReady) {client.guilds.find("id","151289667956768768").channels.find("id", "245601189230542848").send(`[${type}][${title}] ${msg}`,{code : "markdown", split : true});}
  };




  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };




  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);


  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);

    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });

  //sbweb function to play file
  client.playSound = async (query, voiceChannelID) => {
    const voiceChannel = client.guilds.find("id","151289667956768768").channels.find("id", voiceChannelID);
    const sound = client.sounds.get(query);
    voiceChannel.join()
      .then(async function(connection) { // Connection is an instance of VoiceConnection
        const dispatcher = connection.playFile(sound.path);
      })
      .catch(async function(error) { client.log("err", error, "SB-API");
      });
  };
  client.playSoundByUserID = async (query, userID) => {
    const voiceChannel = client.theHut.members.find("id",userID).voiceChannel;
    const sound = client.sounds.get(query);
    voiceChannel.join()
      .then(async function(connection) { // Connection is an instance of VoiceConnection
        const dispatcher = connection.playFile(sound.path);
      })
      .catch(async function(error) { client.log("err", error, "SB-API");
      });
  };

  /* PUBG  FUNCTION */
  const Discord = require("discord.js");


  client.rankSign = (nb) => {
    const guild = client.guilds.find("id","151289667956768768");
    if (Math.sign(nb) === -1) { return guild.emojis.find("name", "up") + Math.abs(nb); }
    else { return guild.emojis.find("name", "down") + Math.abs(nb); }
  };

  client.eloSign = (nb) => {
    const guild = client.guilds.find("id","151289667956768768");
    if (Math.sign(nb) === -1) { return guild.emojis.find("name", "down") + Math.abs(nb); }
    else { return guild.emojis.find("name", "up") + Math.abs(nb); }
  };

  client.pubgLivePlayers = new Enmap({name : "pubgLivePlayers", persistent : true});

  client.pubgEmbed = (s, ep) => {
    const guild = client.guilds.find("id","151289667956768768");
    const chan = guild.channels.find("id", "349886150309183488");
    const dm = guild.members.find("id", ep.dID);
    const gameInfo = `Queue: **${s.matchDisplay}**\n`
    + `Region: **${s.regionDisplay}**\n`
    + `Saison: **Early access #${s.season}**\n`
    + `Kills: **${s.kills}**\n`
    + `Assists: **${s.assists}**\n`
    + `Headshot: **${s.headshots}**\n`
    + `Damage dealt: **${s.damage}**\n`
    + `Time survived: **${Math.round(s.timeSurvived / 60)}mn**\n`
    + `Distance: **${Math.round(s.moveDistance) / 1000}km**\n`;
    const ratingCh = `Rank: **#${s.ratingRank}**${client.rankSign(s.ratingRankChange)}\n`
    + `Elo: **${s.rating}**${client.eloSign(s.ratingChange)}\n`
    + `Win Rating: **${s.winRating}**${client.eloSign(s.winRatingChange)}\n`
    + `Win Rank: **#${s.winRank}**${client.rankSign(s.winRatingRankChange)}\n`
    + `Kill Rating: **${s.killRating}**${client.eloSign(s.killRatingChange)}\n`
    + `Kill Rank: **#${s.killRank}**${client.rankSign(s.killRatingRankChange)}`;
    const embed = new Discord.RichEmbed()
      .setAuthor(ep.pubgID, ep.imgURL)
      .setTitle(ep.title)
      .setURL("https://pubgtracker.com/history/pc/" + ep.pubgID)
      .setThumbnail(ep.thumb)
      .setColor(ep.color)
      .setTimestamp(s.updated)
      .setDescription(ep.result)
      .addField(":mega: GAME INFO", gameInfo, true)
      .addField(":medal: RATING CHANGE", ratingCh, true);
    dm.createDM()
      .then(function(channel) {
        channel.send("Voilà Bébé! les stats de ta ou tes dernières games:");
        channel.send({ embed });
      });
  };

  client.pubgLive = async () => {
    const { PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH } = require("pubg-api-redis");
    const api = new PubgAPI({ apikey: client.config.pubgTrackerApi, });
    client.pubgLivePlayers.forEach((p) => {
      const pubgID = p.pubgName;

      api.getProfileByNickname(pubgID)
        .then((profile) => {
          const matchH = profile.getMatchHistory();
          const filteredMatches = matchH.matchHistory.filter((match) => {
            return match.season >= 3;
          });
          const lastMatches = filteredMatches[0];
          if (lastMatches.id === p.lastGameID) { return; }
          else {
            const imgURL = profile.avatar.substring(0, profile.avatar.lastIndexOf(".")) + "_full.jpg";
            p.lastGameID = lastMatches.id;
            client.pubgLivePlayers.set(p.id, p);
            let embedProp = {};

            // TOP 1
            if (lastMatches.rounds === 1 & lastMatches.wins === 1) {
              embedProp = {
                "dID": p.id,
                "pubgID" : pubgID ,
                "imgURL": imgURL,
                "mention": p.discordName,
                "title" : "THE LAST GAME",
                "thumb" : "https://image.noelshack.com/fichiers/2017/39/6/1506796081-1.png",
                "color" : 0xffcc00,
                "result" : "**WINNER WINNER CHICKEN DINNER!** :trophy:"
              };
              return client.pubgEmbed(lastMatches, embedProp);
            }
            // TOP 10
            else if (lastMatches.rounds === 1 & lastMatches.wins === 0 & lastMatches.top10 === 1) {
              embedProp = {
                "dID": p.id,
                "pubgID" : pubgID ,
                "imgURL": imgURL,
                "mention": p.discordName,
                "title" : "THE LAST GAME",
                "thumb" : "https://image.noelshack.com/fichiers/2017/39/6/1506796112-top10.png",
                "color" : 0x0099ff,
                "result" : "**YOU MADE IT TO TOP 10 !**"
              };
              return client.pubgEmbed(lastMatches, embedProp);
            }
            // LOOSE
            else if (lastMatches.rounds === 1 & lastMatches.wins === 0 & lastMatches.top10 === 0) {
              embedProp = {
                "dID": p.id,
                "pubgID" : pubgID ,
                "imgURL": imgURL,
                "mention": p.discordName,
                "title" : "THE LAST GAME",
                "thumb" : "https://image.noelshack.com/fichiers/2017/39/6/1506796105-died.png",
                "color" : 0xff0000,
                "result" : "**DIED! BETTER LUCK NEXT TIME...**"
              };
              return client.pubgEmbed(lastMatches, embedProp);
            }
            // MULTIPLE MATCH
            else if (lastMatches.rounds > 1) {
              const looses = lastMatches.rounds - lastMatches.top10;
              let result = "**LOOSE ! LOOSE EVERYWHERE !**";
              if (lastMatches.wins >= 1 & lastMatches.top10 >= 1) { result = `( Top1: **${lastMatches.wins}** | Top10 : **${lastMatches.top10 - lastMatches.wins}** | Defeats : **${looses}** )`; }
              else if (lastMatches.wins === 0 & lastMatches.top10 >= 1) { result = `( Top10: **${lastMatches.top10}** | Defeats : **${looses}** )`; }
              else if (lastMatches.wins >= 1 & lastMatches.top10 === 0) { result = `Top1: **${lastMatches.wins}** | Defeats : **${looses}** )`; }
              else { result = "**LOOSE ! LOOSE EVERYWHERE !**"; }
              embedProp = {
                "dID": p.id,
                "pubgID" : pubgID ,
                "imgURL": imgURL,
                "mention": p.discordName,
                "title" : "MULTIPLE GAMES",
                "thumb" : "https://pubgdmgstats.com/img/helmet3.png",
                "color" : 0x8c8c8c,
                "result" : `**${lastMatches.rounds} GAMES : **`+result
              };
              return client.pubgEmbed(lastMatches, embedProp);
            }
            // PAS DE MATCH
            else { return; }
          }
        })
        .catch(error => {
          client.log("err", error,"PUBG-Tracker");
          // console.log(error);
        });
    });
    setTimeout(client.pubgLive, 120000);
  };

};
