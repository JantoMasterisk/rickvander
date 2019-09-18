const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class channelCounters extends event {
  constructor(client) {
    super(client, {
      name: "ready"
    });
  }

  async run() {
    this.client.updateCounters = async (guild) => {
      let channels = await this.client.db.get("countChannels");
      if (!channels) channels = {};
      let memberChannel;
      let botChannel;
      let totalChannel;
      let members = 0;
      let bots = 0;
      guild.members.forEach(member => {
        if (member.user.bot) bots++;
        else members++;
      });
      if (!channels.members) {
        memberChannel = await guild.createChannel(`Leden: ${members}`, "voice");
        memberChannel.overwritePermissions(guild.id, {
          CONNECT: false
        })
        channels.members = memberChannel.id;
      }
      if (!channels.bots) {
        botChannel = await guild.createChannel(`Bots: ${bots}`, "voice");
        botChannel.overwritePermissions(guild.id, {
          CONNECT: false
        })
        channels.bots = botChannel.id;
      }
      if (!channels.total) {
        totalChannel = await guild.createChannel(`Totaal: ${guild.members.size}`, "voice");
        totalChannel.overwritePermissions(guild.id, {
          CONNECT: false
        })
        channels.total = totalChannel.id;
      }
      if (!memberChannel) {
        memberChannel = await guild.channels.find(c => c.type === "voice" && c.id === channels.members);
        memberChannel.edit({name: `Leden: ${members}`});
      }
      if (!botChannel) {
        botChannel = await guild.channels.find(c => c.type === "voice" && c.id === channels.bots);
        botChannel.edit({name: `Bots: ${bots}`});
      }
      if (!totalChannel) {
        totalChannel = await guild.channels.find(c => c.type === "voice" && c.id === channels.total);
        totalChannel.edit({name: `Totaal: ${guild.members.size}`});
      }
      await this.client.db.set("countChannels", channels);
    };
  }
}
