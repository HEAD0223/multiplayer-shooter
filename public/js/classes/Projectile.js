class Projectile {
	constructor({ position, radius, color = 'white', velocity }) {
		this.position = position;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}

	draw() {
		ctx.save();

		ctx.shadowColor = this.color;
		ctx.shadowBlur = 15;

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();

		ctx.restore();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}
