exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  const { promisify } = require("util");
  const Enmap = require("enmap");
  const readdir = promisify(require("fs").readdir);
  const diff = function(oldO, newO) {
    const newElem = [];
    newO.forEach(i => {
      const oldI = oldO.find("name" , i.name);
      if (!oldI )  {newElem.push(i.name);}
    });
    console.log(newElem);
    return newElem;
  };
    

  if (!args || args.size < 1) return message.channel.send("T'es un marrant toi! Je vais la deviner la **commande** moi?");

  let command;
  if (client.commands.has(args[0])) {
    command = client.commands.get(args[0]);
  } else if (client.aliases.has(args[0])) {
    command = client.commands.get(client.aliases.get(args[0]));
  }

  if (args[0]=== "soundlist") {
    const soundFiles = await readdir("./media/sb/");
    client.log("log", `Loading a total of ${soundFiles.length} sounds.`);
    const newSounds = new Enmap();
    soundFiles.forEach(async (mp3) =>  {
      const soundName = mp3.split(".")[0].toLowerCase();
      //if (!client.soundsUse[soundName] || (client.soundsUse[soundName] <= 0)) {client.soundsUse.set(soundName, 0 );}
      newSounds.set(soundName,  {"name" : soundName, "description" : mp3.split(".")[1], path: `./media/sb/${mp3}` });
    });
    const difference = diff(client.sounds, newSounds);
    let plu = ["",""];
    if (difference.length > 1)  plu = ["s","x"];
    let output = `= ${difference.length} nouveau${plu[1]} son${plu[0]} ajouté${plu[0]}  =\n`;
    difference.forEach(e => {output += `${e}:: ${newSounds.find("name",e).description}\n`;});
    client.sounds = newSounds;
    message.channel.send(`Rechargement des ${soundFiles.length} sons effectué. :ok_hand:`);
    if (difference.length >= 1)  message.guild.channels.find("id","353996227894837248").send(output, { code: "AsciiDoc" }) ;
    return message.channel.send(output, { code: "AsciiDoc" }) ;}

  if (!command) return message.channel.send(`Raté! La commande \`${args[0]}\` ne semble pas exister, ou c'est un alias !? Try again Bro!`);
  command = command.help.name;



  delete require.cache[require.resolve(`./${command}.js`)];
  const cmd = require(`./${command}`);
  client.commands.delete(command);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);
  });
  client.commands.set(command, cmd);
  cmd.conf.aliases.forEach(alias => {
    client.aliases.set(alias, cmd.help.name);
  });

  message.channel.send(`La commande  \`${command}\` à été rechargée. :ok_hand: `);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Papa"
};

exports.help = {
  name: "reload",
  category: "Systeme",
  description: "Recharge en mêmoire la commande fournit",
  usage: "reload <command>"
};
