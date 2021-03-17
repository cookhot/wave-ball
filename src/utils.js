/**
 * 添加类名
 * @param {*} el 
 * @param {*} className 
 * @returns 
 */
export function attachClassName(el, className) {
  if (!el || !className) {
    return;
  }
  el.className = className;
}