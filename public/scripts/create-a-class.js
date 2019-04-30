import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import makeClass from "./class-maker.js";
export default () => {
    openModal(htmlPath("create-a-class.html"), modal => {
        $(`button:contains("Create Class")`).click(() => {
            makeClass();
            modal.css("display", "none");
            modal.remove();
        });
    });
}