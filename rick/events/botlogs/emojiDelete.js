const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "emojiDelete"
    });
  }

  async run(emoji) {
    let c = emoji.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await emoji.guild.fetchAuditLogs({type: "EMOJI_DELETE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.id === emoji.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = "?";
    }
    c.send(new discord.RichEmbed()
      .setTitle("Emoji Verwijderd")
      .setColor("#0000ff")
      .setDescription(`De emoji **${emoji.name}** is verwijderd door **${entry.executor.username}**.`)
      .setFooter(`EmojiID: ${emoji.id}`)
      .setTimestamp()
    );
  }
}
