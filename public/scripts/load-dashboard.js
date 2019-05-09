import htmlPath from "./html-getter.js";
import logOut from "./log-out.js";
import fufill from "./fufill.js";
import getUserData from "./get-user-data.js";

export default (dashboard, user) => {
    dashboard.load(htmlPath("dashboard.html"), () => {
        fufill(dashboard)
        getUserData(dashboard, user);
        $("#log-out").click(logOut);
    })
};