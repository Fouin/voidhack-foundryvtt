export default class vhkItemSheet extends ItemSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width:440,
      height: 200,
      classes: ["voidhack", "sheet", "item"]
    });
  }

  get template() {
    return `systems/voidhack/templates/sheets/${this.item.data.type}-sheet.html`
  }

  getData() {
    const data = super.getData();

    data.config = CONFIG.voidhack;

    return data;
  }
}
