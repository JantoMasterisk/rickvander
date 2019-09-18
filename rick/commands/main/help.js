const command = require("bananenbase").command;

module.exports = class Base extends command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Krijg hulp met de commands!",
      category: "Main",
      subCommands: ["h", "?", "he"],
      args: ["Category or command: optional"]
    });
  }

  async run(message, args) {
    if (!args[0]) {
      let cmd = {data: {}, names: []};
      await this.client.commands.forEach(async (command) => {
        if (command.enabled) {
          let result = await command.check(args, message, this.client);
          if (result) {
            let usage = `**${message.guild.settings.prefix}${command.help.name}**`;
            if (!command.help.category) command.help.category = "No category";
            if (!cmd.data[command.help.category]) {
              cmd.data[command.help.category] = `${usage}\n`;
              cmd.names.push(command.help.category);
            } else cmd.data[command.help.category] += `${usage}\n`;
          }
        }
      });
      let total = [];
      this.client.commands.forEach(command => {
        if (!total.includes(command.help.category)) total.push(command.help.category);
      })
      let embed = message.embed()
        .setTitle("Help")
        .setDescription("Every command is listed below.");
      let interval = setInterval(() => {
        if (total.length === cmd.names.length) {
          clearInterval(interval);
          cmd.names.forEach(category => {
            embed.addField(`__**${category}**__`, cmd.data[category], true);
          });
          message.channel.send(embed);
        }
      });
    } else {
      let categories = [];
      this.client.commands.forEach(async (command) => {
        if (command.enabled) {
          let result = await command.check(args, message, this.client);
          if (result) {
            if (!categories.includes(command.help.category.toLowerCase())) categories.push(command.help.category.toLowerCase());
          }
        }
      });
      let total = [];
      this.client.commands.forEach(command => {
        if (!total.includes(command.help.category)) total.push(command.help.category);
      });
      let interval = setInterval(() => {
        if (total.length === categories.length) {
          clearInterval(interval);
          if (categories.includes(args.join(" ").toLowerCase())) {
            let commands = "";
            let t = [];
            this.client.commands.forEach(async (command) => {
              if (!command.enabled) return;
              let result = await command.check(args, message, this.client);
              if (!result) return;
              if (command.help.category.toLowerCase() !== args.join(" ").toLowerCase()) return;
              commands += `\`${message.guild.settings.prefix}${command.help.name}`;
              if (command.help.args) {
                command.help.args.forEach(arg => {
                  let type = arg.split(": ")[1];
                  if (type === "required") commands += ` <${arg.split(":")[0]}>`;
                  else if (type === "optional") commands += ` [${arg.split(":")[0]}]`;
                });
              }
              commands += `\` - **${command.help.description.replace("%PREFIX%", message.guild.settings.prefix)}**\n`;
              t.push(command.help.name);
            });
            total = [];
            this.client.commands.forEach(command => {
              if (!total.includes(command.help.name) && command.help.category.toLowerCase() === args.join(" ").toLowerCase()) total.push(command.help.name);
            });
            interval = setInterval(() => {
              if (total.length === t.length) {
                clearInterval(interval);
                message.channel.send(message.embed()
                  .setTitle(`Help: ${args[0].toLowerCase()}`)
                  .setDescription(`Everything with **<>** is required.\nEverything with **[]** is optional.\n\n${commands}`)
                );
              }
            });
          } else {
            let done = false;
            let t = 0;
            this.client.commands.forEach(async (command) => {
              if (!command.enabled) return t++;
              let result = await command.check(args, message, this.client);
              if (!result) return t++;
              if (command.help.name.toLowerCase() !== args[0].toLowerCase()) return t++;
              done = true;
              t++;
              let usage = message.guild.settings.prefix + command.help.name;
              if (command.help.args) {
                command.help.args.forEach(arg => {
                  let type = arg.split(": ")[1];
                  if (type === "required") usage += ` <${arg.split(":")[0]}>`;
                  else if (type === "optional") usage += ` [${arg.split(":")[0]}]`;
                });
              }
              let subCommands;
              if (command.help.subCommands.length > 0) {
                subCommands = `**Subcommands (${command.help.subCommands.length}):**\n`;
                command.help.subCommands.forEach(subCommand => {
                  subCommands += ` - **${subCommand}**\n`;
                });
              } else subCommands = "Not subcommands!";
              message.channel.send(message.embed()
                .setTitle(`Help: ${args[0].toLowerCase()}`)
                .setDescription(`**Name:** ${command.help.name}\n**Description:** ${command.help.description.replace("%PREFIX%", message.guild.settings.prefix)}\n**Category:** ${command.help.category}\n**Usage:** \`${usage}\`\n${subCommands}`)
              );
            });
            interval = setInterval(() => {
              if (this.client.commands.size === t) {
                clearInterval(interval);
                if (!done) return message.reply("command/category not found!");
              }
            });
          }
        }
      });
    }
  }

  async runInPM(message, args) {
    if (!args[0]) {
      let cmd = {data: {}, names: []};
      await this.client.commands.forEach(async (command) => {
        if (command.enabled) {
          let result = await command.check(args, message, this.client);
          if (result) {
            let usage = `**${command.help.name}**`;
            if (!command.help.category) command.help.category = "No category";
            if (!cmd.data[command.help.category]) {
              cmd.data[command.help.category] = `${usage}\n`;
              cmd.names.push(command.help.category);
            } else cmd.data[command.help.category] += `${usage}\n`;
          }
        }
      });
      let total = [];
      this.client.commands.forEach(command => {
        if (!total.includes(command.help.category)) total.push(command.help.category);
      })
      let embed = message.embed()
        .setTitle("Help")
        .setDescription("Every command is listed below.");
      let interval = setInterval(() => {
        if (total.length === cmd.names.length) {
          clearInterval(interval);
          cmd.names.forEach(category => {
            embed.addField(`__**${category}**__`, cmd.data[category], true);
          });
          message.channel.send(embed);
        }
      });
    } else {
      let categories = [];
      this.client.commands.forEach(async (command) => {
        if (command.enabled) {
          let result = await command.check(args, message, this.client);
          if (result) {
            if (!categories.includes(command.help.category.toLowerCase())) categories.push(command.help.category.toLowerCase());
          }
        }
      });
      let total = [];
      this.client.commands.forEach(command => {
        if (!total.includes(command.help.category)) total.push(command.help.category);
      });
      let interval = setInterval(() => {
        if (total.length === categories.length) {
          clearInterval(interval);
          if (categories.includes(args.join(" ").toLowerCase())) {
            let commands = "";
            let t = [];
            this.client.commands.forEach(async (command) => {
              if (!command.enabled) return;
              let result = await command.check(args, message, this.client);
              if (!result) return;
              if (command.help.category.toLowerCase() !== args.join(" ").toLowerCase()) return;
              commands += `\`${command.help.name}`;
              if (command.help.args) {
                command.help.args.forEach(arg => {
                  let type = arg.split(": ")[1];
                  if (type === "required") commands += ` <${arg.split(":")[0]}>`;
                  else if (type === "optional") commands += ` [${arg.split(":")[0]}]`;
                });
              }
              commands += `\` - **${command.help.description}**\n`;
              t.push(command.help.name);
            });
            total = [];
            this.client.commands.forEach(command => {
              if (!total.includes(command.help.name) && command.help.category.toLowerCase() === args.join(" ").toLowerCase()) total.push(command.help.name);
            });
            interval = setInterval(() => {
              if (total.length === t.length) {
                clearInterval(interval);
                message.channel.send(message.embed()
                  .setTitle(`Help: ${args[0].toLowerCase()}`)
                  .setDescription(`Everything with **<>** is required.\nEverything with **[]** is optional.\n\n${commands}`)
                );
              }
            });
          } else {
            let done = false;
            let t = 0;
            this.client.commands.forEach(async (command) => {
              if (!command.enabled) return t++;
              let result = await command.check(args, message, this.client);
              if (!result) return t++;
              if (command.help.name.toLowerCase() !== args[0].toLowerCase()) return t++;
              done = true;
              t++;
              let usage = command.help.name;
              if (command.help.args) {
                command.help.args.forEach(arg => {
                  let type = arg.split(": ")[1];
                  if (type === "required") usage += ` <${arg.split(":")[0]}>`;
                  else if (type === "optional") usage += ` [${arg.split(":")[0]}]`;
                });
              }
              let subCommands;
              if (command.help.subCommands) {
                subCommands = `**Subcommands (${command.help.subCommands.length}):**\n`;
                command.help.subCommands.forEach(subCommand => {
                  subCommands += ` - **${subCommand}**\n`;
                });
              } else subCommand = "Not subcommands!";
              message.channel.send(message.embed()
                .setTitle(`Help: ${args[0].toLowerCase()}`)
                .setDescription(`**Name:** ${command.help.name}\n**Description:** ${command.help.description}\n**Category:** ${command.help.category}\n**Usage:** \`${usage}\`\n${subCommands}`)
              );
            });
            interval = setInterval(() => {
              if (this.client.commands.size === t) {
                clearInterval(interval);
                if (!done) return message.reply("command/category not found!");
              }
            });
          }
        }
      });
    }
  }
}
