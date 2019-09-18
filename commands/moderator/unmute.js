const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Unmute iemand!",
      category: "Moderatie",
      subCommands: ["um"]
    }, {
      permissions: {
        user: ["MANAGE_GUILD", "MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error("Gebruiker niet gevonden!");
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
    if (!member.roles.has(muterole.id)) return message.error("Die gebruiker is niet gemute!");

    let mutedUsers = await this.client.db.get("mutedUsers");
    let n = [];
    mutedUsers.forEach(user => {
      if (user.user !== member.id) n.push(user);
    });
    await this.client.db.set("mutedUsers", mutedUsers);
    member.removeRole(muterole.id);

    await message.guild.channels.find(c => c.name === this.client.config.modlogs).send(message.embed()
      .setTitle("Unmute!")
      .setDescription(`<@${message.author.id}> heeft <@${member.id}> in <#${message.channel.id}> geunmute!`)
      .setColor("#00ff00")
    );
    try {
      await member.user.send(message.embed()
        .setTitle("Unmute!")
        .setDescription(`<@${message.author.id}> heeft je geunmute!`)
        .setColor("#00ff00")
      );
    } catch(e) {}

    message.delete();
    message.channel.send("Die gebruiker is geunmute!").then(m => m.delete(5000));
  }
}
