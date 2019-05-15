import loaClass from "./load-and-open-class.js";
import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import safeify from "./safeify.js";
export default className => {
    openModal(htmlPath("addPiece.html"), modal => {
        $(`button:contains("Create Piece")`).click(() => {
            $.post("/create-piece", {
                className,
                pieceName: safeify($(`input[name="piecename"]`).val())
            }, _ => {
                loaClass(className);
            });
            modal.css("display", "none");
        });
    });
}