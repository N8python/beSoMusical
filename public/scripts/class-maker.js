export default () => {
    const className = $(`input[name="classname"]`).val();
    $.post("/create-class", {
        className,
        username: localStorage.username,
        password: localStorage.password
    }, (data, status) => {
        if (status === "error") return swal({
            title: "Error",
            text: "Unable to access database.",
            icon: "error"
        });
        location.href = location.href;
    });
}