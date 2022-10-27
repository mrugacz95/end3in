import { Vec2 } from "./Vector";

export class Utils {
    static randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static closestPointOnSegment(point: Vec2, a: Vec2, b: Vec2): Vec2 {
        const ab = b.sub(a)
        const ap = point.sub(a)
        const proj = ab.dot(ap)
        const abLenSq = ab.magnitude()
        const d = proj / abLenSq

        let closestPoint: Vec2

        if (d <= 0) {
            closestPoint = a
        } else if (d >= 1) {
            closestPoint = b
        } else {
            closestPoint = a.add(ab.scale(d))
        }
        return closestPoint
    }

    static isCloseTo(a: number, b: number,): boolean {
        return Math.abs(b - a) < 0.0005
    }
}