const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
    const Discord = require("discord.js");
    const game = 'tarkov';
    const tips = client.tips.get(game)


    if (action === "add") {

        if (key == 0) return message.reply("Merci de préciser le \"Tips\" à ajouter");
        if (tips[key]) return message.reply("Cette \"Tips\" existe déja");
        if (value.length < 1) return message.reply("Erreur, aucun contenu specifiée :: eft add titre contenu");
        tips[key] = { "name": key, "author": `${message.author.username}`, "content": value.join(" "), "timestamp": message.createdAt , "avatarURL" : message.author.avatarURL};
        client.tips.set(game, tips);
        message.channel.send(`:white_check_mark: **${key}** a bien été ajouté avec comme contenu: \`\`\`${value.join(" ")}\`\`\``);
    } else

        if (action === "edit") {
            if (!key) return message.reply("Merci de préciser la \"Tips\" à editer");
            if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
            if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
            tips[key] = { "name": key, "author": message.author.username, "content": value.join(" "), "timestamp": message.createdAt , "avatarURL" : message.author.avatarURL};
            client.tips.set(game, tips);
            message.channel.send(`:white_check_mark: **${key}** à été modifié avec le contenu suivant: \`\`\`${value.join(" ")}\`\`\``);
        } else


            if (action === "del") {
                if (!key) return message.reply("Merci de préciser la \"Tips\" à supprimer");
                if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
                const response = await client.awaitReply(message, `Etes tu sûres de vouloir supprimer **${key}**? (oui/non)`);
                if (["o", "oui", "ouais", "y", "yes"].includes(response)) {
                    delete tips[key];
                    client.tips.set(game, tips);
                    message.reply(`**${key}** à bien été supprimé.`);
                } else
                    if (["n", "no", "non"].includes(response)) {
                        message.reply("Action annulé.");
                    }
            } else


                if (action === "view") {
                    if (!key) return message.reply("Merci de préciser la \"Tips\" que tu veux consulter");
                    if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
                    const theTips = tips[key]
                    message.channel.send(`:information_source: **${theTips.name}** || *Tarkov tips by ${theTips.author}*\n ${theTips.content} `);
                } else
                  if (tips[action]) {
                    const theTips = tips[action];
                    message.channel.send(`:information_source: **${theTips.name}** || *Tarkov tips by ${theTips.author}*\n ${theTips.content} `);
                  }
                  else     {
                    let output = "= Liste des Tips Escape from Tarkov =\n";
                    Object.keys(tips).forEach(t => { output += `\n${t}`;});
                    message.channel.send(output,{ code: "asciidoc"});
                    //message.channel.send(inspect(tips), {code: "json"});
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
    description: "Permet d'ajouter, de supprimer, d'editer et de consulter des tips pour Escape from Tarkov ",
    usage: "eft <add/view/edit/del> <titre du tips> <contenu (texte ou liens)>"
};
