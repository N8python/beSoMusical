import loaClass from "./load-and-open-class.js";
export default ({
    className,
    assignmentName
}) => {
    swal({
        title: "Delete Assignment?",
        text: "This means that the assignment and its response will be lost forever.",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then(willDelete => {
        if (willDelete) {
            $.post("/delete-assignment", {
                className,
                assignmentName
            }, data => {
                loaClass(className);
                swal({
                    title: "Assignment Deleted",
                    text: `The ${assignmentName} has been removed from ${className}.`,
                    icon: "success"
                });
            });
        }
    });
}