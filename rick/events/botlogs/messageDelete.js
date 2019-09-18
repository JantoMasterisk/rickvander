const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "messageDelete"
    });
  }

  async run(message) {
    let channel = message.guild.channels.find(c => c.name === this.client.config.logs);
    if (!channel || message.author.id === this.client.user.id) return;
    const entry = await message.guild.fetchAuditLogs({type: "MESSAGE_DELETE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.extra.channel.id === message.channel.id
     && (entry.target.id === message.author.id)
     && (entry.createdTimestamp > (Date.now() - 5000))
     && (entry.extra.count >= 1)) {
      user = entry.executor.username;
    } else {
      user = message.author.username;
    }
    channel.send(new discord.RichEmbed()
      .setTitle("Message Delete")
      .setColor("#ff0000")
      .setDescription(`Er is een bericht in **${message.channel}** delete door **${user}**.\n**Content:** \`\`\`${message.content.substring(0, 1500)}\`\`\``)
      .setFooter(`MessageID: ${message.id}`)
      .setTimestamp()
    );
  }
}
