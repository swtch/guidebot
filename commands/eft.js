exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

    const tips = client.tips.get()

    if (action === "add") {
        if (!key) return message.reply("Merci de préciser le \"Tips\" à ajouter");
        if (eft[key]) return message.reply("Cette \"Tips\" existe déja");
        if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
        eft[key] = value.join(" ");
        client.settings.set(message.guild.id, settings);
        message.reply(`${key} à até ajouté avec comme valeur: ${value.join(" ")}`);
      } else
      if (action === "edit") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" à editer");
        if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
        if (!settings[key]) return message.reply("Cette \"Tips\" n'existe pas");
        eft[key] = value.join(" ");
        client.settings.set(message.guild.id, settings);
        message.reply(`${key} à até modifié avec comme valeur: ${value.join(" ")}`);
      } else
      
    
      if (action === "del") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" à supprimer");
        if (!settings[key]) return message.reply("Cette \"Tips\" n'existe pas");
        const response = await client.awaitReply(message, `Etes vous sur de vouloir supprimer ${key}? (oui/non)`);
        if (["o", "oui", "ouais","y","yes"].includes(response)) {
          delete eft[key];
          this.client.settings.set(message.guild.id, settings);
          message.reply(`${key} à bien été supprimer.`);
        } else
        if (["n","no","non"].includes(response)) {
          message.reply("Action annulé.");
        }
      } else
      
    
      if (action === "view") {
        if (!key) return message.reply("Merci de préciser la \"Tips\" que tu veux consulter");
        if (!settings[key]) return message.reply("Cette \"Tips\" n'existe pas");
        message.reply(`la valeur de ${key} est actuellement ${settings[key]}`);
      } else {
        message.channel.send(inspect(settings), {code: "json"});
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
      description: "permet d'ajouter, de supprimer et de consulter des tips pour escapes from tarkov ",
      usage: "eft <add/view/del/list [nom du tips]>"
    };
       