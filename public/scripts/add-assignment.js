import loaClass from "./load-and-open-class.js";
export default ({
    className,
    assignmentName,
    modal
}) => {
    $.post("/create-assignment", {
        className,
        assignmentName
    }, data => {
        if (modal) {
            modal.css("display", "none");
        }
        swal({
            title: "Assignment Created",
            text: `Assignment ${assignmentName} created.`,
            icon: "success"
        }).then(() => {
            loaClass(className);
        });
    });
}