import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
export default () => {
    openModal(htmlPath("log-in.html"), modal => {
        $(`button:contains("Log In")`).click(e => {
            e.preventDefault();
            const { username, password } = {
                username: $(`input[name="username"]`).val(),
                password: $(`input[type="password"]`).val(),
            }
            console.log(username, password)
            $.ajax({
                url: "/log-in",
                type: "POST",
                data: {
                    username,
                    password
                },
                complete() {
                    console.log('process complete');
                },
                success(data) {
                    console.log(data);
                    if (data === "Login succesful!") {
                        localStorage.loggedIn = true;
                        localStorage.password = password;
                        localStorage.username = username;
                        location = location.href;
                    } else if (data === "User does not exist.") {
                        swal({
                            title: "User Does Not Exist",
                            text: "The user you tried to log in as is nonexistent.",
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
    });
}