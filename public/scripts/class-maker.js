import { dashboard, user } from "./main.js";
import loadDashboard from "./load-dashboard.js";
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
        swal({
            title: "Class Created!",
            text: `You created the class ${className}.`,
            icon: "success"
        });
        loadDashboard(dashboard, user);
    });
}