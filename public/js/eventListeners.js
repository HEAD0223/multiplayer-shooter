window.addEventListener('click', (e) => {
	if (!frontendPlayers[socket.id]) return;

	const playerPosition = {
		x: frontendPlayers[socket.id].position.x,
		y: frontendPlayers[socket.id].position.y,
	};

	const angle = Math.atan2(
		e.clientY * window.devicePixelRatio - playerPosition.y,
		e.clientX * window.devicePixelRatio - playerPosition.x,
	);

	socket.emit('shoot', { playerPosition, angle });
});

window.addEventListener('keydown', (e) => {
	if (!frontendPlayers[socket.id]) return;

	switch (e.code) {
		case 'KeyW':
			keys.KeyW.pressed = true;
			break;
		case 'KeyA':
			keys.KeyA.pressed = true;
			break;
		case 'KeyS':
			keys.KeyS.pressed = true;
			break;
		case 'KeyD':
			keys.KeyD.pressed = true;
			break;
	}
});

window.addEventListener('keyup', (e) => {
	if (!frontendPlayers[socket.id]) return;

	switch (e.code) {
		case 'KeyW':
			keys.KeyW.pressed = false;
			break;
		case 'KeyA':
			keys.KeyA.pressed = false;
			break;
		case 'KeyS':
			keys.KeyS.pressed = false;
			break;
		case 'KeyD':
			keys.KeyD.pressed = false;
			break;
	}
});

document.querySelector('#usernameForm').addEventListener('submit', (e) => {
	e.preventDefault();
	// Username Validation
	const username = document.querySelector('#usernameInput').value;
	if (username.length < 4) return;

	// Socket.io - Init Game
	socket.emit('initGame', {
		username,
		width: canvas.width,
		height: canvas.height,
		devicePixelRatio,
	});

	// Hide Username Form
	document.querySelector('#usernameForm').style.display = 'none';
});
