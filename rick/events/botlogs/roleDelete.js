const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "roleDelete"
    });
  }

  async run(role) {
    let c = role.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await role.guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(audit => audit.entries.first());
    let user = "";
    if (entry.target.id === role.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = message.author.username;
    }
    c.send(new discord.RichEmbed()
      .setTitle("Role Verwijderd")
      .setColor("#ffff00")
      .setDescription(`Rol \`${role.name}\` is verwijderd door **${entry.executor.username}**`)
      .setFooter(`RoleID: ${role.id}`)
      .setTimestamp()
    );
  }
}
