export class AABB {
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(minX: number, minY: number, maxX: number, maxY: number) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    collides(other: AABB): boolean {
        return this.minX < other.maxX &&
            this.maxX > other.minX &&
            this.minY < other.maxY &&
            this.maxY > other.minY;
    }
}