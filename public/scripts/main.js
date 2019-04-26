import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import fufill from "./fufill.js";
if (localStorage.loggedIn !== "true") {
    $("#dashboard").load(htmlPath("not-logged-in.html"), () => {
        $("#sign-up").click(() => {
            openModal(htmlPath("sign-up.html"), modal => {
                $(`button:contains("Sign Up")`).click(e => {
                    e.preventDefault();
                    const { username, email, password } = {
                        username: $(`input[name="username"]`).val(),
                        email: $(`input[type="email"]`).val(),
                        password: $(`input[type="password"]`).val(),
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
                                openModal(htmlPath("cannot-sign-up-twice.html"))
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
        });
        $("#log-in").click(() => {
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
                                openModal(htmlPath("user-does-not-exist.html"))
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
        });
    });
} else {
    $("#dashboard").load(htmlPath("dashboard.html"), () => {
        fufill($("#dashboard"));
        $("#log-out").click(() => {
            localStorage.loggedIn = false;
            localStorage.password = "";
            localStorage.username = "";
            location = location.href;
        })
    });
}