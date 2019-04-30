export default class {
    constructor(name) {
        this.name = name;
        this.$elem = $(`<div class="w3-aqua w3-padding w3-round w3-margin w3-bar" style="width: 97%">`)
            .append(`<span>${this.name}</span>
           <button class="w3-right w3-btn w3-blue text-white w3-round">Invite Student</button>`);
    }
    get el() {
        return this.$elem;
    }
}