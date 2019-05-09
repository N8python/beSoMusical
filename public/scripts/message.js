export default class {
    constructor(text) {
        this.$elem = $(`<div class="w3-aqua w3-padding w3-round w3-margin w3-bar" style="width: 97%">`);
        this.$elem.html(text);
    }
    get el() {
        return this.$elem;
    }
}