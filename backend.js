const express = require('express');
const app = express();

// Socket.io - Setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Objects
const backendPlayers = {};
const backendProjectiles = {};

// Constants
const SPEED = 10;
const RADIUS = 10;
const PROJECTILE_RADIUS = 5;
let projectileId = 0;

// Socket.io - Connection
io.on('connection', (socket) => {
	// Socket.io - Init Game
	socket.on('initGame', ({ username, width, height, devicePixelRatio }) => {
		backendPlayers[socket.id] = {
			position: { x: width * Math.random(), y: height * Math.random() },
			radius: RADIUS,
			color: `hsl(${360 * Math.random()}, 100%, 50%)`,
			sequenceNumber: 0,
			score: 0,
			username,
		};

		console.log(`User connected -> ${username} <<${socket.id}>>`);

		// Init Canvas
		backendPlayers[socket.id].canvas = { width, height };
		backendPlayers[socket.id].radius = RADIUS;
		// if (devicePixelRatio > 1) backendPlayers[socket.id].radius = 2 * RADIUS;
	});

	// Socket.io - Update Players to All Clients
	io.emit('updatePlayers', backendPlayers);

	// Socket.io - Shoot
	socket.on('shoot', ({ playerPosition, angle }) => {
		projectileId++;
		const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };

		backendProjectiles[projectileId] = {
			playerId: socket.id,
			position: playerPosition,
			radius: PROJECTILE_RADIUS,
			velocity,
		};
	});

	// Socket.io - Disconnection
	socket.on('disconnect', (reason) => {
		console.log(
			`User disconnected ->  ${backendPlayers[socket.id]?.username} <<${
				socket.id
			}>> , || Reason: ${reason}`,
		);
		delete backendPlayers[socket.id];
		// Socket.io - Update Players to All Clients
		io.emit('updatePlayers', backendPlayers);
	});

	// Socket.io - Keydown
	socket.on('keydown', ({ keycode, sequenceNumber }) => {
		const player = backendPlayers[socket.id];
		if (!player) return;

		player.sequenceNumber = sequenceNumber;

		switch (keycode) {
			case 'KeyW':
				player.position.y -= SPEED;
				break;
			case 'KeyA':
				player.position.x -= SPEED;
				break;
			case 'KeyS':
				player.position.y += SPEED;
				break;
			case 'KeyD':
				player.position.x += SPEED;
				break;
		}

		const playerSides = {
			left: player.position.x - player.radius,
			right: player.position.x + player.radius,
			top: player.position.y - player.radius,
			bottom: player.position.y + player.radius,
		};
		// Collision Detection
		if (playerSides.left < 0) player.position.x = player.radius;

		if (playerSides.right > player.canvas.width)
			player.position.x = player.canvas.width - player.radius;

		if (playerSides.top < 0) player.position.y = player.radius;

		if (playerSides.bottom > player.canvas.height)
			player.position.y = player.canvas.height - player.radius;
	});
});

// Backend Tick
setInterval(() => {
	for (const id in backendProjectiles) {
		// Update projectile positions
		backendProjectiles[id].position.x += backendProjectiles[id].velocity.x;
		backendProjectiles[id].position.y += backendProjectiles[id].velocity.y;

		// Remove projectiles that are out of bounds
		if (
			backendProjectiles[id].position.x - PROJECTILE_RADIUS >=
				backendPlayers[backendProjectiles[id].playerId]?.canvas?.width ||
			backendProjectiles[id].position.x + PROJECTILE_RADIUS <= 0 ||
			backendProjectiles[id].position.y - PROJECTILE_RADIUS >=
				backendPlayers[backendProjectiles[id].playerId]?.canvas?.height ||
			backendProjectiles[id].position.y + PROJECTILE_RADIUS <= 0
		) {
			delete backendProjectiles[id];
			continue;
		}

		// Remove projectiles that hit players
		for (const playerId in backendPlayers) {
			const player = backendPlayers[playerId];
			const distance = Math.hypot(
				backendProjectiles[id].position.x - player.position.x,
				backendProjectiles[id].position.y - player.position.y,
			);
			// Remove projectile and player, add score to player that shot the projectile
			if (
				distance < backendProjectiles[id].radius + player.radius &&
				backendProjectiles[id].playerId !== playerId
			) {
				if (backendPlayers[backendProjectiles[id].playerId])
					backendPlayers[backendProjectiles[id].playerId].score++;
				delete backendProjectiles[id];
				delete backendPlayers[playerId];
				break;
			}
		}
	}

	// Socket.io - Update Projectiles to All Clients
	io.emit('updateProjectiles', backendProjectiles);
	// Socket.io - Update Players to All Clients
	io.emit('updatePlayers', backendPlayers);
}, 15);

server.listen(port, () => {
	console.log(`Server listening on Port - ${port}`);
});
