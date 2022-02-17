export default class vhkCharacterSheet extends ActorSheet {


  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      // template: "systems/voidhack/templates/sheets/character-sheet.html",
      width:400,
      height: 500,
      classes: ["voidhack", "sheet", "actor"],
      dragDrop: [{dragSelector: ".items-group .item-card", dropSelector: null}]
    });
  }

  get template(){
    return `systems/voidhack/templates/sheets/${this.actor.data.type}-sheet.html`
  }

  getData() {
    const data = super.getData();
    data.config = CONFIG.voidhack;
    data.abilities = data.items.filter(function (item) { return item.type == "ability"});
    data.gameItems = data.items.filter(function (item) { return item.type == "item"});
    return data;
  }

  activateListeners(html) {
    html.find(".ability-toggle").click(this._onAbilityToggle.bind(this));
    html.find(".item-toggle").click(this._onItemToggle.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".item-quantity").click(this._onItemDecrement.bind(this));

    super.activateListeners(html);
  }

  _onAbilityToggle(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.get(itemId);
    item.update({"data.active": !item.data.data.active});

  }

  _onItemToggle(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.items.get(itemId);
    item.update({"data.active": !item.data.data.active});

  }

  _onItemEdit(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    let item = this.actor.items.get(itemId);
    item.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    let element = event.currentTarget;
    let itemId = element.closest(".item").dataset.itemId;
    await this.actor.deleteEmbeddedDocuments('Item', [itemId]);

    let safeLocations = ["estate","reserve","hands","belt","pockets","back","gear","backpack"]

    this.actor.items.forEach((item, index) => {
        if (this.actor.items.get(item.data.data.location) !== undefined){
          return
        }
        if (safeLocations.includes(item.data.data.location)){
          return
        }
        return item.update({"data.location": "hands"});
    });
  }

  async _onDropItem(event, data) {
    if ( !this.actor.isOwner ) return false;

    const item = await Item.implementation.fromDropData(data);
    const itemData = item.toObject();
    const target = event.target;
    const actor = this.actor;
    const source = this.actor.items.get(itemData._id);
    const isCorporation = this.actor.data.type == "corporation";

    let safeLocations = ["estate","reserve","hands","belt","pockets","back","gear","backpack"]
    let safeCorpoLocations = ["estate"]
    this.actor.items.forEach((item, index) => {
        if (this.actor.items.get(item.data.data.location) !== undefined){
          return
        }
        if (!(isCorporation) && safeLocations.includes(item.data.data.location)){
          return
        }
	if ((isCorporation) && safeCorpoLocations.includes(item.data.data.location)){
	  return
	}

	if (isCorporation){
		return item.update({"data.location": "estate"});
	}
        return item.update({"data.location": "hands"});
    });

    // Handle item sorting within the same Actor
    let sameActor = (data.actorId === actor.id) || (actor.isToken && (data.tokenId === actor.token.id));
    if (sameActor) {
      const targetLocation = await target.closest(".items-group")?.dataset.location;
      if (targetLocation !== itemData.data.location && targetLocation !== itemData._id) {

        return source.update({"data.location": targetLocation});
      }
      return this._onSortItem(event, itemData);
    }

    // Remove the previously owned if it exists item
    let oldActor = game.actors.get(data.actorId);
    if (oldActor) {
      oldActor.deleteEmbeddedDocuments('Item', [itemData._id]);
    }

    // Create the owned item
    return this._onDropItemCreate(itemData);
  }

  _onItemCreate(event) {
    event.preventDefault();
    let element = event.currentTarget;

    let itemData = {
      name: game.i18n.localize("voidhack.sheet.newItem"),
      type: element.dataset.type
    };

    return this.actor.createEmbeddedDocuments('Item', [itemData]);
  }

  _onItemDecrement(event){
    event.preventDefault();
    let element = event.currentTarget;
    let item = this.actor.items.get(element.dataset.itemid);
    let newQuantity = item.data.data.quantity - 1
    if (item.data.data.quantity > 1){
      return item.update({"data.quantity": newQuantity});
    }



  }

}
