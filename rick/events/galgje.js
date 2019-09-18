const event = require("bananenbase").event;
const discord = require("discord.js");
const fs = require("fs");

module.exports = class Galgje extends event {
  constructor(client) {
    super(client, {
      name: "message"
    });
  }

  async run(message) {
    if (!message.guild) return;
    if (!message.channel.name.includes("galgje")) return;
    let data = await this.client.db.get(`channel-${message.channel.id}`);
    if (!data) data = {};
    if (!data.galgje) data.galgje = {
      woord: "",
      falseGuesses: 0,
      goodGuesses: [],
      last: 0
    };
    if (!data.galgje.last) data.galgje.last = 0;
    if (data.galgje.last === message.author.id) return message.delete();
    if (data.galgje.woord === "") {
      if (this.client.gettingWord) return;
      data.galgje = {
        woord: "",
        falseGuesses: 0,
        goodGuesses: []
      };
      this.client.gettingWord = true;
      let file = fs.readFileSync(`${process.cwd()}/woorden.txt`).toString("utf8").split(/\r?\n/).sort();
      let acceptedWords = [];
      file.forEach(word => {
        if (word.length >= 3 && word.length <= 10) {
          let valid = true;
          word.split("").forEach(w => {
            if (!"qwertyuiopasdfghjklzxcvbnm".split("").includes(w)) valid = false;
          });
          if (valid) acceptedWords.push(word);
        }
      });
      let word = acceptedWords[Math.floor(Math.random() * acceptedWords.length)];
      data.galgje.woord = word;
      let streepjes = "";
      word.split("").forEach(w => {
        streepjes += "-";
      });
      await this.client.db.set(`channel-${message.channel.id}`, data);
      let msg = await message.channel.send(`**Galgje!**\n\nWoord: ${streepjes} (${streepjes.length} letters)\nFouten: ${data.galgje.falseGuesses}/15`);
      data.galgje.msg = msg.id;
      await this.client.db.set(`channel-${message.channel.id}`, data);
      this.client.gettingWord = false;
    } else {
      if (message.author.id === this.client.user.id) return;
      console.log(data.galgje.woord);
      let noReturn = false;
      if (message.content.toLowerCase() === data.galgje.woord.toLowerCase()) {
        message.channel.send(`Gefeliciteerd, ${message.author}! Je hebt het woord geraden, want het woord was \`${data.galgje.woord}\`!`);
        data.galgje.woord = "";
        await this.client.db.set(`channel-${message.channel.id}`, data);
        message.react("👍");
      } else {
        let noReactRole = message.guild.roles.find(r => r.name === this.client.config.noAutoMod);
        if (!noReactRole) noReactRole = {
          id: 0
        }
        if (message.member.roles.has(noReactRole.id)) noReturn = true;
      }
      if (message.content.length !== 1 && !noReturn) return;
      if (data.galgje.last === message.author.id && !noReturn) return message.delete();
      data.galgje.last = message.author.id;
      message.content = message.content.toLowerCase();
      if (data.galgje.woord.includes(message.content)) {
        data.galgje.goodGuesses.push(message.content);
        message.react("👍");
      } else {
        data.galgje.falseGuesses++;
        message.react("👎");

        if (data.galgje.falseGuesses === 15) {
          message.channel.send(`**GEWONNEN!**\nIk heb gewonnen, er is 15 keer fout geraden!\nHet woord was: \`${data.galgje.woord}\`.`);
          data.galgje.woord = "";
          await this.client.db.set(`channel-${message.channel.id}`, data);
        }
      }
      let tmpWoord = data.galgje.woord;
      "qwertyuiopasdfghjklzxcvbnm".split("").forEach(l => {
        if (!data.galgje.goodGuesses.includes(l)) tmpWoord = replaceAll(tmpWoord, l, "-");
      });
      let msg = await message.channel.fetchMessage(data.galgje.msg);
      await msg.edit(`**Galgje!**\n\nWoord: ${tmpWoord} (${tmpWoord.length} letters)\nFouten: ${data.galgje.falseGuesses}/15`);
      await this.client.db.set(`channel-${message.channel.id}`, data);
    }
  }
}

let replaceAll = (s, a, b) => {
  s = s.replace(a, b);
  if (s.includes(a)) return replaceAll(s, a, b);
  else return s;
};