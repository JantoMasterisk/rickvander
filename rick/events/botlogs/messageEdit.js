const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "messageUpdate"
    });
  }

  async run(old, n) {
    let channel = old.guild.channels.find(c => c.name === this.client.config.logs);
    if (!channel || old.author.id === this.client.user.id) return;
    channel.send(new discord.RichEmbed()
      .setTitle("Message Edit")
      .setColor("#ff0000")
      .setDescription(`Er is een bericht in **${old.channel}** bewerkt door **${old.author.username}**.`)
      .addField("**Eerst**", `\`\`\`${old.content.substring(0, 1000)}\`\`\``)
      .addField("**Nu**", `\`\`\`${n.content.substring(0, 1000)}\`\`\``)
      .setFooter(`MessageID: ${old.id}`)
      .setTimestamp()
    );
  }
}
