const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const socket = io();

// Resize Canvas
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;

const frontendPlayers = {};
const frontendProjectiles = {};

socket.on('updateProjectiles', (backendProjectiles) => {
	// Update frontendProjectiles that are in the Backend
	for (const id in backendProjectiles) {
		const backendProjectile = backendProjectiles[id];
		if (!frontendProjectiles[id]) {
			frontendProjectiles[id] = new Projectile({
				position: backendProjectile.position,
				radius: backendProjectile.radius,
				color: frontendPlayers[backendProjectile.playerId]?.color,
				velocity: backendProjectile.velocity,
			});
		} else {
			frontendProjectiles[id].position.x += backendProjectile.velocity.x;
			frontendProjectiles[id].position.y += backendProjectile.velocity.y;
		}
	}
	// Remove frontendProjectiles that are not in the Backend
	for (const id in frontendProjectiles) {
		if (!backendProjectiles[id]) {
			delete frontendProjectiles[id];
		}
	}
});

socket.on('updatePlayers', (backendPlayers) => {
	// Update frontendPlayers that are in the Backend
	for (const id in backendPlayers) {
		const backendPlayer = backendPlayers[id];
		if (!frontendPlayers[id]) {
			frontendPlayers[id] = new Player({
				position: { x: backendPlayer.position.x, y: backendPlayer.position.y },
				radius: backendPlayer.radius,
				color: backendPlayer.color,
				username: backendPlayer.username,
			});

			document.querySelector(
				'#playerLabels',
			).innerHTML += `<div data-id="${id}" data-score="${backendPlayer.score}">${backendPlayer.username}: ${backendPlayer.score}</div>`;
		} else {
			// Update player score
			document.querySelector(
				`div[data-id="${id}"]`,
			).innerHTML = `${backendPlayer.username}: ${backendPlayer.score}`;
			document
				.querySelector(`div[data-id="${id}"]`)
				.setAttribute('data-score', backendPlayer.score);

			// Sort player labels by score
			const parentDiv = document.querySelector('#playerLabels');
			const childDivs = Array.from(parentDiv.querySelectorAll('div'));

			childDivs.sort((a, b) => {
				const scoreA = Number(a.getAttribute('data-score'));
				const scoreB = Number(b.getAttribute('data-score'));

				return scoreB - scoreA;
			});

			// Remove all child divs and re-add them in order
			childDivs.forEach((div) => {
				parentDiv.removeChild(div);
			});
			childDivs.forEach((div) => {
				parentDiv.appendChild(div);
			});

			// Update player target
			frontendPlayers[id].target = {
				x: backendPlayer.position.x,
				y: backendPlayer.position.y,
			};

			if (id === socket.id) {
				// Update player position
				const lastBackendInputIndex = playerInputs.findIndex((input) => {
					return backendPlayer.sequenceNumber === input.sequenceNumber;
				});

				if (lastBackendInputIndex > -1) {
					playerInputs.splice(0, lastBackendInputIndex + 1);
				}

				playerInputs.forEach((input) => {
					frontendPlayers[id].target.x += input.dx;
					frontendPlayers[id].target.y += input.dy;
				});
			}
		}
	}
	// Remove frontendPlayers that are not in the Backend
	for (const id in frontendPlayers) {
		if (!backendPlayers[id]) {
			delete frontendPlayers[id];
			const divToDelete = document.querySelector(`div[data-id="${id}"]`);
			divToDelete.parentNode.removeChild(divToDelete);

			if (id === socket.id) {
				// If player is removed, show username form
				document.querySelector('#usernameForm').style.display = 'block';
			}
		}
	}
});

let animationId;
function animate() {
	animationId = requestAnimationFrame(animate);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (const id in frontendPlayers) {
		const frontendPlayer = frontendPlayers[id];

		// Player Interpolation
		if (frontendPlayer.target) {
			frontendPlayer.position.x += (frontendPlayer.target.x - frontendPlayer.position.x) * 0.5;
			frontendPlayer.position.y += (frontendPlayer.target.y - frontendPlayer.position.y) * 0.5;
		}

		frontendPlayer.draw();
	}

	for (const id in frontendProjectiles) {
		const frontendProjectile = frontendProjectiles[id];
		frontendProjectile.draw();
	}
}

animate();

const keys = {
	KeyW: { pressed: false },
	KeyA: { pressed: false },
	KeyS: { pressed: false },
	KeyD: { pressed: false },
};

const SPEED = 10;
const playerInputs = [];
let sequenceNumber = 0;
setInterval(() => {
	if (keys.KeyW.pressed) {
		sequenceNumber++;
		playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED });
		// frontendPlayers[socket.id].position.y -= SPEED;
		socket.emit('keydown', { keycode: 'KeyW', sequenceNumber });
	}

	if (keys.KeyA.pressed) {
		sequenceNumber++;
		playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 });
		// frontendPlayers[socket.id].position.x -= SPEED;
		socket.emit('keydown', { keycode: 'KeyA', sequenceNumber });
	}

	if (keys.KeyS.pressed) {
		sequenceNumber++;
		playerInputs.push({ sequenceNumber, dx: 0, dy: SPEED });
		// frontendPlayers[socket.id].position.y += SPEED;
		socket.emit('keydown', { keycode: 'KeyS', sequenceNumber });
	}

	if (keys.KeyD.pressed) {
		sequenceNumber++;
		playerInputs.push({ sequenceNumber, dx: SPEED, dy: 0 });
		// frontendPlayers[socket.id].position.x += SPEED;
		socket.emit('keydown', { keycode: 'KeyD', sequenceNumber });
	}
}, 15);
