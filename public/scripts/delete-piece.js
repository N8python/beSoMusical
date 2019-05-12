import loaClass from "./load-and-open-class.js";
export default (className, that) => {
    swal({
        title: "Delete Piece?",
        text: "This means that the piece and its progress will be lost forever.",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then(willDelete => {
        if (willDelete) {
            const pieceName = $($(that).prev().children().get(0)).attr("piecename");
            $.post("/delete-piece", {
                className,
                pieceName
            }, _ => {
                loaClass(className);
            });
        }
    })
}