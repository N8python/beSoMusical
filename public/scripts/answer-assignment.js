import loaClass from "./load-and-open-class.js";
export default ({
    className,
    assignmentName,
    response
}) => {
    $.post("/respond-to-assignment", {
        className,
        assignmentName,
        response
    }, data => {
        swal({
            title: "Response Sent!",
            text: `You responded ${response} to the assignment ${assignmentName}.`,
            icon: "success"
        }).then(data => {
            loaClass(className)
        });
    });
}