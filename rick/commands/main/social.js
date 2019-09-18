const command = require("bananenbase").command;

module.exports = class Menu extends command {
  constructor(client) {
    super(client, {
      name: "social",
      description: "Bekijk de social media's!",
      category: "Main"
    });
  }

  async run(message) {
    message.channel.send(`***Sociaal Media***
Discord: <https://discord.gg/FJW8tdV>
Twitter: <https://twitter.com/PlotTwistYT>
YouTube: <https://www.youtube.com/channel/UCtV_MfDTjRSMI3J_c7f75dg>`);
  }
}
