require('dotenv').config();
const {Cmd, help} = require('discord-made-siple');
const Discord = require('discord.js');
const mongo = require('mongodb');
const {ping, uptime} = require('simple-discord-commands')
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

bot.on('ready', () => {
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
let Commands = new Cmd("!", 0, ()=>{}, "", [
  ping,
  new Cmd("rule", 1, help, null, [
    new Cmd("add", 0, addRule),
    new Cmd("list", 0, listRule)
  ]),
  uptime
])
bot.on('message', msg => {
  Commands.test(msg.content, msg)
});
