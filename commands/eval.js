exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(clean, { code: "js", split : true });
  } catch (err) {
    const errorContent = await client.clean(client, err)
    message.channel.send(errorContent, { code: "js", split : true });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Papa"
};

exports.help = {
  name: "eval",
  category: "Systeme",
  description: "Test de code JS",
  usage: "eval <...code...>"
};
