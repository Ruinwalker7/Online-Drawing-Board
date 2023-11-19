const STATUS = {
    "NULL": 0,
    "MOVE": 1,
    "TEXT": 2,
    "RUBBER": 3,
    "STRAW": 4,
    "PENCIL": 5,
    "LINE": 6,
    "RECT": 7,
    "OVAL": 8,
    "CIRCLE": 9
}
var width = 500,
    height = 500,
    tool = STATUS.NULL,
    lasttoolbtn = null
var drawing = false,
    redrawing = false;
var startX, startY, endX, endY;
var canvas, ctx, tempCanvas, tempCtx
var linewidth = 4,
    alphe = 100;
var bcolor = "#ffffff"
var lastCanvas;
// 填充颜色
var fillcolor = "#000000",
    color1 = "#000000",
    color2 = "#ffffff";
var drawEvent = []
var historys = []
var historysLength = 0,
    historystop = 0;
// 将之前选择的按键颜色重置
function resetbtn() {
    lasttoolbtn.style.backgroundColor = "#ffffff"
}

// 重置工具
function resettool() {
    tool = STATUS.NULL
}

// 展示新建弹出框
function showPopup() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function hidePopup() {
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}

// 下载画布的函数
function downloadCanvas() {
    tempCtx.fillStyle = bcolor
    tempCtx.fillRect(0, 0, width, height);
    tempCtx.drawImage(canvas, 0, 0)

    // 将画布内容转为数据 URL
    const dataUrl = document.getElementById("tempCanvas").toDataURL();

    // 创建一个链接元素
    const link = document.createElement('a');

    // 设置链接的属性，包括下载的文件名
    link.href = dataUrl;
    link.download = 'canvas_image.png';

    // 将链接添加到文档中
    document.body.appendChild(link);

    // 触发链接的点击事件
    link.click();

    // 移除链接元素
    document.body.removeChild(link);

    tempCtx.clearRect(0, 0, width, height)
}

function ClearAll() {
    ctx.clearRect(0, 0, width, height);
    drawnew();
}

// 更新history
function drawnew() {
    if (historysLength == historystop && historysLength == historys.length - 1) {
        historysLength = historysLength + 1;
        historystop += 1
        historys.push(ctx.getImageData(0, 0, width, height))
    } else {
        historysLength = historysLength + 1;
        historystop = historysLength
        historys[historysLength] = ctx.getImageData(0, 0, width, height)
    }
}
// 撤回按键
function back1() {
    if (historysLength <= 0)
        return
    else if (historysLength == 0) {
        historysLength--;
        return;
    }
    ctx.clearRect(0, 0, width, height)
    ctx.putImageData(historys[historysLength - 1], 0, 0);
    historysLength -= 1;
    drawEvent.push(ctx.getImageData(0, 0, width, height))
}

function redo() {
    if (historysLength >= historystop) {
        return
    }
    ctx.clearRect(0, 0, width, height)
    ctx.putImageData(historys[historysLength + 1], 0, 0);
    historysLength += 1;
    drawEvent.push(ctx.getImageData(0, 0, width, height))
}

function cleanHistory() {
    drawEvent = []
    historys = []
    historysLength = 0;
    historystop = 0;
}

function redraw() {
    redrawing = true;
    drawing = false;
    i = 0;
    intervalID = setInterval(run, 5000 / drawEvent.length);
}

function run() {
    console.log(i)
    if (i < drawEvent.length) {
        ctx.putImageData(drawEvent[i], 0, 0)
        i++
    } else {
        redrawing = false;
        clearInterval(intervalID);
    }

}

