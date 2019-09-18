const command = require("bananenbase").command;
const request = require("request");
const ytdl = require("ytdl-core");

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "play",
      category: "Muziek",
      args: ["url/zoekterm: required"],
      description: "Speel muziek af!"
    });
  }

  async run(message, args) {
    let queue = this.client.queues[message.guild.id];
    if (!queue) queue = {};
    if (queue.playing && queue.djOnly && !message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`DJ-Modus is geactiveert. Alleen DJ's mogen de muziekcommando's gebruiken!`); 

    if (queue.playing && message.member.voiceChannel.id !== queue.voiceChannel.id) return message.error(`Je moet in de voicechannel **${queue.voiceChannel.name}** zitten!`)
    if (!message.member.voiceChannel) return message.error("Je moet eerst in een voiceChannel zitten!");
    if (!args[0]) return message.error("Geef een zoekterm of een url op!");
    let link;
    let msg;
    let title;
    let thumbnail;
    if (["http://youtube.com", "https://youtube.com", "http://www.youtube.com", "https://www.youtubel.com", "http://youtu.be", "http://www.youtu.be", "https://youtu.be", "https://www.youtu.be"].includes(args[0].toLowerCase())) {
      msg = await message.channel.send(message.embed()
        .setDescription("Laden, even geduld aub...")
      );
      link = args[0];
    } else {
      let start = Date.now();
      request({
        uri: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${args.join(" ")}&maxResults=5&key=${this.client.config.ytapiToken}`,
        json: true
      }, async (err, _all, body) => {
        if (err) return message.error(`Er ging iets fout bij het zoeken naar een YouTube video: **${err}**`);
        let embed = message.embed()
          .setTitle(`Youtube zoeken`)
          .setDescription(`Zoekresultaten voor **${args.join(" ")}**`)
          .setFooter(`Gevonden in ${Date.now()-start}ms - Druk op een nummer om die video te kiezen en druk op ❌ om te annuleren.`);
        if (!body.items) return message.error("Niets gevonden");
        body.items.forEach((item, row) => { item = item.snippet;
          let emoji = "1⃣";
          if (row === 1) emoji = "2⃣";
          else if (row === 2) emoji = "3⃣";
          else if (row === 3) emoji = "4⃣";
          else if (row === 4) emoji = "5⃣"
          embed.description += `\n${emoji} **${item.title}**`
        });
        msg = await message.channel.send(embed);
        let collector = msg.createReactionCollector((reaction, user) => {return ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "❌"].includes(reaction.emoji.name) && user.id === message.author.id}, { time: 60 * 60 * 1000 });
        collector.on("collect", async (reaction) => {
          let n = 4;
          if (reaction._emoji.name === "1⃣") n = 0;
          else if (reaction._emoji.name === "2⃣") n = 1;
          else if (reaction._emoji.name === "3⃣") n = 2;
          else if (reaction._emoji.name === "4⃣") n = 3;
          else if (reaction._emoji.name === "❌") n = 5;
          msg.clearReactions();
          if (n !== 5) {
            title = body.items[n].snippet.title;
            await msg.edit(message.embed()
              .setTitle("Laden...")
              .setDescription(`**${body.items[n].snippet.title.toString().replace("&#39;", "'")}** aan het laden..`)
            );
            thumbnail = body.items[n].snippet.thumbnails.default.url;
            link = body.items[n].id.videoId;
          } else msg.edit(message.embed()
            .setDescription("Kiezen geannuleerd.")
          );
        });
        try {
          await msg.react("1⃣").catch();
          await msg.react("2⃣").catch();
          await msg.react("3⃣").catch();
          await msg.react("4⃣").catch();
          await msg.react("5⃣").catch();
          await msg.react("❌").catch();
        } catch(err) {}
      });
    }

    let interval = setInterval(() => {
      if (link) {
        clearInterval(interval);
        if (link.includes("list")) return message.error("Er is geen ondersteuning voor playlists.");
        ytdl.getBasicInfo(link, async (err, info) => {
          msg.clearReactions();
          if (err || info.status !== "ok") return msg.edit(message.embed()
            .setTitle("Er ging iets fout!")
            .setDescription(`Ik kan geen informatie ophalen met de url ${link}.`)
          );
          info._title = title;
          if (!queue.playing) {
            let connection = await message.member.voiceChannel.join();
            queue = {
              playing: true,
              loop: false,
              dispatcher: undefined,
              voiceChannel: {
                id: message.member.voiceChannel.id,
                name: message.member.voiceChannel.name,
                connection: connection
              },
              songs: [createSong(info, message, thumbnail)],
              nowPlaying: {},
              voteSkip: []
            };
            this.client.queues[message.guild.id] = queue;
            msg.edit(message.embed()
              .setTitle("Spelen!")
              .setDescription(`Het nummer **${createSong(info, message).title}** wordt nu afgespeelt...`)
            );
            p(message, this.client);
          } else {
            queue.songs.push(createSong(info, message, thumbnail));
            this.client.queues[message.guild.id] = queue;
            msg.edit(message.embed()
              .setTitle("Toegevoegd!")
              .setDescription(`Het nummer **${createSong(info, message, thumbnail).title}** is toegevoegd aan de wachtrij!`)
            );
          }
        });
      }
    });
  }
}

function createSong(song, message, thumbnail = "") {
  return {
    author: message.author,
    title: song.media.song || song._title || "???",
    description: song.description.substr(0, 50) + " ...",
    id: song.video_url.split("watch?v=")[1],
    url: song.video_url,
    channel: song.author,
    thumbnail: thumbnail
  }
}

async function p(message, client) {
  let queue = client.queues[message.guild.id];
  if (!queue.songs[0]) {
    client.queues[message.guild.id] = {playing: false};
    queue.voiceChannel.connection.disconnect();
    return message.channel.send("De wachtrij is leeg, ik stop met afspelen!");
  }
  let song = client.queues[message.guild.id].songs[0];
  client.queues[message.guild.id].nowPlaying = song;
  let dispatcher = await queue.voiceChannel.connection.playStream(ytdl(song.url, {filter: "audioonly"}));
  client.queues[message.guild.id].dispatcher = dispatcher;
  dispatcher.on("start", () => {
    message.channel.send(message.embed()
      .setTitle(`Nummer gestart`)
      .setDescription(`Ik speel nu **${song.title.toString()}** voor **${song.author.username}**!`)
    );
  });
  dispatcher.on("error", (err) => {
    message.channel.send(`Fout tijdens het afspelen: ${err}`);
    checkLoop(message, song, client);
  });
  dispatcher.on("end", () => {
    checkLoop(message, song, client);
  });
}

function checkLoop(message, song, client) {
  let queue = client.queues[message.guild.id];
  if (!queue.loop) return p(message, client, client.queues[message.guild.id].songs.shift());
  else if (queue.loop === "song") return p(message, client, song);
  client.queues[message.guild.id].songs.push(queue.nowPlaying);
  p(message, client, client.queues[message.guild.id].songs.shift());
}
