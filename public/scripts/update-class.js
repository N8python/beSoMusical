export default (e, className, that) => {
    const bar = $($(that).children().get(0));
    const xDiff = e.clientX - bar.offset().left;
    const percent = xDiff / $(that).width() * 100;
    bar.css("width", `${Math.ceil(percent)}%`);
    bar.html(`${bar.attr("piecename")} : ${Math.ceil(percent)}% Progress`);
    $.post("/update-piece", {
        className,
        pieceName: bar.attr("piecename"),
        progress: percent
    });
}