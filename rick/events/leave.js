const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class JoinLeave extends event {
  constructor(client) {
    super(client, {
      name: "guildMemberRemove"
    });
  }

  async run(member) {
    this.client.updateCounters(member.guild);
    let channel = member.guild.channels.find(c => c.name === this.client.config.leave);
    if (channel) {
      channel.send(new discord.RichEmbed()
        .setTitle(`Doei doei, ${member.user.username}`)
        .setColor("#ff0000")
        .setDescription(`Hoppelijk zien we je snel terug!\nEr zijn nog ${member.guild.members.size} members in ${member.guild.name}.`)
        .setThumbnail(member.user.displayAvatarURL)
      );
    }
  }
}
