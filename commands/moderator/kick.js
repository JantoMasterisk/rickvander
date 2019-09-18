const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Kick iemand!",
      category: "Moderatie",
      subCommands: ["k"]
    }, {
      permissions: {
        user: ["KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error("Gebruiker niet gevonden!");

    let reden = args.slice(1).join(" ");
    if (!reden) return message.error("Reden niet opgegeven!");

    if (!member.kickable) return message.channel.send("Ik kan diegene niet kicken!");

    let data = await this.client.db.get(`author-${member.id}`);
    if (!data) return message.error("Ik heb geen gegevens gevonden van die gebruiker.");

    await message.delete();
    let msg = await message.channel.send("Kicken...");

    data.kicks.push({
      author: {
        id: message.author.id,
        username: message.author.username,
        tag: message.author.tag
      },
      reason: reden,
      channel: {
        id: message.channel.id,
        name: message.channel.name,
        topic: message.channel.topic
      },
      time: Date.now()
    });
    await this.client.db.set(`author-${member.id}`, data);

    await message.guild.channels.find(c => c.name === this.client.config.modlogs).send(message.embed()
      .setTitle("Kick")
      .setDescription(`<@${member.id}> is gekickt door <@${message.author.id}> in <#${message.channel.id}>.`)
      .addField("**Reden**", reden)
      .setColor("#ffa500")
      .setFooter(`Kick nummer ${data.kicks.length}`)
    );
    try {
      await member.user.send(message.embed()
        .setTitle("Kick")
        .setDescription(`Je bent gekickt door <@${message.author.id}> in **${message.guild.name}**. Reden: **${reden}**`)
        .setFooter(`Kick number ${data.kicks.length}`)
        .setColor("#ffa500")
      );
    } catch(e) {}

    await member.kick(`Door ${message.author.username}: ${reden}`);

    await msg.edit("Klaar!");
    msg.delete(5000);
  }
}
