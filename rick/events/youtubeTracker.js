const event = require("bananenbase").event;
const discord = require("discord.js");
const request = require("request");

module.exports = class youtubeUploadTracker extends event {
  constructor(client) {
    super(client, {
      name: "ready"
    });
  }

  async run() {
    setInterval(() => {
      request({
        uri: `https://www.googleapis.com/youtube/v3/channels?key=${this.client.config.youtubeToken}&forUsername=${this.client.config.youtubeTrackingChannelName}&part=id`,
        json: true
      }, (err, a, body) => {
        request({
          uri: `https://www.googleapis.com/youtube/v3/search?key=${this.client.config.youtubeToken}&channelId=${body.items[0].id}&part=snippet,id&order=date&maxResults=1`,
          json: true
        }, async (err, a, body) => {
          let oldId = await this.client.db.get("youtubeNotifyLastVideoID");
          if (!body.items) return console.error(`Error tijdens het zoeken op YouTube: `, body);
          if (oldId !== body.items[0].id.videoId) {
            let channel = this.client.channels.find(c => c.name === this.client.config.youtubeNotifyChannel);
            if (channel) channel.send(new discord.RichEmbed()
              .setTitle("Nieuwe video!")
              .setColor("#00ff00")
              .setDescription(`**${body.items[0].snippet.channelTitle}** heeft een nieuwe video geupload, genaamd **${body.items[0].snippet.title}**!\nDruk [hier](https://www.youtube.com/watch?v=${body.items[0].id.videoId}) om de video te openen!`)
              .setThumbnail(body.items[0].snippet.thumbnails.default.url)
            );
            await this.client.db.set("youtubeNotifyLastVideoID", body.items[0].id.videoId);
          }
        });
      });
    }, 10000000);
  }
}
