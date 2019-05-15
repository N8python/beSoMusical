import loaClass from "./load-and-open-class.js";
import safeify from "./safeify.js";
export default (e, className) => {
    if (e.key === "Enter") {
        const message = `${localStorage.username}: ${safeify($("#enterMessage").val())}`;
        $.post("/add-message", {
            className,
            username: localStorage.username,
            message
        }, _ => {
            loaClass(className);
        });
    }
}