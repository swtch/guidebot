// check node version
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
// and d'autre truc
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");

const client = new Discord.Client();


client.config = require("./config.js");

require("./modules/functions.js")(client);

// Aliases and commands 
client.commands = new Enmap();
client.aliases = new Enmap();


client.settings = new Enmap({ name: "settings", persistent: true });

// Sound Collection
client.sounds = new Enmap();
//client.soundsUse = new Enmap({ name: "soundsUse", persistent: true });




const init = async () => {

  const cmdFiles = await readdir("./commands/");
  client.log("log", `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    try {
      const props = require(`./commands/${f}`);
      if (f.split(".").slice(-1)[0] !== "js") return;
      client.log("log", `Loading Command: ${props.help.name}. 👌`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      client.log(`Unable to load command ${f}: ${e}`);
    }
  });

  const evtFiles = await readdir("./events/");
  client.log("log", `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  //Load the sounds lists
  const soundFiles = await readdir("./media/sb/");
  client.log("log", `Loading a total of ${soundFiles.length} sounds.`);
  soundFiles.forEach(mp3 => {
    const soundName = mp3.split(".")[0];
    //if (!client.soundsUse[soundName] || (client.soundsUse[soundName] <= 0)) {client.soundsUse.set(soundName, 0 );}
    client.sounds.set(soundName.toLowerCase(), { "name": soundName.toLowerCase(), "description": mp3.split(".")[2], "path": `./media/sb/${mp3}`,"category":mp3.split(".")[1] });
  });

  // Generate a cache of client permissions
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  // login the client.
  client.login(client.config.token);
};


init();

