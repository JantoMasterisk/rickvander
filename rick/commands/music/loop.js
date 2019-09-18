const command = require("bananenbase").command;

module.exports = class Music extends command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "Verander de loop!",
      category: "Muziek",
      subCommands: ["nowplaying", "speeltnu"]
    });
  }

  async run(message, args) {
    if (!this.client.queues[message.guild.id] || !this.client.queues[message.guild.id].playing) return message.channel.send(message.embed()
      .setTitle("Loop")
      .setDescription("Er speelt momenteel niets, dus kan je de loop niet aanpassen!")
    );
    if (!message.member.roles.some(r => [message.guild.settings.dj].includes(r.name))) return message.error(`Alleen mensen met de **${message.guild.settings.dj}** role mogen de loop veranderen!`);  
    if (!args[0]) return message.error("Je hebt niet opgegeven waar je de loop naar wilt veranderen. Je kan kiezen uit: `none`, `queue` of `song`.");
    if (args[0].toLowerCase() === "none") {
      this.client.queues[message.guild.id].loop = false;
      message.channel.send(message.embed()
        .setTitle("Loop: Veranderd!")
        .setDescription(`De loop staat nu uit.`)
      );
    } else if (args[0].toLowerCase() === "song") {
      this.client.queues[message.guild.id].loop = "song";
      message.channel.send(message.embed()
        .setTitle("Loop: Veranderd!")
        .setDescription(`De loop staat nu op herhaal het liedje.`)
      );
    } else if (args[0].toLowerCase() === "queue") {
      this.client.queues[message.guild.id].loop = "queue";
      message.channel.send(message.embed()
        .setTitle("Loop: Veranderd!")
        .setDescription(`De loop staat nu op herhaal de wachtrij.`)
      );
    } else message.error("Dat is geen geldige optie.");
  }
}
