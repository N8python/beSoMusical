import { dashboard } from "./main.js";
import htmlPath from "./html-getter.js";
import openModal from "./modal-opener.js";
import addAssignment from "./add-assignment.js";
import answerAssignment from "./answer-assignment.js";
import deleteAssignment from "./delete-assignment.js";
import assignWeekly from "./assign-weekly.js";
import addPiece from "./add-piece.js";
import updateClass from "./update-class.js";
import deletePiece from "./delete-piece.js";
import addMessage from "./add-message.js";
import loaClass from "./load-and-open-class.js";
import safeify from "./safeify.js";
import checkAssignment from "./check-assignment.js";
let selectedTab;
export default ({
    data,
    className
}) => {
    if (!data.startsWith("Error:")) {
        dashboard.html(data);
        if (selectedTab) {
            $(`[href="${selectedTab}"]`).addClass("active");
            $(selectedTab).addClass("active").addClass("show");
        }
        $(".fa-arrow-left").click(() => {
            location = location.href;
        });
        $(".nav-link").click(function() {
            selectedTab = $(this).attr("href");
        });
        $(`button:contains("Add Assignment")`).click(() => {
            openModal(htmlPath("assignment-form.html"), modal => {
                $(`#createAssignment`).click(() => {
                    addAssignment({
                        className,
                        assignmentName: safeify($(`[name="assignmentname"]`).val()),
                        modal
                    });
                });
            });
        });
        $(`button:contains("Answer Assignment")`).click(e => {
            const assignment = $(e.target).prev();
            const assignmentName = assignment.attr("assignment-name");
            openModal(htmlPath("answer-assignment.html"), modal => {
                $(`button:contains("Answer")`).click(() => {
                    const response = safeify($(`input[name="response"]`).val());
                    answerAssignment({
                        className,
                        assignmentName,
                        response,
                        modal
                    });
                })
            });
        });
        $(`button:contains("Delete Assignment")`).click(e => {
            const assignment = $(e.target).prev();
            const assignmentName = assignment.attr("assignment-name");
            deleteAssignment({
                className,
                assignmentName
            });
        });
        $(`button:contains("Assign Week of Assignments")`).click(() => {
            assignWeekly(className);
        });
        $(`button:contains("Add Piece")`).click(() => {
            addPiece(className);
        });
        $(`button:contains("Delete Piece")`).click(function() {
            deletePiece(className, this);
        })
        $(".progress").click(function(e) {
            updateClass(e, className, this);
        });
        $("#enterMessage").keydown(e => {
            addMessage(e, className);
        });
        $(`input[type="checkbox"]`).change(function(e) {
            checkAssignment(className, this);
        });
    } else {
        return swal({
            title: "Error",
            text: data,
            icon: "error"
        });
    }
}