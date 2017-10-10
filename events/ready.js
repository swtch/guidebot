module.exports = async client => {
  await client.wait(1000);

  client.log("log", `Ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "Ready!");
  
  client.isReady = true;
  client.theHut = client.guilds.find("id","151289667956768768");
  client.user.setPresence({ status: "online", game: { name: ".Help", type: 0 } });

  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));
  
  // launch PUBG tracker
  client.pubgLive();

// launch the SB API Server
  var server = client.api.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    client.log("log",`Soundbox API server listening at port:${port}`, "SB-API");
  });
};
