process.on("unhandledRejection", console.error);


require('dotenv').config();
const opus = require("@discordjs/opus").OpusEncoder
const {Cmd, help} = require('discord-made-siple');
const Discord = require('discord.js');
const mongo = require('mongodb');
const {ping, uptime} = require('simple-discord-commands')
const audioLength = require('./src/duration');
const random = require("./src/random")

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN
if (TOKEN == null) {
  console.error("no token provided");
}
const MongoClient = require('mongodb').MongoClient;

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017';

// Database Name

const dbName = 'discord';

// Connect using MongoClient

bot.login(TOKEN)


bot.on('ready', async () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});
/**
 * @param {String} inp 
 * @param {Discord.Message} msg 
 * @param {Cmd} cmd 
 */
function addRule(inp, msg, cmd) {
  MongoClient.connect(url, function(err, client) {
    // Create a collection we want to drop later
    client.db(dbName).collection("rules").countDocuments().then((index)=>{
      client.db(dbName).collection("rules").insertOne({"rule":"yes", "content":inp.trim().slice(3).trim(), "index":index})
    })
  });
}
function listRule(inp, msg, cmd) {
  MongoClient.connect(url, function(err, client) {
    // Create a collection we want to drop later
    let value = client.db(dbName).collection("rules").find({"rule":"yes"})
    value.count().then((count) => {
      var reply =  count.toString() + " rules\n"
      value.forEach((doc) => {
        reply = reply + doc.content + "\n"
      })
      // reply = reply.slice(0,2)
      msg.reply(reply)
    })
  });
}
/**
 * @param {String} inp 
 * @param {Discord.Message} msg 
 * @param {Cmd} cmd 
 */
async function playRussiaNationalAnthem(inp, msg, cmd) {
  var quotes = [["The goal of Socialism is Communism."], ["Atheism is the natural and inseparable part of Communism."], ["Workers of the world, unite!"], ["We will hang the capitalists with the rope that they sell us."], ["The problem with socialism is that you eventually run out of other people's money."], ["Communism is Soviet government plus the electrification of the whole country."], ["If anything is certain, it is that I myself am not a Marxist."," -Karl Marx"]]
  // Only try to join the sender's voice channel if they are in one themselves
  if (msg.member.voice.channel) {
    const connection = await msg.member.voice.channel.join();
    connection.voice.setSelfMute(false)
    connection.setSpeaking('SOUNDSHARE')
    console.log(process.cwd()+'hiiiii.mp3');
    let file = '/Users/24wilber/Documents/Discord/Discord-Bot-npm/audio/National_Anthem_of_Russia.mp3'
    const dispatcher = connection.play(file)
    length = await audioLength(file)
    var quotesCopy = quotes
    for (let i = 0; i < quotesCopy.length*1; i++) {
      setTimeout(() => {
        var quote = quotesCopy.splice(random.randomInt(quotes.length), 1)[0]
        var previousQuoteSaidLength = quote[0].match(" ").length
        for (let i = 0; i < quote.length; i++) {
          /**
           * @type {string}
           */
          const quoteSay = quote[i];
          setTimeout(() => {
            previousQuoteSaidLength = quote[i].match(" ").length + previousQuoteSaidLength
            msg.reply(quoteSay)
          }, previousQuoteSaidLength*500)
        }
      }, Math.floor((length)/(quotes.length)*1000)*i)
    }

    dispatcher.setVolume(0.5); // half the volume
    dispatcher.on('finish', () => {
      console.log('Finished playing!');
      console.log(dispatcher.player.streamingData.timestamp);
      dispatcher.destroy(); // end the stream
      connection.disconnect()
    });
    
  } else {
    msg.reply('You need to join a voice channel first!');
  }
}
let Commands = new Cmd("!", 0, ()=>{}, "", [
  ping,
  new Cmd("rule", 1, help, null, [
    new Cmd("add", 0, addRule),
    new Cmd("list", 0, listRule)
  ]),
  new Cmd("russia", 0, playRussiaNationalAnthem),
  uptime
])
bot.on('message', msg => {
  Commands.test(msg.content, msg)
});