const BananenBase = require("bananenbase");
const discord = require("discord.js");
const moment = require("moment");

// Muziek packages checken
require("ffmpeg-binaries");
require("ffmpeg");
require("ytdl-core");
require("opusscript");

new BananenBase({
  token: "TOKEN",
  keepTrackOfDatabase: true,
  database: {
    package: "keyv",
    name: "storage.json",
    type: "sqlite",
    code: `${process.cwd()}/database.sqlite`
  },
  permissionLevels: [
    (client, message, args) => { // Permission level 0
      return true;
    }, (client, message, args) => { // Permission level 1
      if (message.member.roles.some(r => ["Moderator", "mod", "Mod", "Team PlotTwist", "Admin"].includes(r.name)) || ["142368754968297473", "184030800788848640", "233729682372165632", "327462385361092621"].includes(message.author.id)) return true;
      return false;
    }, (client, message, args) => { // Permission level 2
      if (client.config.botOwners.includes(message.author.id)) return true; // A bot owner
      else return false; // No bot owner
    }
  ],
  ignore: {
    pm: true
  },
  botConfig: {
    youtubeToken: "YOUTUBE_TOKEN",
    ytapiToken: "YOUTUBE_TOKEN",

    youtubeTrackingChannelName: "CHANNELNAAM",
    youtubeNotifyChannel: "CHANNELNAAM",
    modlogs: "CHANNELNAAM",
    join: "CHANNELNAAM",
    leave: "CHANNELNAAM",
    logs: "CHANNELNAAM",
    noAutoMod: "ROLNAAM",
    autoModLogs: "CHANNELNAAM",
    swearWords: ["gdv", "godverdomme", "fack", "tering", "kut", "idioot", "kak", "lafaard", "oen", "lul", "eikel"],
    authorSettings: {
      warns: [],
      mutes: [],
      kicks: [],
      bans: []
    },
    guildSettings: {
      embed: {
        color: "#34363c",
        footerText: "Commands",
        time: true
      },
      dj: "ROLNAAM",	
      prefix: "."
    }
  },
  language: "NL",

  bot: async (client) => {
  	client.queues = {};
    
    if (!await client.db.get("mutedUsers")) await client.db.set("mutedUsers", []);
    if (!await client.db.get("tempbans")) await client.db.set("tempbans", []);
    setInterval(async () => {
      // Checking mutes
      let mutedUsers = await client.db.get("mutedUsers");
      let newMutedUsers = [];
      mutedUsers.forEach(user => {
        if (user.unmuteDate < Date.now()) {
          let guild = client.guilds.find(g => g.id === user.guild);
          let member = guild.members.find(m => m.id === user.user);
          if (!member) return;
          let muteRole = guild.roles.find(r => r.name === "muted");
          try {
            member.removeRole(muteRole.id);
            member.user.send("De mute is om! Je kan weer chatten!");
          } catch(e) {}
        } else newMutedUsers.push(user);
      });
      await client.db.set("mutedUsers", newMutedUsers);

      let bannedUsers = await client.db.get("tempbans");
      let newBannedUsers = [];
      bannedUsers.forEach(async (user) => {
        if (user.unbanDate < Date.now()) {
          let guild = client.guilds.find(g => g.id === user.guild);
          try {
            await guild.unban(user.user);
          } catch(e) {}
        } else newBannedUsers.push(user);
      });
      await client.db.set("tempbans", newBannedUsers);
    }, 10000);
  }
});
