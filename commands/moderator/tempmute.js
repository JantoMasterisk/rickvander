const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "tempmute",
      description: "Mute iemand tijdelijk!",
      category: "Moderatie",
      subCommands: ["tm"]
    }, {
      permissions: {
        user: ["MANAGE_GUILD", "MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error("Gebruiker niet gevonden!");

    if (!args[1]) return message.error("Geen tijd opgegeven voor mute. Formaat: uren");
    if (isNaN(Number(args[1]))) return message.error(`Tijd niet geldig: Geef het aantal uren voor de mute op.\nVoorbeeld: \`${message.guild.settings.prefix}tempmute ${args[0]} 10 <reden>\` - Dit geef een ban van 10 uur.`);
    let time = Number(args[1]);

    let reden = args.slice(2).join(" ");
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

    let mutedUsers = await this.client.db.get("mutedUsers");
    mutedUsers.push({
      user: member.id,
      unmuteDate: Date.now() + 1000*60*60*time,
      guild: message.guild.id
    });
    await this.client.db.set("mutedUsers", mutedUsers);

    await message.guild.channels.find(c => c.name === this.client.config.modlogs).send(message.embed()
      .setTitle("Mute")
      .setDescription(`<@${member.id}> is getempmute door <@${message.author.id}> in <#${message.channel.id}>.`)
      .setColor("#0000ff")
      .addField("**Reden**", reden)
      .addField("**Tijd**", `${time} uur.`)
      .setFooter(`Mute nummer ${data.mutes.length}`)
    );
    try {
      await member.user.send(message.embed()
        .setTitle("Gemute")
        .setDescription(`Je bent getempmute door <@${message.author.id}>. Reden: **${reden}**`)
        .addField("**Tijd**", `Je kan weer chatten over ${time} uur.`)
        .setFooter(`Mute number ${data.mutes.length}`)
      );
    } catch(e) {}
    await msg.edit("Klaar!");
    msg.delete(5000);

  }
}
