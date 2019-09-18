const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "dj-only",
      description: "Laat alleen de DJ's de bot besturen!",
      category: "Muziek",
      subCommands: ["djonly", "noplayers", "onlydj", "blockplayers", "staffonly"]
    });
  }

  async run(message) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Leave")
      .setDescription("Er speelt momenteel niets, dus je kan de DJ-only modus niet activeren!")
    );
    if (!message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`Alleen mensen met de **${message.guild.settings.dj}** role mogen DJ-Modus activeren!`); 
    if (this.client.queues[message.guild.id].djOnly) {
      this.client.queues[message.guild.id].djOnly = false;
      message.channel.send("DJ-only modus is gedeactiveert! Spelers kunnen de muziekbot weer gebruiken.");
    } else {
      this.client.queues[message.guild.id].djOnly = true;
      message.channel.send("DJ-only modus is geactiveert! Alleen DJ's kunnen de bot nog gebruiken.\nDJ-Modus deactiveren? Gebruik dit commando opnieuw.\nDJ-Only modus wordt ook gedeactiveert als de wachtrij leeg is.");
    }
  }
}
