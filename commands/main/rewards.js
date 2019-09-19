const command = require("bananenbase").command;

module.exports = class Menu extends command {
  constructor(client) {
    super(client, {
      name: "rewards",
      description: "Bekijk de rewards!",
      category: "Main"
    });
  }

  async run(message) {
    message.channel.send(`***Rewards***
Je wordt beloond door mensen te inviten!
Dit wordt gecontroleerd met de invite manager bot!
\`\`\`
10 leden  is custom rankje "VIP"
25 leden is Random Steam key\`\`\``);
  }
}
