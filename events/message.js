// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;


  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)
  const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;

  message.settings = settings;
  const msg = message.content.toLowerCase().split(" ");


 
  if (~msg.indexOf("bot")) {return message.channel.send("Ah bon!? Seulement sur la base de mon apparence vous jugez que je suis un bot...? c'est intérressant qu'on intérroge tous nos propres stétéreotypes dans ce discord... La frontiére de nos stéréotype est a mon avis beaucoup plus fluide que ce que l'on peut penser... ");}
  if (~msg.indexOf("omg")) {return message.channel.send({file :"./media/omg.png"});}
  if (~msg.indexOf("blanc") || ~msg.indexOf("homme")|| ~msg.indexOf("libanais")) {return message.channel.send({file :"./media/halflibanais.png"});}
  if (~msg.indexOf("FUCK YEEEAH")) {return message.channel.send("Coming again, to save the mother fucking day yeah!");}
  if (~msg.indexOf("cod") || ~msg.indexOf("COD")|| ~msg.indexOf("CoD")|| ~msg.indexOf("call of duty")) {return message.channel.send("PTDR :joy: T Ki? d'ou tu parles de ce jeu du sheitan");}



  if (message.content.indexOf(settings.prefix) !== 0) return;
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  const level = client.permlevel(message);

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (!cmd) return;

  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("Cette commande ne marche pas en MP. Go sur le Text channel de TheHut bae.");

  if (client.settings.get(message.guild.id).systemNotice === "true") {
    if (level < client.levelCache[cmd.conf.permLevel])
      return message.channel.send(`:raised_hand:  Non je ne crois pas non! tu t'es cru pour qui !?
Toi t'es qu'un **${client.config.permLevels.find(l => l.level === level).name}** (level ${level})
Alors qu'il faut etre au minimum **${cmd.conf.permLevel}** (${cmd.conf.permLevel}) pour avoir l'immense honneur de l'utiliser.`);
  }

  client.log("log", `${client.config.permLevels.find(l => l.level === level).name} <${message.author.username}>  ran command <${cmd.help.name} ${args.join(" ")}>`, "CMD");
  cmd.run(client, message, args, level);
};
