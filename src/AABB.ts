export class AABB {
    private readonly minX: number;
    private readonly minY: number;
    private readonly maxX: number;
    private readonly maxY: number;

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