import openModal from "./modal-opener.js";
import htmlPath from "./html-getter.js";
import sendInvite from "./invite-student.js";
import messageWithButton from "./button-message.js";
export default class extends messageWithButton {
    constructor(name, studentName) {
        super(studentName ? `${name}. ${studentName} has joined this class.` : name, "Invite Student", studentName ? false : true);
        this.name = name;
        if (!studentName) {
            this.$button.click(() => {
                openModal(htmlPath("invite-student.html"), modal => {
                    $(`button:contains("Send Invite")`).click(() => {
                        const studentUsername = $(`input[name="studentusername"]`).val();
                        sendInvite(studentUsername, this.name);
                    });
                });
            });
        }
    }
}