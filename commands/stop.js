exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (!message.member.voiceChannel) return;
  message.channel.send(`:stop_button: Bravo **${message.author.username}** ! tu niques l'ambiance ! :clap:  `);
  message.member.voiceChannel.join()
    .then(connection => { // Connection is an instance of VoiceConnection
      connection.disconnect();
    })
    .catch(console.log);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["tg", "unvoice"],
  permLevel: "User"
};

exports.help = {
  name: "stop",
  category: "Audio",
  description: "Stop la lecture audio en cours... Incroyable non?",
  usage: "stop"
};
