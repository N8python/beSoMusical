import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import safeify from "./safeify.js";
export default () => {
    openModal(htmlPath("sign-up.html"), modal => {
        $(`button:contains("Sign Up")`).click(e => {
            e.preventDefault();
            const { username, email, password } = {
                username: safeify($(`input[name="username"]`).val()),
                email: safeify($(`input[type="email"]`).val()),
                password: safeify($(`input[type="password"]`).val()),
            }
            $.ajax({
                url: "/sign-up",
                type: "POST",
                data: {
                    username,
                    email,
                    password,
                    type: $(`select`).val()
                },
                complete() {
                    console.log('process complete');
                },
                success(data) {
                    if (data === "User inserted!") {
                        localStorage.loggedIn = true;
                        localStorage.password = password;
                        localStorage.username = username;
                        location = location.href;
                    } else if (data === "Cannot sign up twice.") {
                        swal({
                            title: "Cannot Sign Up Twice",
                            text: "You cannot sign up twice. Perhaps you should log in instead.",
                            icon: "warning"
                        });
                    }
                },
                error() {
                    console.log('process error');
                }
            });
            modal.css("display", "none");
            modal.remove();
        });
    })
}