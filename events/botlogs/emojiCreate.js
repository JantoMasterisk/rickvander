const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "emojiCreate"
    });
  }

  async run(emoji) {
    let c = emoji.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await emoji.guild.fetchAuditLogs({type: "EMOJI_CREATE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.target.id === emoji.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = message.author.username;
    }
    c.send(new discord.RichEmbed()
      .setTitle("Emoji Aangemaakt")
      .setColor("#0000ff")
      .setDescription(`Er is een emoji aangemaakt door **${entry.executor.username}**, genaamt \`${emoji.name}\`: ${emoji}`)
      .setFooter(`EmojiID: ${emoji.id}`)
      .setTimestamp()
    );
  }
}
