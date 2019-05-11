function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
        parseInt(parts[0], 10), // year
        parseInt(parts[1], 10) - 1, // month (starts with 0)
        parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
        parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
        parts[2] = "0" + parts[2];
    }
    return parts.join("-");
}

export default function addToDate(date, num) {
    for (let i = 0; i < num; i++) {
        date = incr_date(date);
    }
    return date;
}