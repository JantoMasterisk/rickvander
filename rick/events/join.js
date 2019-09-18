const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class JoinLeave extends event {
  constructor(client) {
    super(client, {
      name: "guildMemberAdd"
    });
  }

  async run(member) {
    this.client.updateCounters(member.guild);
    this.client.chechInviteRewards(member.guild);
    let channel = member.guild.channels.find(c => c.name === this.client.config.join);
    if (channel) {
      channel.send(new discord.RichEmbed()
        .setTitle(`Welkom, ${member.user.username}`)
        .setColor("#00ff00")
        .setDescription(`Veel plezier in **${member.guild.name}**.\nEr zijn ${member.guild.members.size} members!`)
        .setThumbnail(member.user.displayAvatarURL)
      );
    }
  }
}
