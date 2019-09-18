const command = require("bananenbase").command;

module.exports = class Base extends command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Bekijk mijn reactiesnelheid!",
      category: "Main",
      subCommands: ["p"]
    });
  }

  async run(message) {
    this.client.emit("guildMemberAdd", message.member);
    let start = Date.now();
    let msg = await message.channel.send(message.embed()
      .setTitle("🏓...")
    );
    msg.edit(message.embed()
      .setTitle("Ping")
      .setDescription(`:ping_pong: ${Math.floor(Date.now()-start-this.client.ping)}ms\n:blue_heart: ${Math.floor(this.client.ping)}ms`)
    );
  }
}
