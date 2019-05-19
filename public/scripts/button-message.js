import Message from "./message.js";
export default class extends Message {
    constructor(text, buttonMessage, button = true) {
        super(text);
        if (button) {
            this.$button = $(`<button class="text-white btn w3-right">${buttonMessage}</button>`);
            this.$elem.append(this.$button);
        }
    }
}