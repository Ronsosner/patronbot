const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDk1MTkzOTk1ODAzMzYxMjgw.Do-kgA.9ecyITqAqq1lZ2z07z-CtvOWNdI"
const PREFIX = "?"

var bot = new Discord.Client({disableEveryone: true});
var servers = {};

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    })
}

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online`);
    bot.user.setGame("on DisPatron!")
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if(message.content == "patron"){
        message.channel.sendMessage("What do you want kiddo?");
    }
});

bot.on("message", function(message) {
    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "credits":
            message.channel.sendMessage("Ron{Owner}, Nehoray{Admin}, Itamar{Admin}");
            break;
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(Connection){
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage("Invalid command");
    }
});

bot.login(TOKEN);
