

module.exports = (client, member) => {

  const settings = client.config.defaultSettings;
  if (!settings.welcomeEnabled === "true") return;
  const newAlertIndex = Math.floor((Math.random()*settings.welcomeMessage.length));
  const newAlert = settings.welcomeMessage[newAlertIndex];
  const welcomeMessage = newAlert.replace("{{user}}", member);
  client.log("Log", member+" join.","Event");
  member.guild.channels.find("id", "151289667956768768").send(welcomeMessage).catch(console.error);
};
