class Player {
	constructor({ position, radius, color, username }) {
		this.position = position;
		this.radius = radius;
		this.color = color;
		this.username = username;
	}

	draw() {
		ctx.font = '12px sans-serif';
		ctx.fillStyle = 'white';
		ctx.fillText(this.username, this.position.x - 5, this.position.y + 25);
		ctx.save();

		ctx.shadowColor = this.color;
		ctx.shadowBlur = 20;

		ctx.beginPath();
		ctx.arc(
			this.position.x,
			this.position.y,
			this.radius * window.devicePixelRatio,
			0,
			Math.PI * 2,
			false,
		);
		ctx.fillStyle = this.color;
		ctx.fill();

		ctx.restore();
	}
}
