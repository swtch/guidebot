module.exports = async (client, oldMember, newMember ) => {
  if (oldMember.id !== client.user.id) return;
  if (!newMember.voiceChannel) return;
  await client.wait(900000) 
    .then(()=>{
      if (!client.voiceConnections.first().speaking) {
        //console.log("OUI. bot ne parlait pas")  
        client.voiceConnections.first().disconnect();
      }
      else {
        //console.log("NON. bot parle actuellement")  
        client.dispatcher.on("end", () => {
          client.voiceConnections.first().disconnect();
        });
      }
    }
    );
};