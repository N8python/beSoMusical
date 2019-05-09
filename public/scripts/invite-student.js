export default (studentName, className) => {
    console.log(`Inviting ${studentName}`);
    $.post("/send-invite", {
        studentName,
        className,
        teacherName: localStorage.username
    }, data => {
        swal({
            title: "Student Invited",
            text: `You invited ${studentName} to join your class ${className}.`,
            icon: "success"
        });
        console.log(data);
    });
}