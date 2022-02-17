# voidhack

Système de jeu pour la modification Voidhack, inspiré de Cairn et Into the Odd

## Structure

`system.json` => informations sur le système  
`template.json` => structure de données du système  
`templates/` => Bouts de HTML  
`modules/` => JS  
`voidhack.css` => CSS du système  
`voidhack.js` => JS du système  

## TODO

- Mettre à jour `template.json`
- Virer le legacy code qui sert à rien
- Remplacer toutes les mentions de goldhack (ghk..) par voidhack (vhk...)

## Sprints

### Fonctionnalités fiche

![Mockup fiche](https://media.discordapp.net/attachments/905211408835309608/943862079205548043/Frame_1.png)

- Inventaire
    - 4 sections : Inventaire, Traits/Implants, Casier, Capital = [ Foundry fait déjà le découpage ]
    - Inventaire = 10 slots maximale, dont les 2 premiers "Main gauche" et "Main droite" = [ Inventaire max slots -> 10, 1&2 = hands ]
    - Les objets lourds prennent 2 emplacements (y compris visuellement. C.F. ), les objets normaux 1 emplacement, les objets légers sont affiché comme 1 emplacement mais ne sont pas comptés dans le cap maximum de slots = [ if(heavy_item){slot_taken = 2}, if(light_item){nothing}; ]
    - Quand l'inventaire est vide, il affiche 3 emplacement vide. D'autres emplacements s'ouvrent au fur et à mesure qu'ils sont remplis = [ if(empty) => {render {slots:3}}, if(full) => {render {slots:+1}}; ]
    - L'inventaire "Inventaire" ne peut pas contenir un poids (emplacements) total de + de 10 = [ Inventaire -> set_items_limit = 10; ]
    - Le joueur doit pouvoir déplacer ses objets et réordonner ses objets dans son inventaire = [ Drag'n'drop feature; ]
    - Le joueur doit pouvoir créer ou supprimer un objet avec un menu contextuel (clique droit) = [ onRightClick => dropdown menu(create && delete); 
    
## Ressources

- [Knowledge base](https://foundryvtt.com/kb/)
- [Documentation API](https://foundryvtt.com/api/)
- [System development tutorial](https://foundryvtt.wiki/en/development/guides/SD-tutorial)
