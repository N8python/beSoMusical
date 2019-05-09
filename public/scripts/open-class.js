import { dashboard } from "./main.js";
import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import addAssignment from "./add-assignment.js";
import answerAssignment from "./answer-assignment.js";
export default ({
    data,
    className
}) => {
    if (!data.startsWith("Error:")) {
        dashboard.html(data);
        $(".fa-arrow-left").click(() => {
            location = location.href;
        });
        $(`button:contains("Add Assignment")`).click(() => {
            openModal(htmlPath("assignment-form.html"), modal => {
                $(`button:contains("Create Assignment")`).click(() => {
                    modal.css("display", "none");
                    addAssignment({
                        className,
                        assignmentName: $(`[name="assignmentname"`).val()
                    });
                });
            });
        });
        $(`button:contains("Answer Assignment")`).click(e => {
            const assignment = $(e.target).prev();
            const assignmentName = /Assignment:(.+)\,/.exec(assignment.html()) && /Assignment:(.+)\,/.exec(assignment.html())[1];
            openModal(htmlPath("answer-assignment.html"), modal => {
                $(`button:contains("Answer")`).click(() => {
                    const response = $(`input[name="response"]`).val();
                    answerAssignment({
                        className,
                        assignmentName,
                        response
                    });
                    modal.css("display", "none");
                })
            });
        })
    } else {
        return swal({
            title: "Error",
            text: data,
            icon: "error"
        });
    }
}