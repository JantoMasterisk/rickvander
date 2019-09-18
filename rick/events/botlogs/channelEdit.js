const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Logs extends event {
  constructor(client) {
    super(client, {
      name: "channelUpdate"
    });
  }

  async run(old, n) {
    if (!old || !old.id) return;
    let c = old.guild.channels.find(c => c.name === this.client.config.logs);
    if (!c) return;
    const entry = await old.guild.fetchAuditLogs({type: "CHANNEL_UPDATE"}).then(audit => audit.entries.first());
    let user = "";
    if (!entry.target) return;
    if (entry.target.id === old.id
     && (entry.createdTimestamp > (Date.now() - 5000))) {
      user = entry.executor.username;
    } else {
      user = "???";
    }
    let changed = [];
    if (old.name !== n.name) changed.push({
      thing: "**Naam**",
      was: old.name,
      nu: n.name
    });
    if (old.position !== n.position) changed.push({
      thing: "**Positie**",
      noInformation: true
    });
    if (old.parentID !== n.parentID) changed.push({
      thing: "**Categorie**",
      was: old.guild.channels.find(c => c.id === old.parentID).name,
      nu: n.guild.channels.find(c => c.id === n.parentID).name
    });
    if (old.permissionOverwrites !== n.permissionOverwrites) changed.push({
      thing: "**Permissies**",
      noInformation: true
    });
    if (old.topic !== n.topic) changed.push({
      thing: "**Beschrijving**",
      was: old.topic || "Geen topic",
      nu: n.topic
    });
    if (old.nsfw !== n.nswf) {
      if (n.nswf) changed.push({
        thing: "**NSWF**",
        custom: "De channel is nu een NSWF channel."
      });
      else changed.push({
        thing: "**NSWF**",
        custom: "De channel is nu geen NSWF channel meer."
      })
    }
    if (old.rateLimitPerUser !== n.rateLimitPerUser) changed.push({
      thing: "**Rate limiet**",
      was: `${old.rateLimitPerUser/1000/60} minuten`,
      nu: `${n.rateLimitPerUser/1000/60} minuten`
    });
    if (changed.length === 0) return;

    let embed = new discord.RichEmbed()
      .setTitle("Kanaal Bewerkt")
      .setColor("#00ff00")
      .setDescription(`Het kanaal **${n.name}** is bewerkt door **${entry.executor.username}**. Bekijk alle aanpassingen hieronder.`)
      .setFooter(`ChannelID: ${n.id}`)
      .setTimestamp();
    changed.forEach(thing => {
      if (thing.custom) embed.addField(thing.thing, thing.custom, true);
      else if (thing.noInformation) embed.addField(thing.thing, `Geen information verder.`, true);
      else embed.addField(thing.thing, `Dit was: \`\`\`${thing.was.substring(0, 450)}\`\`\`\nIs nu: \`\`\`${thing.nu.substring(0, 450)}\`\`\``, true);
    });
    c.send(embed);
  }
}
