export default function(className, that) {
    const assignmentName = $(that).parent().attr("assignment-name");
    if (that.checked) {
        $.post("/check-assignment", {
            className,
            assignmentName
        });
    } else {
        $.post("/uncheck-assignment", {
            className,
            assignmentName
        });
    }
}