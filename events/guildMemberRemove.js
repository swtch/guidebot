module.exports = (client, member) => {

  const settings = client.config.defaultSettings;
  if (!settings.leaveEnabled === "true") return;
  
  const newAlertIndex = Math.floor((Math.random()*settings.leaveMessage.length));
  const newAlert = settings.leaveMessage[newAlertIndex];
  if (client.pubgLivePlayers[member.id]) {client.pubgLivePlayers.delete(member.id);}
  const leaveMessage = newAlert.replace("{{user}}", member.displayName );
  client.log("Log", member+" left.","Event");
  member.guild.channels.find("id", "151289667956768768").send(leaveMessage).catch(console.error);
};
