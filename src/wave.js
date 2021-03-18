const { sin, cos, sqrt, pow, PI, round } = Math;

const defaultOptions = {
  width: 68,
  height: 68,
  lineWidth: 1,
  radiusColor: '#e8e8e8',
  color: '#4bd64b',
  range: 0,
  padding: 0,
  margin: 1,
};

// 空间间隔
const PADDING = 6;

let sp = 0;

/**
 * 创建一个水波球
 */
class Wave {
  constructor(canvas, options) {
    if (!canvas || !canvas instanceof CanvasRenderingContext2D) {
      return;
    }
    this.canvas = canvas;

    this.options = Object.assign({}, defaultOptions, options);

    this.ctx = this.canvas.getContext("2d");

    // 设置 canvas 大小
    const attrWidth = this.canvas.getAttribute('width');

    if (!attrWidth) {
      this.canvas.width = this.options.width;
      this.canvasWidth = this.canvas.width;
    }

    const attrHeight = this.canvas.getAttribute('height');

    if (!attrHeight) {
      this.canvas.height = this.options.height;
      this.canvasHeight = this.canvas.height;
    }

    this.lineWidth = this.options.lineWidth;

    // 外部半径
    this.cx = this.canvasWidth / 2;

    this.cy = this.canvasHeight / 2;

    // 内部半径
    this.innerRadius = this.cx - this.options.margin;
    
    // 外部圆是否渲染
    this.outerRadiusRendered = false;

    this.render();
  }

  /**
   * 绘制外层圆形
   */
  renderOuterRadius() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.radiusColor;

    const { cx, cy, innerRadius } = this;

    this.ctx.arc(cx, cy, innerRadius, 0, 2 * PI);

    this.ctx.stroke();

    this.ctx.closePath();
  }

  /**
   * 绘制波浪
   */
  renderSine(sp, range) {
    const { ctx } = this;

    const { cx, cy, lineWidth, innerRadius } = this;
    const padding = this.options.padding;
    const margin = this.options.margin;

    ctx.beginPath();
    ctx.save();
    ctx.arc(cx, cy, innerRadius - lineWidth - padding, 0, 2 * PI, 1);
    ctx.restore();
    ctx.clip();

    const xoffset = margin;
    const nowrange = .2;
    const axisLength = this.canvasWidth - margin * 2;
    const unit = axisLength / 8;
    ctx.beginPath();
    ctx.save();
    var Stack = []; // 记录起始点和终点坐标
    for (let i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
      var x = sp + (xoffset + i) / unit;
      var y = sin(x) * nowrange;

      var dx = i;

      var dy = 2 * innerRadius * (1 - range / 100) + (margin) - (unit * y);

      ctx.lineTo(dx, dy);
      Stack.push([dx, dy]);
    }

    // 获取初始点和结束点
    var startP = Stack[0];

    ctx.lineTo(xoffset + axisLength, this.canvasWidth);
    ctx.lineTo(xoffset, this.canvasWidth);
    ctx.lineTo(startP[0], startP[1]);
    ctx.fillStyle = this.options.color;
    ctx.fill();
    ctx.restore();
  }

  /**
   * 绘制文本内容
   */
  drawText(range) {
    this.drawTextLocked = true;
    const { cx, cy, innerRadius, ctx } = this;
    ctx.globalCompositeOperation = 'source-over';

    const size = 0.5 * innerRadius;
    ctx.font = 'bold ' + size + 'px Microsoft Yahei';
    let _range = range;
    let figure = 0;
    while (_range >= 10) {
      _range = _range / 10;
      figure += 1;
    }
    const txt = (_range.toFixed(2) * Math.pow(10, figure)).toFixed(0) + '%';
    
    const fonty = cy + size / 4;
    const fontx = cx - size * (.35 * (figure + 1.45));
    ctx.fillStyle = "#000";
    ctx.fillText(txt, fontx, fonty);
  }

  /**
   * 渲染图形
   */
  render() {
    // 清空
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.renderOuterRadius();

    const { range  } = this.options;

    this.renderSine(sp, range);

    this.drawText(range);

    sp += 0.05;

    requestAnimationFrame(() => {
      this.render();
    });
  }

  update(options) {
    this.options = Object.assign(this.options, options);
  }
}

export default Wave;