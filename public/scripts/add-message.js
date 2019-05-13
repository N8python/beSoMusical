import loaClass from "./load-and-open-class.js";
export default (e, className) => {
    if (e.key === "Enter") {
        const message = `${localStorage.username}: ${$("#enterMessage").val()}`;
        $.post("/add-message", {
            className,
            username: localStorage.username,
            message
        }, _ => {
            loadAndOpenClass(className);
        });
    }
}