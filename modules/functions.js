module.exports = (client) => {

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 simply handle unhandled things. Like Magic. /shrug
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};
