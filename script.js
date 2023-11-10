var lasttoolbtn = null

function resetbtn() {
    lasttoolbtn.style.backgroundColor = "#ffffff"
}
window.onload = function() {
    buildbtn = document.getElementById("build");
    buildbtn.onclick = function() {
        // console.log(1)
    }


    // 左边工具栏
    toolbtns = document.getElementsByClassName("leftbtn")
    console.log(toolbtns);
    for (let i of toolbtns) {
        i.onclick = function() {
            if (lasttoolbtn != null) {
                resetbtn()
            }
            i.style.backgroundColor = "#f1f1f1"
            lasttoolbtn = this
        };
    }
    console.log(toolbtns)



    // 画布
    var canvas = document.getElementById("draw"); // 得到DOM对象
    if (canvas.getContext) {
        // 这个地方可以改背景是否透明
        var ctx = canvas.getContext("2d", true); // 得到渲染上下文

        // 绘制第一个长方形
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(10, 10, 55, 50);

        // 绘制第二个长方形
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect(30, 30, 55, 50);
    }
}