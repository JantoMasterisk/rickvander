const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "leave",
      description: "Laat mij leaven!",
      category: "Muziek",
      subCommands: ["le"]
    });
  }

  async run(message, args) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Leave")
      .setDescription("Er speelt momenteel niets, dus kan ik niet leaven!")
    );
    if (!message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`Alleen mensen met de **${message.guild.settings.dj}** role mogen de bot laten leaven!`); 
    this.client.queues[message.guild.id].voiceChannel.connection.disconnect();
    this.client.queues[message.guild.id] = {playing: false};
    message.channel.send(message.embed()
      .setTitle("Leave")
      .setDescription("Ik ben gestopt met muziek afspelen en ik ben de voicechannel geleavt!")
    );
  }
}
