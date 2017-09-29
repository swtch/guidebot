module.exports = async (client, query, voiceChannel) => {
  const sound = client.sounds.get(query);
  voiceChannel.join()
    .then(async function(connection) { // Connection is an instance of VoiceConnection
      const dispatcher = connection.playFile(sound.path);
    })
    .catch(async function(error) { client.log("err", error, "SBWEB"); 
    });    
};

