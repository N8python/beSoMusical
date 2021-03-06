import htmlPath from "./html-getter.js";
import fufill from "./fufill.js";
import signUp from "./sign-up.js";
import logIn from "./log-in.js";
import logOut from "./log-out.js";
import getUserData from "./get-user-data.js";
import loadDashboard from "./load-dashboard.js";
const dashboard = $("#dashboard");
let user = {
    email: null,
    type: null,
    classes: null
};
if (localStorage.loggedIn !== "true") {
    dashboard.load(htmlPath("not-logged-in.html"), () => {
        $("#sign-up").click(signUp);
        $("#log-in").click(logIn);
    });
} else {
    loadDashboard(dashboard, user);
}
export { user, dashboard };