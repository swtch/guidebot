exports.run = (client, message, args, level) => {
  const settings = message.guild ? client.settings.get(message.guild.id) : client.config.defaultSettings;
  if (!args[0]) {
    const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let currentCategory = "";
    let output = `= Liste des commandes = \n\n[    ${settings.prefix}help <Commande> pour plus de détails    ]\n`;
    const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
    sorted.forEach(c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n= ${cat} =\n`;
        currentCategory = cat;
      }
      output += ` ${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}:: ${c.help.description}\n`;
    });
    message.author.createDM()
      .then(function(channel) {
        channel.send(output, { code: "AsciiDoc" });
      });
    message.reply("Check tes **MP** poto!");
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nUtilisation:: ${settings.prefix}${command.help.usage}`, { code: "asciidoc" });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp", "aide"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "General",
  description: "Affiche toutes les commandes qui vous sont disponible",
  usage: "help <commande>"
};
