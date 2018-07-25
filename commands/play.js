exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const yt = require("ytdl-core");
  const voiceChannel = message.member.voiceChannel;
  // get YT link info ans send notif. message.
  yt.getInfo(String(args), async function(err, info) {
    const msg = await message.channel.send(`:arrow_forward: **${message.author.username}** a lancé la lecture de :  **info.title}**`)
    msg.delete(60000);
    return ;
  });
  message.delete(1000);
  if (!voiceChannel) return message.channel.send("T'es bien gentil mon petit poulet, mais pour ça il faudrait que tu te connectes à un channel vocal...");
  //Coonect to Voice chan  and stream audio.
  voiceChannel.join()
    .then(connection => {
      const stream = yt(String(args), {audioonly: true});
      const dispatcher = connection.playStream(stream);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "play",
  category: "Audio",
  description: "Lis l'audio d'une video YouTube. Tu dois être dans un chan vocal.",
  usage: "play <lien_YouTube>"
};
