const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Mute iemand!",
      category: "Moderatie",
      subCommands: ["m"]
    }, {
      permissions: {
        user: ["MANAGE_GUILD", "MANAGE_MESSAGES"]
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
    let msg = await message.channel.send("Muten...");

    data.mutes.push({
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

    let muterole = message.guild.roles.find(r => r.name === "muted");
    if (!muterole || muterole === undefined) {
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#d3d3d3",
        permissions: []
      });
    }
    message.guild.channels.forEach((channel) => {
      channel.overwritePermissions(muterole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      });
    });
    member.addRole(muterole.id);

    await message.guild.channels.find(c => c.name === this.client.config.modlogs).send(message.embed()
      .setTitle("Mute")
      .setDescription(`<@${member.id}> is gemute door <@${message.author.id}> in <#${message.channel.id}>.`)
      .setColor("#0000ff")
      .addField("**Reden**", reden)
      .setFooter(`Mute nummer ${data.mutes.length}`)
    );
    try {
      await member.user.send(message.embed()
        .setTitle("Gemute")
        .setDescription(`Je bent gemute door <@${message.author.id}>. Reden: **${reden}**`)
        .setFooter(`Mute number ${data.mutes.length} - Je wordt in een dag weer geunmute!`)
      );
    } catch(e) {}
    await msg.edit("Klaar!");
    msg.delete(5000);

  }
}
