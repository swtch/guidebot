// check node version
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
// and d'autre truc
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const client = new Discord.Client();




// load config file
client.config = require("./config.js");

require("./modules/functions.js")(client);

// Aliases and commands 
client.commands = new Enmap();
client.aliases = new Enmap();


client.settings = new Enmap({ name: "settings", persistent: true });

// Sound Collection
client.sounds = new Enmap();
client.soundsList = new Array();
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
    const cat = mp3.split(".")[1];
    client.soundsList.push({"name": soundName, "category":cat.toLowerCase(),"description": mp3.split(".")[2]});
    client.sounds.set(soundName.toLowerCase(), { "name": soundName.toLowerCase(), "description": mp3.split(".")[2], "path": `./media/sb/${mp3}`,"category": cat.toLowerCase() });
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
/*-----------------------------------------------------------API SOUNDBOARD---------------------------------------*/
// set up the SoundBox API server
const express = require("express");
const bodyParser = require("body-parser");
client.port = 3000; 
client.api = express();
client.api.use(bodyParser.urlencoded({ extended: false }));
client.api.use(bodyParser.json()); 

// GET liste des sons
client.api.get("/sb", function(req,res) {
  res.jsonp( client.soundsList );
});
// GET if user granted to use SB-web
client.api.get("/isGranted/:user_id", function(req,res) {
  let isGranted = false;
  if ((client.theHut.members.exists("id",req.params.user_id) && client.theHut.members.find("id",req.params.user_id).voiceChannel) ) {
    const memberRole = client.theHut.members.find("id",req.params.user_id).roles;
    isGranted = memberRole.exists("id", "364760344629084160");
  }
  else isGranted = false;
  res.jsonp( isGranted );
});
//GET voicechannel list
client.api.get("/voiceChannel", function(req,res) {
  const data = client.guilds.find("id","151289667956768768").channels;
  res.jsonp( data.findAll("type","voice") );
});
client.api.get("/userInfo/:user_id", function(req, res) {
  const member = client.theHut.members.find("id", req.params.user_id);
  function propTest(pere, fils) {
    if (!pere) {return null;} 
    else {return pere[fils];} } 
  res.jsonp({
    status : member.presence.status,
    playing : member.presence.game,
    roleName : propTest(member.hoistRole, "name"),
    voiceChannel : propTest(member.voiceChannel, "name"),
    voiceChannelUsers : propTest(propTest(member.voiceChannel, "members"), "size")
  });
});
//Post file to play
client.api.post("/play", function(req,res) {
  client.playSound(req.body.sound,req.body.voiceChannel);
  res.json({message : "joue le son dans le channel vocal choisi",
    voiceChannel : req.body.voiceChannel,
    sound : req.body.sound,
    methode : req.method});
});
//POST file to play
client.api.post("/play/:sound", function(req,res) { 
  client.playSoundByUserID(req.params.sound,req.body.userID);
  res.json({message : "joue le son dans le channel vocal choisi",
    userID : req.body.userID,
    sound : req.params.sound,
    methode : req.method});
});

