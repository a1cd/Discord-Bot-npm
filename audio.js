require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const opus = require("@discordjs/opus")
const audioLength = require('./src/duration');

client.login(process.env.TOKEN);

client.on('message', async message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '/join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();
			connection.voice.setSelfMute(false)
			connection.setSpeaking('SOUNDSHARE')
			console.log(process.cwd()+'hiiiii.mp3');
      const dispatcher = connection.play("https://upload.wikimedia.org/wikipedia/commons/0/02/National_Anthem_of_Russia_(2000),_three_verses.ogg", {type:'ogg/opus'})
      
			dispatcher.setVolume(0.5); // half the volume
			
			dispatcher.on('finish', () => {
				console.log('Finished playing!');
				console.log(dispatcher.player.streamingData.timestamp);
				dispatcher.destroy(); // end the stream
				connection.voice.setSelfMute(true)
			});
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});
