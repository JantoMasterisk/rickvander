const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "voteskip",
      description: "Vote om een liedje over te slaan!",
      category: "Muziek",
      subCommands: ["vsk"]
    });
  }

  async run(message) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Speelt nu")
      .setDescription("Er speelt momenteel niets!")
    );
    let queue = this.client.queues[message.guild.id];
    if (queue.playing && queue.djOnly && !message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`DJ-Modus is geactiveert. Alleen DJ's mogen de muziekcommando's gebruiken!`); 
    if (!message.member.voiceChannel || message.member.voiceChannel.id !== queue.voiceChannel.id) return message.error("Je niet niet in de juiste voicechannel.");
    if (!this.client.queues[message.guild.id].nowPlaying.voteSkip) this.client.queues[message.guild.id].nowPlaying.voteSkip = [];
    if (this.client.queues[message.guild.id].nowPlaying.voteSkip.includes(message.author.id)) return message.error("Je hebt al gevote om dit liedje te skippen.");
    this.client.queues[message.guild.id].nowPlaying.voteSkip.push(message.author.id);
    if (this.client.queues[message.guild.id].nowPlaying.voteSkip.length >= Math.ceil(message.member.voiceChannel.members.size/2)) {
      let song = queue.nowPlaying;
      let msg = await message.channel.send(message.embed()
        .setTitle("Skip...")
        .setDescription(`Het liedje **${song.title}** wordt overgeslagen...`)
      );
      await queue.dispatcher.end();
      msg.edit(message.embed()
        .setTitle("Voteskip!")
        .setDescription(`Het liedje **${song.title}** is overgeslagen!`)
      );
    } else message.channel.send(message.embed()
      .setTitle("Voteskip")
      .setDescription(`Stem meegetelt! **${this.client.queues[message.guild.id].nowPlaying.voteSkip.length}/${Math.ceil(message.member.voiceChannel.members.size/2)}** stemmen.`)
    );
  }
}
