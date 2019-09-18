const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "Waarschuw iemand!",
      category: "Moderatie",
      subCommands: ["w"]
    }, {
      permissions: {
        user: ["MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error("Gebruiker niet gevonden!");

    let reden = args.slice(1).join(" ");
    if (!reden) return message.error("Reden niet opgegeven!");

    let data = await this.client.db.get(`author-${member.id}`);
    if (!data) return message.error("Ik heb geen gegevens gevonden van die gebruiker.");

    await message.delete();
    let msg = await message.channel.send("Warnen...");

    data.warns.push({
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
      .setTitle("Waarschuwing")
      .setDescription(`<@${member.id}> is gewaarschuwd door <@${message.author.id}> in <#${message.channel.id}>.`)
      .addField("**Reden**", reden)
      .setFooter(`Waarschuwing nummer ${data.warns.length}`)
    );
    try {
      await member.user.send(message.embed()
        .setTitle("Waarschuwing")
        .setDescription(`Je bent gewaarschuwd door <@${message.author.id}>. Reden: **${reden}**`)
        .setFooter(`Waarschuwing number ${data.warns.length}`)
      );
    } catch(e) {}
    await msg.edit("Klaar!");
    msg.delete(5000);
  }
}
