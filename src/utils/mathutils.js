export default class MathUtils {
  static randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static randomBool() {
    return Math.random() >= 0.5;
  }
  
  static randomInCircle(center, radius) {
    return {
      x: MathUtils.randomInt(center.x - radius, center.x + radius),
      y: MathUtils.randomInt(center.y - radius, center.y + radius)
    };
  }

  static randomBetweenCircles(center, radiusInner, radiusOutter) {
    let x = MathUtils.randomInt(center.x - radiusOutter, center.x + radiusOutter);
    let dx = x - center.x;

    let angleOutter = Math.acos(dx / radiusOutter);
    let offsetOutter = Math.abs(radiusOutter * Math.sin(angleOutter));

    let angleInner = Math.acos(dx / radiusInner);
    if (dx > radiusInner) {
      angleInner = 0;
    } else if (dx < -radiusInner) {
      angleInner = Math.PI;
    }
    let offsetInner = Math.abs(radiusInner * Math.sin(angleInner));

    let y = center.y + offsetInner;
    if (MathUtils.randomBool()) {
      y = MathUtils.randomInt(center.y + offsetInner, center.y + offsetOutter);
    } else {
      y = MathUtils.randomInt(center.y - offsetOutter, center.y - offsetInner);
    }

    return { x: x, y: y };
  }

  static dragAngle(anchor, dragPoint) {
    let angle = Math.atan2(dragPoint.y - anchor.y, dragPoint.x - anchor.x);
    if(angle < 0) {
      angle += Math.PI * 2;
    }
    
    return angle;
  }

  static normalAngle(angle) {
    if (angle > Math.PI * 2) {
      return angle - Math.PI * 2;
    } else if (angle < -Math.PI * 2) {
      return angle + Math.PI * 2;
    }

    return angle;
  }

  static SQRT5 = Math.sqrt(5);
  static PHI = (1 + MathUtils.SQRT5) / 2;

  static fib(n) {
    return Math.round(Math.pow(MathUtils.PHI, n) / MathUtils.SQRT5);
  }
}