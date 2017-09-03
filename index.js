// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const PersistentCollection = require("djs-collection-persistent");

class GuideBot extends Discord.Client {
  constructor(options) {
    super(options);

    // Here we load the config.json file that contains our token and our prefix values.
    this.config = require("./config.json");
    // client.config.token contains the bot's token
    // client.config.prefix contains the message prefix

    // Aliases and commands are put in collections where they can be read from,
    // catalogued, listed, etc.
    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();

    // Now we integrate the use of Evie's awesome PersistentCollection module, which
    // essentially saves a collection to disk. This is great for per-server configs,
    // and makes things extremely easy for this purpose.
    this.settings = new PersistentCollection({name: "settings"});
  }

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` command!

  */
  permlevel(message) {
    let permlvl = 0;

    // If bot owner, return max perm level
    if (message.author.id === client.config.ownerID) return 10;

    // If DMs or webhook, return 0 perm level.
    if (!message.guild || !message.member) return 0;

    // The rest of the perms rely on roles. If those roles are not found
    // in the settings, or the user does not have it, their level will be 0
    try {
      const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
      if (modRole && message.member.roles.has(modRole.id)) permlvl = 2;
    } catch (e) {
      console.warn("modRole not present in guild settings. Skipping Moderator (level 2) check");
    }
    try {
      const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
      if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 3;
    } catch (e) {
      console.warn("adminRole not present in guild settings. Skipping Administrator (level 3) check");
    }

    // Guild Owner gets an extra level, wooh!
    if (message.author.id === message.guild.owner.id) permlvl = 4;

    return permlvl;
  }

  /*
  LOGGING FUNCTION

  Logs to console. Future patches may include time+colors
  */
  log(type, msg, title) {
    if (!title) title = "Log";
    console.log(`[${type}] [${title}]${msg}`);
  }

}

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're refering to. Your client.
const client = new GuideBot();

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
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

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  client.log("log", `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // Here we login the client.
  client.login(client.config.token);

// End top-level async/await function.
};

init();
