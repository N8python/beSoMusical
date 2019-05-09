import loaClass from "./load-and-open-class.js";
export default ({
    className,
    assignmentName
}) => {
    $.post("/create-assignment", {
        className,
        assignmentName
    }, data => {
        swal({
            title: "Assignment Created",
            text: `Assignment ${assignmentName} created.`,
            icon: "success"
        }).then(() => {
            loaClass(className);
        });
    });
}