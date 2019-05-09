export default jq => {
    jq.html(jq.html().replace(/\$\{(.+)\}/g, (_, p1) => {
        return eval(p1);
    }))
}