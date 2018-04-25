const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

    const game = 'tarkov';
    const tips = client.tips.get(game)
    

    if (action === "add") {
        
        if (key == 0) return message.reply("Merci de préciser le \"Tips\" à ajouter");
        if (client.tips[0].get(key)) return message.reply("Cette \"Tips\" existe déja");
        if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
        //tips[key] = value.join(" ");
        //client.tips.set(game, tips);
        client.tips[0].set(key, {"name": key, "author" : `<@!${message.author.id}>` , "content": value, "timestamp" : message.createdAt });
        message.reply(`${key} à até ajouté avec comme valeur: ${value.join(" ")}`);
      } else

      if (action === "edit") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" à editer");
        if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
        if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
        tips[key] = value.join(" ");
        client.tips.set(game, tips);
        message.reply(`${key} à até modifié avec comme valeur: ${value.join(" ")}`);
      } else
      
    
      if (action === "del") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" à supprimer");
        if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
        const response = await client.awaitReply(message, `Etes vous sur de vouloir supprimer ${key}? (oui/non)`);
        if (["o", "oui", "ouais","y","yes"].includes(response)) {
          delete tips[key];
          this.client.tips.set(game, tips);
          message.reply(`${key} à bien été supprimer.`);
        } else
        if (["n","no","non"].includes(response)) {
          message.reply("Action annulé.");
        }
      } else
      
    
      if (action === "view") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" que tu veux consulter");
        if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
        message.reply(`la valeur de ${key} est actuellement ${tips[key]}`);
      } else {
        message.channel.send(inspect(tips), {code: "json"});
      }

    };
    
    exports.conf = {
      enabled: true,
      guildOnly: true,
      aliases: ["tarkov", "escape"],
      permLevel: "User"
    };
      
    exports.help = {
      name: "eft",
      category: "Escape from Tarkov",
      description: "permet d'ajouter, de supprimer et de consulter des tips pour Escape from Tarkov ",
      usage: "eft <add/view/edit/del [nom du tips]>"
    };
       