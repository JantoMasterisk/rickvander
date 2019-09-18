const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "roleCreate"
    });
  }

  async run(role) {
    let c = role.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await role.guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.target.id === role.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = message.author.username;
    }
    c.send(new discord.RichEmbed()
      .setTitle("Role Aangemaakt")
      .setColor("#ffff00")
      .setDescription(`Er is een role aangemaakt door **${entry.executor.username}**, genaamt \`${role.name}\``)
      .setFooter(`RoleID: ${role.id}`)
      .setTimestamp()
    );
  }
}
