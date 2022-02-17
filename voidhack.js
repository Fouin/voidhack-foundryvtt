import { registerPartials } from './module/partials.js';
import { voidhack } from "./module/config.js";
import ghkItemSheet from "./module/sheets/ghkItemSheet.js";
import ghkCharacterSheet from "./module/sheets/ghkCharacterSheet.js";

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/voidhack/templates/partials/character-header.html",
    "systems/voidhack/templates/partials/character-attributes.html",
    "systems/voidhack/templates/partials/character-abilities.html",
    "systems/voidhack/templates/partials/character-equipment.html",
    "systems/voidhack/templates/partials/character-estate.html"
  ];

  return loadTemplates(templatePaths);
}



Hooks.once("init", function () {
  console.log("voidhack | Initialising voidhack")

  CONFIG.voidhack = voidhack;

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("voidhack", ghkItemSheet, { makeDefault: true });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("voidhack", ghkCharacterSheet, { makeDefault: true });

  registerPartials();

  preloadHandlebarsTemplates()

  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
        if (typeof arguments[arg] != 'object') {
            outStr += arguments[arg];
        }
    }
    return outStr;
});
});
