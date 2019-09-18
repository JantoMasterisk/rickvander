const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "skip",
      description: "Sla een liedje over!",
      category: "Muziek",
      subCommands: ["sk"]
    });
  }

  async run(message) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Speelt nu")
      .setDescription("Er speelt momenteel niets!")
    );
    let queue = this.client.queues[message.guild.id];
    if (!message.member.voiceChannel || message.member.voiceChannel.id !== queue.voiceChannel.id) return message.error("Je niet niet in de juiste voicechannel.");
    if (!message.member.roles.some(r => [message.guild.settings.dj].includes(r.name)) && message.author.id !== queue.nowPlaying.author.id) return message.error(`Je moet de **${message.guild.settings.dj}** rol hebben of de song requester zijn om dit liedje te skippen! Misschien wil je dit liedje voteskippen (\`${message.guild.settings.prefix}voteskip\`)?`);  
    if (queue.playing && queue.djOnly && !message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`DJ-Modus is geactiveert. Alleen DJ's mogen de muziekcommando's gebruiken!`); 
    let song = queue.nowPlaying;
    let msg = await message.channel.send(message.embed()
      .setTitle("Skip...")
      .setDescription(`Het liedje **${song.title}** wordt overgeslagen...`)
    );
    await queue.dispatcher.end();
    msg.edit(message.embed()
      .setTitle("Skip!")
      .setDescription(`Het liedje **${song.title}** is overgeslagen!`)
    );
  }
}
