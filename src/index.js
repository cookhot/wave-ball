import Draggabilly from 'draggabilly';
import { attachClassName } from './utils';
import Wave from './wave';

// 唯一节点Id
const BaseWBWaveBallId = 'wb-wave-ball';

// 判断页面是否存在水波球元素，防止有相似id的元素
const findWBWaveBallEl = (index) => {
  const elId = `${BaseWBWaveBallId}_${index}`;
  const el = document.getElementById(elId);
  if (!el) {
    return index;
  }
  if (!el.$$WBWaveBall) {
    return findWBWaveBallEl(index + 1);
  }

  return index;
};

const defaultOptions = {
  waveOptions: {
    range: 0,
    padding: 1
  }
};

// 初始化 水波球 
export class WBWaveBall {
  constructor(options) {
    const idIndex = findWBWaveBallEl(0);
    
    const el = document.createElement('div');

    el.setAttribute('id', `${BaseWBWaveBallId}_${idIndex}`);
    // 如果原来组件存在，销毁原来水波球 
    if (el.$$WBWaveBall) {
      el.$$WBWaveBall.destroy();
    }

    el.$$WBWaveBall = this;
    this.el = el;

    const canvas = document.createElement('canvas');
    this.el.appendChild(canvas);

    this.canvas = canvas;

    // 额外信息
    const otherDiv = document.createElement('div');
    this.otherDiv = otherDiv;
    this.otherDiv.setAttribute('id', `${BaseWBWaveBallId}-other_${idIndex}`);
    this.el.appendChild(otherDiv);
    
    this.options = Object.assign({}, defaultOptions, options);

    document.body.appendChild(el);

    this.init();
  }
  
  // 初始化元素信息
  init() {
    this.render(this.options);
    
    // 初始化 拖拽，并且设定只能在当前页面能够拖拽
    new Draggabilly(this.el, {
      // grid: [120, 120]
    });
  }

  render(options) {
    const { className, waveOptions, template } = options;
    const { el } = this;

    attachClassName(el, className);

    if (!this.wave) {
      this.wave = new Wave(this.canvas, waveOptions);
    } else {
      this.wave.update(waveOptions);
    }

    if (template) {
      this.otherDiv.innerHTML = template;
    }
  }

  // 更新
  update(options) {
    this.options = Object.assign(this.options, options);
    this.render(this.options);
  }

  // 销毁
  destroy() {
    console.log('destroy');
  }
}