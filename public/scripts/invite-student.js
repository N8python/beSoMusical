export default (studentName, className, modal) => {
    console.log(`Inviting ${studentName}`);
    $.post("/send-invite", {
        studentName,
        className,
        teacherName: localStorage.username
    }, data => {
        if (modal) {
            modal.remove();
        }
        swal({
            title: "Student Invited",
            text: `You invited ${studentName} to join your class ${className}.`,
            icon: "success"
        });
        console.log(data);
    });
}