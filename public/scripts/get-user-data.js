import htmlPath from "./html-getter.js";
import createAClass from "./create-a-class.js";
import classDisplay from "./class-display.js";
import InviteDisplay from "./invite-display.js"
import Message from "./message.js"
import buttonMessage from "./button-message.js";
import classOpener from "./class-opener.js";
export default (dashboard, user) => {
    $.post("/get-user-data", {
        username: localStorage.username,
        password: localStorage.password
    }, (data, status) => {
        if (status === "error") return swal({
            title: "Error",
            text: "Unable to access database.",
            icon: "error"
        });
        user.email = data.email;
        user.type = data.type;
        console.log(data.classes);
        console.log(data.invites);
        console.log(data.classesJoined);
        user.classesJoined = data.classesJoined && data.classesJoined.map(cls => new classOpener(`Class ${cls.className}, by ${cls.teacherName}.`, cls.className)) || [];
        user.classes = data.classes ? data.classes.map(cls => (typeof cls === "string") ? new classDisplay(cls) : cls.student ? new classOpener(`${cls.className}, ${cls.student} has joined.`, cls.className) : new classDisplay(cls.className, cls.student)) : [];
        user.invites = data.invites ? data.invites.map(invite => new InviteDisplay(invite)) : [];
        dashboard.append(
            `
        <p class="w3-padding">
           ${
               user.type === "Student"
               ? "You are a student." + (user.classesJoined.length === 0) ? "" : "You can't do much until a teacher invites you to their class."
               : "You are a teacher. You can create classes and invite students to join them."
            } 
        <p>
        `
        );
        if (user.type === "Student") {
            user.invites.forEach(invite => {
                dashboard.append(invite.el);
            });
            user.classesJoined.forEach(joinedClass => {
                dashboard.append(joinedClass.el)
            })
        } else {
            $.get(htmlPath("teacher-options.html"), data => {
                dashboard.append(data);
                const classList = $(`<section class="w3-padding">`).append("<p>Classes:</p>");
                user.classes.forEach(cls => {
                    classList.append(cls.el);
                });
                dashboard.append(classList);
                $(`button:contains("Create A Class")`).click(createAClass);
            });
        }
    });
}