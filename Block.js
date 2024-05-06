export default class Block {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.size = size;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(this.x * this.size, this.y * this.size, this.width - 3, this.height - 3);
        ctx.closePath();
        ctx.fill();
    }
}