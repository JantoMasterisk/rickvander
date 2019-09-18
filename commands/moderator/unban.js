const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "unban",
      description: "Unban iemand!",
      category: "Moderatie",
      subCommands: ["b"]
    }, {
      permissions: {
        user: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    if (!args[0]) return message.error("Geen UserID gevonden om te unbannen!");
    try {
      await message.guild.unban(args[0]);
    } catch(e) {
      return message.error("Gebruiker niet gevonden!");
    }

    await message.guild.channels.find(c => c.name === this.client.config.modlogs).send(message.embed()
      .setTitle("Unban!")
      .setDescription(`<@${message.author.id}> heeft een gebruiker met de id **${args[0]}** in <#${message.channel.id}> geunbaned!`)
      .setColor("#00ff00")
    );

    message.delete();
    message.channel.send("Gebruiker geunbaned!").then(m => m.delete(5000));
  }
}
