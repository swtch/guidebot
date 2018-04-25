const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars
    const Discord = require("discord.js");
    const game = 'tarkov';
    const tips = client.tips.get(game)


    if (action === "add") {

        if (key == 0) return message.reply("Merci de préciser le \"Tips\" à ajouter");
        if (tips[key]) return message.reply("Cette \"Tips\" existe déja");
        if (value.length < 1) return message.reply("Erreur, aucun contenu specifiée :: eft add titre contenu");
        tips[key] = { "name": key, "author": `<@!${message.author.username}>`, "content": value.join(" "), "timestamp": message.createdAt , "avatarURL" : message.author.avatarURL};
        client.tips.set(game, tips);
        message.channel.send(`:white_check_mark: **${key}** a bien été ajouté avec comme contenu: \`\`\`${value.join(" ")}\`\`\``);
    } else

        if (action === "edit") {
            if (!key) return message.reply("Merci de préciser la \"Tips\" à editer");
            if (value.length < 1) return message.reply("Erreur, aucune valeur specifiée");
            if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
            tips[key] = { "name": key, "author": message.author.username, "content": value.join(" "), "timestamp": message.createdAt , "avatarURL" : message.author.avatarURL};
            client.tips.set(game, tips);
            message.channel.send(`:white_check_mark: ${key} à até modifié par le contenu suivant: \`\`\`${value.join(" ")}\`\`\`}`);
        } else


            if (action === "del") {
                if (!key) return message.reply("Merci de préciser la \"Tips\" à supprimer");
                if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
                const response = await client.awaitReply(message, `Etes tu sûres de vouloir supprimer **${key}**? (oui/non)`);
                if (["o", "oui", "ouais", "y", "yes"].includes(response)) {
                    message.reply(`${key} à bien été supprimer.`);
                    delete tips[key];
                    client.tips.set(game, tips);
                    message.reply(`${key} à bien été supprimer.`);
                } else
                    if (["n", "no", "non"].includes(response)) {
                        message.reply("Action annulé.");
                    }
            } else


                if (action === "view") {
                    if (!key) return message.reply("Merci de préciser la \"Tips\" que tu veux consulter");
                    if (!tips[key]) return message.reply("Cette \"Tips\" n'existe pas");
                    const theTips = tips[key]
                    const embed = new Discord.RichEmbed()
                        .setTitle("Escape from Tarkov Tips")
                        .setAuthor(theTips.author, theTips.avatarURL)
                        .setColor(0x524918)
                        //.setThumbnail(imgURL)
                        .setTimestamp(theTips.timestamp)
                        //.setURL("https://pubgtracker.com/profile/pc/" + pubgID + "?region=" + serv)
                        .addField(theTips.name, theTips.content, true);

                    message.channel.send({ embed });
                } else {
                    let output = "= Liste des Tips Escape from Trakov =\n";
                    tips.forEach(t => { output += `\n${t.name}     ::     Auteur: ${t.author}`;});
                    message.channel.send(output,{ code: "asciidoc"});
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
