const command = require("bananenbase").command;
const moment = require("moment");

module.exports = class Moderatie extends command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      description: "Bekijk de gebruikersinfo van iemand!",
      category: "Moderatie",
      subCommands: ["history", "geschiedenis"]
    }, {
      permissions: {
        user: ["MANAGE_MESSAGES"]
      }
    });
  }

  async run(message, args) {
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.error("Gebruiker niet gevonden!");

    let data = await this.client.db.get(`author-${member.id}`);
    if (!data) return message.error("Ik heb geen gegevens gevonden van die gebruiker.");

    if (member.lastMessage === null) member.lastMessage = {createdTimestamp: 0};

    let embed = message.embed()
      .setTitle(`Userinfo van ${member.user.username}`)
      .setDescription(`${data.warns.length} waarschuwing(en), ${data.mutes.length} mute(s), ${data.kicks.length} kick(s) en ${data.bans.length} ban(s).`)
      .addField("**Basis informatie**", `Hoogste rol: **${member.highestRole ? member.highestRole: "Geen"}**\nGejoint op: **${moment(member.joinedAt).format("DD-MM-YYYY [om] HH:mm")}**\nLaatste bericht verstuurd op: **${moment(member.lastMessage.createdTimestamp).format("DD-MM-YYYY [om] HH:mm")}**.`);

    if (data.warns.length > 0) {
      let warns = "";
      data.warns.forEach(warn => {
        warns += `- ${warn.reason} (om ${moment(warn.time).format("DD-MM-YYYY [om] HH:mm")})\n`;
      });
      embed.addField("**Warns**", warns, true);
    }

    if (data.mutes.length > 0) {
      let mutes = "";
      data.mutes.forEach(mute => {
        mutes += `- ${mute.reason} (om ${moment(mute.time).format("DD-MM-YYYY [om] HH:mm")})\n`;
      });
      embed.addField("**Mutes**", mutes, true);
    }

    if (data.kicks.length > 0) {
      let kicks = "";
      data.kicks.forEach(kick => {
        kicks += `- ${kick.reason} (om ${moment(kick.time).format("DD-MM-YYYY [om] HH:mm")})\n`;
      });
      embed.addField("**Kicks**", kicks, true);
    }

    if (data.bans.length > 0) {
      let bans = "";
      data.bans.forEach(ban => {
        bans += `- ${ban.reason} (om ${moment(ban.time).format("DD-MM-YYYY [om] HH:mm")})\n`;
      });
      embed.addField("**Bans**", bans, true);
    }

    message.channel.send(embed);
  }
}
