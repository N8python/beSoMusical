export default (path, callback = () => {}) => {
    $.get(path, data => {
        const modal = $(`<div class="w3-modal w3-animate-zoom"></div>`);
        const container = $(`<div class="w3-modal-content w3-padding">`);
        modal.css("display", "block");
        const remove = $(`<button class="w3-right w3-round w3-btn w3-gray">`).html("x");
        container.append(remove);
        container.append(data);
        modal.append(container);
        remove.click(() => {
            modal.css("display", "none");
            modal.remove();
        });
        $("body").append(modal);
        callback(modal);
    })
}