window.onload = function() {
    // 左边工具栏
    toolbtns = document.getElementsByClassName("leftbtn")
    for (let i of toolbtns) {
        i.onclick = function() {
            if (lasttoolbtn != null) {
                resetbtn()
            }
            i.style.backgroundColor = "#f1f1f1"
            lasttoolbtn = this

            if (i.title == "移动图像")
                tool = STATUS.MOVE
            else if (i.title == "文字")
                tool = STATUS.TEXT
            else if (i.title == "橡皮擦")
                tool = STATUS.RUBBER
            else if (i.title == "吸管")
                tool = STATUS.STRAW
            else if (i.title == "铅笔")
                tool = STATUS.PENCIL
            else if (i.title == "直线")
                tool = STATUS.LINE
            else if (i.title == "矩形")
                tool = STATUS.RECT
            else if (i.title == "椭圆")
                tool = STATUS.OVAL
            else if (i.title == "圆")
                tool = STATUS.CIRCLE

        };
    }

    // 画布
    canvas = document.getElementById("draw"); // 得到DOM对象
    ctx = canvas.getContext("2d", true); // 得到渲染上下文

    tempCanvas = document.getElementById('tempCanvas');
    tempCtx = tempCanvas.getContext('2d', true);

    ctx.getImageData(0, 0, width, height)
    ctx.getImageData(0, 0, width, height)
    historys.push(ctx.getImageData(0, 0, width, height));
    lastCanvas = ctx.getImageData(0, 0, width, height);
    setPaperLocation();

    tempCanvas.onmousedown = (e) => {
        if (!redrawing) {
            drawing = true;
            startX = e.clientX - tempCanvas.getBoundingClientRect().left;
            startY = e.clientY - tempCanvas.getBoundingClientRect().top;
            lastCanvas = ctx.getImageData(0, 0, width, height);
        }
    }

    tempCanvas.onmousemove = (e) => {
        if (tool == STATUS.LINE) {
            if (!drawing || redrawing)
                return;
            endX = e.clientX - tempCanvas.getBoundingClientRect().left;
            endY = e.clientY - tempCanvas.getBoundingClientRect().top;
            setColor();
            // 绘制直线
            tempCtx.lineWidth = linewidth;
            tempCtx.globalAlpha = alphe / 100;
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // 清除画布
            tempCtx.putImageData(lastCanvas, 0, 0)
            tempCtx.beginPath();
            tempCtx.moveTo(startX, startY);
            tempCtx.lineTo(endX, endY);
            tempCtx.stroke();
            // ctx.putImageData(lastCanvas, 0, 0)
            // ctx.drawImage(tempCanvas, 0, 0)
            drawEvent.push(tempCtx.getImageData(0, 0, width, height))
        } else if (tool == STATUS.MOVE) {
            if (!drawing || redrawing)
                return;
            endX = e.clientX - tempCanvas.getBoundingClientRect().left;
            endY = e.clientY - tempCanvas.getBoundingClientRect().top;
            ctx.clearRect(0, 0, width, height)

            console.log(1)
            ctx.putImageData(lastCanvas, endX - startX, endY - startY);
        } else if (tool == STATUS.PENCIL) {
            console.log(21)
            if (!drawing || redrawing)
                return;
            setColor();
            // 绘制直线
            endX = e.clientX - tempCanvas.getBoundingClientRect().left;
            endY = e.clientY - tempCanvas.getBoundingClientRect().top;
            tempCtx.lineWidth = linewidth;
            tempCtx.globalAlpha = alphe / 100;
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // 清除画布
            tempCtx.beginPath();
            tempCtx.moveTo(startX, startY);
            tempCtx.lineTo(endX, endY);
            tempCtx.stroke();
            ctx.drawImage(tempCanvas, 0, 0)
            startX = e.clientX - tempCanvas.getBoundingClientRect().left;
            startY = e.clientY - tempCanvas.getBoundingClientRect().top;
            drawEvent.push(ctx.getImageData(0, 0, width, height))
        }
    };

    tempCanvas.onmouseup = () => {
        drawing = false;
        ctx.drawImage(tempCanvas, 0, 0)
        tempCtx.clearRect(0, 0, width, height); // 清除画布
        drawnew();
    };


    function setColor() {
        if (!IsmixedColor.checked) {
            tempCtx.fillStyle = fillcolor
            tempCtx.strokeStyle = fillcolor

        } else {
            if (tool == !STATUS.PENCIL)
                linearGradient = tempCtx.createLinearGradient(startX, startY, endX, endY);
            else
                linearGradient = tempCtx.createLinearGradient(0, 0, width, hei);

            linearGradient.addColorStop(0, color1)
            linearGradient.addColorStop(1, color2)
            tempCtx.fillStyle = linearGradient
            tempCtx.strokeStyle = linearGradient
        }
    }
    var IsmixedColor = document.getElementById("isopened");


    // topbar
    confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.onclick = (e) => {
        tempCtx.clearRect(0, 0, width, height); // 清除画布
        ctx.clearRect(0, 0, width, height); // 清除画布
        w = document.getElementById("broadWidth")
        h = document.getElementById("broadHeight")
        width = tempCanvas.width = canvas.width = w.value;
        height = tempCanvas.height = canvas.height = h.value;
        value = -(40 + 40 + 5 + Number(h.value))
        tempCanvas.style.top = value + "px"
        document.getElementById("htext").textContent = h.value + "px"
        document.getElementById("wtext").textContent = w.value + "px"
        canvas.style.backgroundColor = bcolor
        hidePopup()
        setPaperLocation()
        cleanHistory()
    }

    // rightbar
    var bcol = document.getElementsByClassName("backgroundColor")
    for (let i of bcol) {
        i.addEventListener("change", watchColorPicker, false);
        i.addEventListener("input", watchColorPicker, false);
    }

    var pcol = document.getElementById("pencolor")
    pcol.addEventListener("change", watchPanColor, false);
    pcol.addEventListener("input", watchPanColor, false);

    // 改变笔的颜色
    function watchPanColor(event) {
        tempCtx.strokeStyle = event.target.value;
        tempCtx.fillStyle = event.target.value;
        fillcolor = event.target.value;
    }

    linewidthinput = document.getElementById("linewidth")
    linewidthinput.addEventListener("input", changepan, false)

    function changepan() {
        linewidth = linewidthinput.value
    }

    alphainput = document.getElementById("alpha")
    alphainput.addEventListener("input", changealpha, false)

    // 改变笔的透明度
    function changealpha() {
        alphe = alphainput.value
    }

    // 背景颜色
    function watchColorPicker(event) {
        document.querySelectorAll("#draw").forEach((p) => {
            canvas.style.backgroundColor = event.target.value
            bcolor = event.target.value
        });
    }

    window.addEventListener('resize', setPaperLocation);

    document.getElementById("pencolor1").addEventListener('change', function(event) {
        color1 = event.target.value
    })
    document.getElementById("pencolor2").addEventListener('change', function(event) {
        color2 = event.target.value
    })



    function setPaperLocation() {
        tempCanvas.top = -canvas.getBoundingClientRect()

        if (canvas.getBoundingClientRect().top != tempCanvas.getBoundingClientRect().top) {
            document.getElementById("tempCanvas").style.top = (-canvas.getBoundingClientRect().height - 85) + "px";
            document.getElementById("tempCanvas").style.left = 0
        } else {
            document.getElementById("tempCanvas").style.top = 0
        }


        if (canvas.getBoundingClientRect().left != tempCanvas.getBoundingClientRect().left) {
            document.getElementById("tempCanvas").style.top = 0
            document.getElementById("tempCanvas").style.left = (-85 - canvas.getBoundingClientRect().width) + "px";
        } else {
            document.getElementById("tempCanvas").style.left = 0
        }
    }
}