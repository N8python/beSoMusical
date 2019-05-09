import messageWithButton from "./button-message.js";
import loadDashboard from "./load-dashboard.js";
import { user, dashboard } from "./main.js";
export default class extends messageWithButton {
    constructor({
        teacherName,
        className
    }) {
        super(`<em>${teacherName}</em> invited you to join the class <em>${className}</em>.`, "Join");
        this.teacherName = teacherName;
        this.className = className;
        this.$button && this.$button.click(() => {
            $.post("/join-class", {
                studentName: localStorage.username,
                teacherName,
                className
            }, data => {
                swal({
                    title: "Class joined!",
                    text: `You joined ${teacherName}'s class ${className}.`,
                    icon: "success"
                })
                loadDashboard(dashboard, user);
            })
        })
    }
}