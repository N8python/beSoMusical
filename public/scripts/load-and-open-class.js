import openClass from "./open-class.js";
export default className => {
    $.post("/getClass", {
        class: className,
        username: localStorage.username
    }, data => {
        openClass({
            data,
            className
        });
    });
}