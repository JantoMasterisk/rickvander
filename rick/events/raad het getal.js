const event = require("bananenbase").event;
const discord = require("discord.js");

module.exports = class Spellen extends event {
  constructor(client) {
    super(client, {
      name: "message"
    });
  }

  async run(message) {
    if (!message.guild) return;
    if (!message.channel.name.toLowerCase().includes("hoger-of-lager") && !message.channel.name.toLowerCase().includes("raad-het-getal")) return;
    let data = await this.client.db.get(`channel-${message.channel.id}`);
    if (!data) data = {};
    if (!data.raadHetGetal) data.raadHetGetal = {
      number: 0,
      lastGuess: 0
    };
    if (isNaN(Number(message.content))) return;
    if (data.raadHetGetal.lastGuess === message.author.id) return message.delete();
    if (data.raadHetGetal.number === Number(message.content)) {
      message.react("✅");
      message.channel.send(`Gefeliciteerd, ${message.author}! Het getal is \`${data.raadHetGetal.number}\`!`);
      data.raadHetGetal.number = 0;
    }
    if (data.raadHetGetal.number === 0) {
      data.raadHetGetal.number = Math.floor(Math.random() * 10000);
      await this.client.db.set(`channel-${message.channel.id}`, data);
      return message.channel.send(`**Raad het getal**\nEr is een nieuw getal, veel succes met raden!`);
    }
    if (Number(message.content) > data.raadHetGetal.number) message.react("⬇"); // Getal is lager
    else message.react("⬆"); // Getal is hoger
    data.raadHetGetal.lastGuess = message.author.id;
    await this.client.db.set(`channel-${message.channel.id}`, data);
  }
}
