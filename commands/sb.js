exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const query = args[0].toLowerCase();
  const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;

  if (!query || query < 1 ) {
    const command = client.commands.get("sb");
    if (level < client.levelCache[command.conf.permLevel]) return;
    message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
    return;
  }

  if (!message.member.voiceChannel) { return message.channel.send("T'es bien gentil mon petit poulet, mais pour ça il faudrait que tu te connectes à un channel vocal...");}

  if (query==="list") {
    const longest = client.sounds.keyArray().reduce((long, str) => Math.max(long, str.length), 0); 
    let reply = `= Liste des Sons =\n\n[  ${settings.prefix}sb <Nom du son>  ]\n\n`;
    client.sounds.forEach(s =>{
      reply += `\n ${s.name}${" ".repeat(longest - s.name.length)}  ::  ${s.description}`; 
    });
    message.reply("Go en MP poulet.");
    message.author.createDM()
      .then(function(channel) { channel.send(reply, { code: "asciidoc", split : true }); });
    return;
  }

  if (query !=="list" ) {
  
    const sound = client.sounds.get(query);
    message.member.voiceChannel.join()
      .then(async function(connection) { // Connection is an instance of VoiceConnection
        const dispatcher = connection.playFile(sound.path);
        message.delete();
        const msg = await message.channel.send(`:microphone2: **Playing:** \`${sound.name} :: ${sound.description}\``);
        msg.delete(5000); 
      })
      .catch(async function(error) {
        const msg = await message.reply(`:poop: Oui mais non. Pas envie... Tu es sur que \`${settings.prefix}sb ${query}\` existe?  \`${settings.prefix}sb list\` pour recevoir la liste des sons dispo. `);
        msg.delete(15000);
        message.delete(15000);
        //console.error
        client.log("err", error, "SB"); 
      });    
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sound", "soundbox"],
  permLevel: "User"
};
  
exports.help = {
  name: "sb",
  category: "Audio",
  description: "SOUND BOX : lis le son choisit, `sb list' pour avoir la liste des sons.",
  usage: "sb <Nom du son>"
};
   