const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "emojiUpdate"
    });
  }

  async run(emoji, newEmoji) {
    let c = emoji.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await emoji.guild.fetchAuditLogs({type: "EMOJI_UPDATE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.target.id === emoji.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = "?";
    }
    c.send(new discord.RichEmbed()
      .setTitle("Emoji Veranderd")
      .setColor("#0000ff")
      .setDescription(`De naam van de emoji emoji ${newEmoji} is aangepast door **${entry.executor.username}**.\nDe naam was eerst: \`\`\`${emoji.name}\`\`\`De naam is nu: \`\`\`${newEmoji.name}\`\`\``)
      .setFooter(`EmojiID: ${emoji.id}`)
      .setTimestamp()
    );
  }
}
