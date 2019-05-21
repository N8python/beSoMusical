import loaClass from "./load-and-open-class.js";
import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import safeify from "./safeify.js";
export default className => {
    openModal(htmlPath("addPiece.html"), modal => {
        $(`button:contains("Create Piece")`).click(() => {
            console.log(safeify($(`input[name="piecename"]`).val()));
            $.post("/create-piece", {
                className,
                pieceName: safeify($(`input[name="piecename"]`).val())
            }, _ => {
                modal.remove();
                swal({
                    title: "Piece created",
                    text: "The piece has been added.",
                    icon: "success"
                })
                loaClass(className);
            });
        });
    });
}