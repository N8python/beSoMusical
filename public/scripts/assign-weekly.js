import addToDate from "./increment-date.js";
import openModal from "./modal-opener.js";
import htmlPath from "./html-getter.js";
import addAssignment from "./add-assignment.js";
import safeify from "./safeify.js";
export default className => {
    openModal(htmlPath("assign-week.html"), modal => {
        $("#addDayAssignment").click(e => {
            const dateVal = safeify($(`input[type="date"]`).val());
            if (!dateVal) {
                return swal({
                    title: "Enter a Date",
                    text: "Enter the date that the week starts.",
                    icon: "warning"
                });
            }
            const numInput = $(`input[type="number"]`)
            const incrementVal = Number(safeify(numInput.val()));
            numInput.val(Number(safeify(numInput.val())) + 1);
            $("#inputs").append(`
                <span iterable>${addToDate(dateVal, incrementVal - 1)} : <input type="text" placeholder="To do on ${addToDate(dateVal, incrementVal - 1)}?"></span>
                <br>
                <br>
            `);
        });
        $(`input[type="number"]`).click(e => {
            e.stopPropagation();
        });
        $(`button:contains("Submit All Assignments")`).click(() => {
            $("span[iterable]").each((_, element) => {
                const input = $(element).find("input");
                const text = $(element).contents().get(0).nodeValue;
                const assignmentName = text + safeify(input.val());
                setTimeout(() => {
                    addAssignment({
                        className,
                        assignmentName
                    });
                }, 0);
            });
            setTimeout(() => {
                modal.css("display", "none");
            }, 2000)
        });
    });
}