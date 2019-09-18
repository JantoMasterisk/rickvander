const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class AutoMod extends event {
  constructor(client) {
    super(client, {
      name: "message"
    });
  }

  async run(message) {
    if (message.author.bot) return;
    let role = message.guild.roles.find(role => role.name === this.client.config.noAutoMod);
    if (role && message.member.roles.has(role.id)) return;
    if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content.toLowerCase())) {
      await message.delete();
      let msg = await message.reply("je mag geen links sturen!");
      msg.delete(5000);
      let channel = message.guild.channels.find(channel => channel.name === this.client.config.autoModLogs);
      if (channel) channel.send(new discord.RichEmbed()
        .setTitle("Auto mod")
        .setColor("#ff0000")
        .setDescription(`AutoMod heeft een link gedetecteerd in een bericht van **<@${message.author.id}>**!`)
        .addField("**Content**", `Dit stond er in het bericht: \`\`\`${message.content.substr(0, 750) +  "\u2026"}\`\`\``)
        .setFooter(`Message ID: ${message.id}`)
        .setTimestamp()
      );
      return;
    }

    let caps = message.content.split("");
    let counted = {
      high: 0,
      low: 0
    };
    caps.forEach(l => {
      if ("QWERTYUIOPASDFGHJKLZXCVBNM".split("").includes(l)) counted.high++;
      else counted.low++;
    });
    if (counted.high > counted.low) {
      await message.delete();
      let msg = await message.reply("in je bericht zit te veel caps!");
      msg.delete(5000);
      let channel = message.guild.channels.find(channel => channel.name === this.client.config.autoModLogs);
      if (channel) channel.send(new discord.RichEmbed()
        .setTitle("Auto mod")
        .setColor("#ff0000")
        .setDescription(`AutoMod heeft gedetecteerd dat een bericht van **<@${message.author.id}>** voor meer dan 50% uit caps bestaat!`)
        .addField("**Content**", `Dit stond er in het bericht: \`\`\`${message.content.substr(0, 750) +  "\u2026"}\`\`\``)
        .setFooter(`Message ID: ${message.id}`)
        .setTimestamp()
      );
      return;
    }

    let valid = false;
    message.content.split(" ").forEach(w => {
      if (this.client.config.swearWords.includes(w.toLowerCase())) valid = true;
    });
    if (valid) {
      await message.delete();
      let msg = await message.reply("niet schelden!");
      msg.delete(5000);
      let channel = message.guild.channels.find(channel => channel.name === this.client.config.autoModLogs);
      if (channel) channel.send(new discord.RichEmbed()
        .setTitle("Auto mod")
        .setColor("#ff0000")
        .setDescription(`AutoMod heeft een scheldwoord gedetecteerd in een bericht van **<@${message.author.id}>**!`)
        .addField("**Content**", `Dit stond er in het bericht: \`\`\`${message.content.substr(0, 750) +  "\u2026"}\`\`\``)
        .setFooter(`Message ID: ${message.id}`)
        .setTimestamp()
      );
      return;
    }
  }
}
