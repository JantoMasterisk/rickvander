const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "Bekijk de wachtrijen!",
      category: "Muziek",
      subCommands: ["wachtrij"]
    });
  }

  async run(message) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Queue")
      .setDescription("Er is momenteel geen wachtrij!")
    );
    let songs = [];
    this.client.queues[message.guild.id].songs.forEach((s, i) => {
      if (i === 0) songs.push(`[${i+1}] ${s.title} - Aangevraagt door: ${s.author.username} <Speelt nu>`);
      else songs.push(`[${i+1}] ${s.title} - Aangevraagt door: ${s.author.username}`);
    });
    message.channel.send(message.embed()
      .setTitle(`${message.guild.name}'s Muziek wachtrij`)
      .setDescription(`**${songs.length}** liedjes in de wachtrij ${(songs.length > 15 ? '*[De 1e 15 staan hier]*' : '')}\n\`\`\`Markdown\n${songs.slice(0,15).join("\n")}\`\`\``)
    );
  }
}
