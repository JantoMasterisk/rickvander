const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "np",
      description: "Kijk wat er nu speelt!",
      category: "Muziek",
      subCommands: ["nowplaying", "speeltnu"]
    });
  }

  async run(message) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Speelt nu")
      .setDescription("Er speelt momenteel niets!")
    );
    let song = this.client.queues[message.guild.id].nowPlaying;
    message.channel.send(message.embed()
      .setTitle("Speelt nu")
      .setDescription(`Ik speel nu **${song.title}** voor **${song.author}**. [Open op youtube](${song.url}).\nDit liedje is op YouTube geupload door **${song.channel.name || song.channel.user || "???"}**.`)
      .setThumbnail(song.thumbnail)
    );
  }
}
