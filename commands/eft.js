exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

    const tips = client.tips.get()
    const game = 'tarkov'

    if (action === "add") {
        if (!key) return message.reply("Merci de préciser le \"Tips\" à ajouter");
        if (tips[key]) return message.reply("Cette \"Tips\" existe déja");
        if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
        tips[key] = value.join(" ");
        client.tips.set(game, tips);
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
          this.client.tips.set(game, settings);
          message.reply(`${key} à bien été supprimer.`);
        } else
        if (["n","no","non"].includes(response)) {
          message.reply("Action annulé.");
        }
      } else
      
    
      if (action === "view") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" que tu veux consulter");
        if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
        message.reply(`la valeur de ${key} est actuellement ${settings[key]}`);
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
      usage: "eft <add/view/del/list [nom du tips]>"
    };
       