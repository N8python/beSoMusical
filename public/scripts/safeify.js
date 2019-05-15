export default str => {
    return str.replace(/\<script\>/g, "").replace(/\<\/script\>/g, "")
}