exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send("Ping?");
  msg.edit(`Ouais... je suis là FDP. Et à la vitesse de ** ${msg.createdTimestamp - message.createdTimestamp}ms**. Latence de l'API: **${Math.round(client.ping)}ms**.`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Systeme",
  description: "Ben pong Captain Obvious!",
  usage: "ping"
};
