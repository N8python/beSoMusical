export default (path, callback = () => {}) => {
    $.get(path, data => {
        const modal = $(`<div class="w3-modal w3-animate-zoom"></div>`);
        const container = $(`<div class="w3-modal-content w3-padding">`);
        modal.css("display", "block");
        container.append(data);
        modal.append(container);
        $(window).click(() => {
            if (!container[0].contains(event.target)) {
                modal.css("display", "none");
                modal.remove();
            }
        });
        $("body").append(modal);
        callback(modal);
    })
}