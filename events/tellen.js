const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Tellen extends event {
  constructor(client) {
    super(client, {
      name: "message"
    });
  }

  async run(message) {
    if (!message.guild) return;
    if (!message.channel.name.includes("tellen")) return;
    let data = await this.client.db.get(`channel-${message.channel.id}`);
    if (!data) data = {};
    if (!data.tellen) data.tellen = {
      lastUser: 0,
      at: 1
    };
    if (isNaN(Number(message.content))) return message.delete();
    if (data.tellen.lastUser === message.author.id) return message.delete();
    if (Number(message.content) !== data.tellen.at) return message.delete();
    data.tellen = {
      lastUser: message.author.id,
      at: Number(message.content) + 1
    };
    await this.client.db.set(`channel-${message.channel.id}`, data);
  }
}