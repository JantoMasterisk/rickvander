const command = require("bananenbase").command;

module.exports = class Menu extends command {
  constructor(client) {
    super(client, {
      name: "regels",
      description: "Bekijk de regels!",
      category: "Main"
    });
  }

  async run(message) {
    message.channel.send(`***Regels***
**1.** Heb respect, geen haat, niet racistisch doen, gewoon niets rond respectloosheid!
**2.** Random SPAM word niet getolereerd. Alleen in #spam !
**3.** Gebruik de text/spraak kanalen voor het JUISTE onderwerp!
**4.** Als een Staff lid vraagt om te stoppen met iets STOP je ook!
**5.** Val mensen niet lastig in privé via deze DC te gebruiken!
**6.** GEEN zelfpromotie maken! Je kan een ban verwachten al doe je dit.
**7.** Bugs en fouten melden bij staff
**8.** Bot commando's moeten in #bot
**9.** Bot niet misbruiken 
**10.** Geen abuse gebruiken van de rechten die je hebt.
**11.** Geen sexueele gedrag.
**12.** Geen PF of ACC DC naam gebruiken dat niet beschadigend is voor mensen.
**13.** Tag rollen en users niet overbodig.
**14.** Hou je aan de mini games en de regels die er bij horen.
**15.** Als er een regel niet tussen staat bekent niet meteen dat het zomaar toegestaan is. dus als je denkt dat het eigenlijk niet mag vraag het voor de zekerheid na. (natuurlijk wel serieuze dingen dan)
**16.** De ENIGE uitzondering op de regel is als Team PlotTwist toestemming  geeft!`);
  }
}
