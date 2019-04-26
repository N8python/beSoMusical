export default jq => {
    jq.html(jq.html().replace(/\$\{(.+)\}/g, (match, p1) => {
        console.log(p1);
        return eval(p1);
    }))
}