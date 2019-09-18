const command = require("bananenbase").command;

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "ban",
      description: "Ban iemand!",
      category: "Moderatie",
      subCommands: ["b"]
    }, {
      permissions: {
        user: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_MESSAGES"]
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

    if (!member.bannable) return message.channel.send("Ik kan diegene niet bannen!");

    await message.delete();

    let m = await message.channel.send(message.embed()
      .setTitle("Bannen")
      .setDescription(`Hoeveel dagen van berichten moeten er worden verwijderd van ${member.user}?\nDruk op een nummer hieronder.`)
    );
    let collector = m.createReactionCollector((reaction, user) => user.id === message.author.id, {time: 60 * 60 * 1000});
    try {
      await m.react("0⃣");
      await m.react("1⃣");
      await m.react("2⃣");
      await m.react("3⃣");
      await m.react("4⃣");
      await m.react("5⃣");
      await m.react("6⃣");
      await m.react("7⃣");
    } catch(e) {}

    collector.on("collect", async (reaction) => {
      let time = 0;
      if (reaction._emoji.name.startsWith("1")) time = 1;
      if (reaction._emoji.name.startsWith("2")) time = 2;
      if (reaction._emoji.name.startsWith("3")) time = 3;
      if (reaction._emoji.name.startsWith("4")) time = 4;
      if (reaction._emoji.name.startsWith("5")) time = 5;
      if (reaction._emoji.name.startsWith("6")) time = 6;
      if (reaction._emoji.name.startsWith("7")) time = 7

      let msg = await message.channel.send("Bannen...");
      await m.delete();

      data.bans.push({
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
        .setTitle("Ban")
        .setDescription(`<@${member.id}> is verbannen door <@${message.author.id}> in <#${message.channel.id}>.`)
        .addField("**Reden**", reden)
        .setColor("#ff0000")
        .setFooter(`Ban nummer ${data.bans.length}`)
      );
      try {
        await member.user.send(message.embed()
          .setTitle("Ban")
          .setDescription(`Je bent verbannen door <@${message.author.id}> in **${message.guild.name}**. Reden: **${reden}**`)
          .setColor("#ff0000")
          .setFooter(`Ban number ${data.ban.length}`)
        );
      } catch(e) {}

      await member.ban({
        reason: `Door ${message.author.username}: ${reden}`,
        days: time
      });

      let channel = message.guild.channels.find(c => c.name === this.client.config.memberLogs);
      if (channel) {
        await channel.send(new discord.RichEmbed()
          .setTitle(`Doei doei, ${message.user.username}`)
          .setColor("#ff0000")
          .setDescription(`${message.user.username} is verbannen.\nEr zijn nog ${member.guild.members.size} members in ${member.guild.name}.`)
          .setThumbnail(member.user.displayAvatarURL)
        );
      }

      await msg.edit("Klaar!");
      msg.delete(5000);
    });
  }
}
