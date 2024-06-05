require("dotenv").config();

const publicIp = require("public-ip");

const Discord = require("discord.js");
const bot = new Discord.Client();

const TOKEN = process.env.MTI0Nzk0MTAxMjc3MzUzOTk4MQ.GEs9vG.LGzW9Km-cOMSwxF_eww6QQ-WWO2poOE4RhMtL4;
const CHANNEL = process.env.1247918075144179772;
const INTERVAL = process.env.INTERVAL=2000;

bot.login(TOKEN);

var channel;
var interval;
var ip;

async function ip_message() {
  return (
    "Current public ip:\n*IPv4:*\t" +
    (await publicIp.v4()) +
    "\n*IPv6:*\t" +
    (await publicIp.v6())
  );
}

async function post_ip() {
  await channel.bulkDelete(5);
  await channel.send(await ip_message());
}

async function check_ip() {
  var temp_ip = await publicIp.v4();
  if (temp_ip !== ip) {
    ip = temp_ip;
    await post_ip();
  }
}

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  channel = bot.channels.get(CHANNEL);

  interval = setInterval(function() {
    check_ip().catch(function(reason) {
      console.log(reason);
    });
  }, INTERVAL);
});

bot.on("message", msg => {
  if (msg.channel === channel && msg.author !== bot.user) {
    post_ip();
  }
});

bot.on("resume", function() {
  channel = bot.channels.get(CHANNEL);

  interval = setInterval(function() {
    check_ip().catch(function(reason) {
      console.log(reason);
    });
  }, INTERVAL);
});

bot.on("disconnected", function() {
  clearInterval(interval);
});
