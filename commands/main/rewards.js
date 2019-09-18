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
Je wordt beloond door mensen geinvited worden.
dit wordt gecotreleerd met een bot en de mensen moeten nog in deze dc zitten dus niet geleaved zijn.
\`\`\`
10 leden  is custom rankje "VIP"
25 leden is Random Steam key\`\`\``);
  }
}
