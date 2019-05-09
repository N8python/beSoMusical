import buttonMessage from "./button-message.js";
import openClass from "./open-class.js";
export default class extends buttonMessage {
    constructor(text, className) {
        super(text, "Open");
        this.className = className;
        this.$button.click(() => {
            $.post("/getClass", {
                class: this.className,
                username: localStorage.username
            }, data => {
                openClass({
                    data,
                    className
                });
            });
        });
    }
}