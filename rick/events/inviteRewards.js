const event = require("bananenbase").event;
const discord = require("discord.js");
const wait = require("util").promisify(setTimeout);

module.exports = class channelCounters extends event {
  constructor(client) {
    super(client, {
      name: "ready"
    });
  }

  async run() {
    this.client.chechInviteRewards = async (guild) => {
      let invites = {};
      let guildInvites = await guild.fetchInvites();
      guildInvites.forEach(invite => {
        if (!invites[invite.inviter.id]) invites[invite.inviter.id] = invite.uses;
        else invites[invite.inviter.id] += invite.uses;
      });
      for (let i in invites) {
        let data = await this.client.db.set(`author-${i}`);
        if (!data) data = this.client.db.authorSettings;
        if (!data.claimedInvites) data.claimedInvites = {};
        if (!data.claimedInvites.vip && invites[i] >= 10) {
          let role = guild.roles.find(r => r.name === this.client.config.checkInviteRewards.vipRankName);
          if (!role) continue;
          let member = guild.members.find(m => m.id === i);
          if (!member) continue;
          let channel = guild.channels.find(c => c.name === this.client.config.checkInviteRewards.logChannel);
          if (!channel) continue;
          channel.send(new discord.RichEmbed()
            .setTitle("Invite reward!")
            .setColor("#00ff00")
            .setDescription(`**${member.user.username}** heeft 10 invites en heeft daarom de **${role.name}** rank gekregen.`)
          );
          member.addRole(role.id);
          data.claimedInvites.vip = true;
        }
        if (!data.claimedInvites.steamKey && invites[i] >= 25) {
          let channel = guild.channels.find(c => c.name === this.client.config.checkInviteRewards.logChannel);
          if (!channel) continue;
          let msg = await channel.send(new discord.RichEmbed()
            .setTitle("Invite reward - STAFF NODIG!")
            .setColor("#00ff00")
            .setDescription(`**${member.user.username}** heeft 25 invites en heeft daarom moet **${member.user.username}** een steam key krijgen. Stuur de steamkey naar de PM: ${member.user} en druk naarna op :white_check_mark: om dit te markeren als "gedaan".`)
          );
          let toSendSteamKey = await this.client.db.get("toSendSteamKey");
          if (!toSendSteamKey) toSendSteamKey = [];
          toSendSteamKey.push(msg.id);
          await this.client.db.set("toSendSteamKey", toSendSteamKey);
        }
      }
    };
    wait(1000);
    this.client.guilds.forEach(g => {
      try {
        g.fetchInvites().then(guildInvites => {
          this.client.invites[g.id] = guildInvites;
        }).catch(nothing);
      } catch(e) {}
    });
  }
}

function nothing() {
  return;
}
