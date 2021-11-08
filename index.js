// 获取dom节点
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

const lineWidth = document.querySelector("#line-width");
const color = document.querySelector("#color");
const side = document.querySelector("#sidesSelect");
const drawStyle = document.querySelector("#draw-style");
const goBack = document.querySelector("#go-back");
const destory = document.querySelector("#destory");
const ways = document.querySelector("#ways");

const form = document.querySelector("form");

// 存档变量
let drawData;
let drawDatagoback = [];

context.strokeStyle = "black";
context.lineWith = 1.0;
context.lineCap = "round";
context.lineJoin = "round";

let painting = false;

let startPoint = {
  x: 0,
  y: 0,
};

// 存档
const canvasSave = () => context.getImageData(0, 0, 500, 500);
// 读档
const canvasRestore = drawData => {
  context.putImageData(drawData, 0, 0);
}

// 画笔功能
const drawLine = (startx, starty, endx, endy) => {
  context.beginPath();

  context.moveTo(startx, starty);
  context.lineTo(endx, endy);

  context.stroke();

}


// 多边形功能

const drawManySide = (side, r, startx, starty, endx, endy, isStroke) => {
  context.beginPath();
  const pointset = [];
  for (let i = 0; i < side; i++) {
    const rad = 2 * Math.PI / side * i;
    const x = startx + r * Math.cos(rad);
    const y = starty + r * Math.sin(rad);
    pointset.push({ x, y });
    
    if (i > 0) {
      context.lineTo(pointset[i].x, pointset[i].y);
    } else {
      context.moveTo(pointset[0].x, pointset[0].y);
    }
  }
  context.lineTo(pointset[0].x, pointset[0].y);
  if (isStroke === true) {
    context.stroke();
  } else {
    context.fill();
  }
}

// 起笔
canvas.addEventListener("mousedown", e => {
  // 获取起点
  const mousex = e.offsetX;
  const mousey = e.offsetY;

  // 储存起点
  startPoint.x = mousex;
  startPoint.y = mousey;

  // 打开绘制开关
  painting = true

  // 用于撤回的存档
  drawDatagoback.push(canvasSave());

  // 导入配置
  context.strokeStyle = color.value;
  context.lineWidth = lineWidth.value;
  context.fillStyle = color.value;
})
// 滑动
canvas.addEventListener("mousemove", e => {
  if (painting) {
    // 获取目前位置
    const mousex = e.offsetX;
    const mousey = e.offsetY;
    if (drawStyle.value === "pen") {
      // 根据终点起点绘制
      drawLine(startPoint.x, startPoint.y, mousex, mousey);

      // 更新起点
      startPoint.x = mousex;
      startPoint.y = mousey;
    } else if (drawStyle.value === "rub") {
      // 换成白色
      context.strokeStyle = "#fff";

      // 根据终点起点绘制
      drawLine(startPoint.x, startPoint.y, mousex, mousey);

      //颜色变回去
      context.strokeStyle = color.value;
      // 更新起点
      startPoint.x = mousex;
      startPoint.y = mousey;
    } else {
      // 先读取缓存，后
      drawData && canvasRestore(drawData);
      drawData = canvasSave();
      if (drawStyle.value === "circle") {
        const r = ((mousex - startPoint.x) ** 2 + (mousey - startPoint.y) ** 2) ** (1 / 2);
        context.beginPath();
        context.arc(startPoint.x, startPoint.y, r, 0, 2 * Math.PI);
        context.closePath();
        if (ways.value === "stroke") {
          context.stroke()
        } else {
          context.fill();
        }
      } else if (drawStyle.value === "line") {

        drawLine(startPoint.x, startPoint.y, mousex, mousey);
      } else if (drawStyle.value === "rect") {
        const width = Math.abs(mousex - startPoint.x);
        const higeht = Math.abs(mousey - startPoint.y);
        if (ways.value === "stroke") {
          context.strokeRect(startPoint.x < mousex ? startPoint.x : mousex, startPoint.y < mousey ? startPoint.y : mousey, width, higeht);
        } else {
          context.fillRect(startPoint.x < mousex ? startPoint.x : mousex, startPoint.y < mousey ? startPoint.y : mousey, width, higeht);
        }
      } else if (drawStyle.value === "manysize") {
        const size = side.value;
        const r = ((mousex - startPoint.x) ** 2 + (mousey - startPoint.y) ** 2) ** (1 / 2);
        if(ways.value === "stroke") {
          drawManySide(size, r, startPoint.x, startPoint.y, mousex, mousey, true);
        } else {
          drawManySide(size, r, startPoint.x, startPoint.y, mousex, mousey, false);
        }

      }
    }
  }
})
// 松开
canvas.addEventListener("mouseup", e => {
  // 关闭绘制开关
  painting = false;

  // 清空缓存
  drawData = undefined;
})
// 搞出界
canvas.addEventListener("mouseout", () => {
  painting = false;
})

// 撤回
goBack.addEventListener("click", () => {
  if (drawDatagoback.length !== 0) {
    const data = drawDatagoback.pop();
    canvasRestore(data);
  }
})

// 清空
destory.addEventListener("click", () => {
  context.clearRect(0, 0, 500, 500);
})