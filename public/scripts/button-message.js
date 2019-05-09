import Message from "./message.js";
export default class extends Message {
    constructor(text, buttonMessage, button = true) {
        super(text);
        if (button) {
            this.$button = $(`<button class="text-white w3-blue w3-btn w3-right w3-round">${buttonMessage}</button>`);
            this.$elem.append(this.$button);
        }
    }
}