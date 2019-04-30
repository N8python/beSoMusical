import htmlPath from "./html-getter.js";
import createAClass from "./create-a-class.js";
import classDisplay from "./class-display.js";
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
        user.classes = data.classes ? data.classes.map(cls => new classDisplay(cls)) : [];
        dashboard.append(
            `
        <p class="w3-padding">
           ${
               user.type === "Student"
               ? "You are a student. You can't do much until a teacher invites you to their class."
               : "You are a teacher. You can create classes and invite students to join them."
            } 
        <p>
        `
        );
        if (user.type === "Student") {

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