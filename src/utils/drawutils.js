import * as PIXI from "pixi.js";

export default class DrawUtils {
  static generateQuadraticCirclePoints(r, roughness, fluctuation) {
    let points = [];
    for(let i = 0; i < roughness; i++) {
      let angle = Math.PI * 2 * i / roughness;
      let f = (Math.random() * 2 - 1) * fluctuation;

      points.push({
        x : (r + f) * Math.cos(angle),
        y : (r + f) * Math.sin(angle),
        x0: r * Math.cos(angle),
        y0: r * Math.sin(angle),
        f: f,
        f0: fluctuation,
        angle : angle
      });
    }

    return points;
  }

  static drawQuadraticCircle(graphics, points) {
    for(let i = 0; i <= points.length; i++) {
      let p1 = points[i % points.length];
      let p2 = points[(i + 1) % points.length];

      if (i == 0) {
        graphics.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      } else {
        graphics.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }
    }
  }

  static loadAnimatedSprite(resId) {
    let parts = resId.split('.');
    let base = parts.slice(0, -1).join('.');
    let ext = parts.slice(-1);

    let frames = [];
    let i = 0;
    let frameId = base + '##' + i + "." + ext;
    while(frameId in PIXI.utils.TextureCache) {
      frames.push(PIXI.Texture.fromFrame(frameId));

      i++;
      frameId = base + '##' + i + "." + ext;
    }

    return new PIXI.extras.AnimatedSprite(frames);
  }
}