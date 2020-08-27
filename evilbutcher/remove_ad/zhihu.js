/*

[rewrite_local]
# 知乎网页直接看
^https://www\.zhihu\.com/question/ url script-response-body Local/remove_ad/zhihu.js


[mitm]
hostname = www.zhihu.com
*/


let html = $response.body
let nonce= html.match(/nonce="[\w\-]*"/g)[1]

html = html.replace(/(<\/html>)/g, "") +
`
<script ${nonce}>
setTimeout(
() => {
    document.querySelector("body").style.overflow = "auto"
    document.querySelector(".MobileModal-wrapper").remove()

    document.querySelectorAll(".RichContent-inner").forEach(item => {
        item.style.maxHeight = "100%"
        item.parentNode.removeAttribute("class")
    })
}
,
600
)
</script>
</html>
`

$done({body: html})
