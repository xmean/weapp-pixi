export default class Utils {
  static setAttr(target, src, attr, defaultValue) {
    target[attr] = (typeof src === 'undefined' || typeof src[attr] === 'undefined') ? defaultValue : src[attr];
  }

  static setAttrs(target, src, ...attrs) {
    for(const attr of attrs) {
      target[attr[0]] = (typeof src === 'undefined' || typeof src[attr[0]] === 'undefined') ? attr[1] : src[attr[0]];
    }
  }
}