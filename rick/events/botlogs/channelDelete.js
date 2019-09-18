const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "channelDelete"
    });
  }

  async run(channel) {
    let c = channel.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.id === channel.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = "?";
    }
    c.send(new discord.RichEmbed()
      .setTitle("Kanaal Verwijderd")
      .setColor("#00ff00")
      .setDescription(`Het kanaal \`${channel.name}\` is verwijderd door **${entry.executor.username}**.`)
      .setFooter(`ChannelID: ${channel.id}`)
      .setTimestamp()
    );
  }
}
