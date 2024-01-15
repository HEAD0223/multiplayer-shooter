# Multiplayer Shooter Game

![Multiplayer Shooter Game](https://img.shields.io/badge/Game-Multiplayer_Shooter-brightgreen)
[![Playable on Chrome](https://img.shields.io/badge/Playable%20on-Chrome-informational?logo=google-chrome)](http://localhost:3000/)

This web application is designed for a multiplayer shooter game using HTML5/Canvas. I created and implemented features such as shooting mechanics, random spawn, usernames, leaderboard. Immerse yourself in the PvP action by shooting with precision using your mouse.

## Table of Contents

-  [Folder Structure](#folder-structure)
-  [Usage](#usage)
-  [Gif](#gif)
-  [Contributing](#contributing)
-  [Dependencies](#dependencies)

## Folder Structure

-  **public:**
   -  **img:** Contains game-related assets such as images and gifs.
   -  **js:** JavaScript files for implementing game logic and interactions.
   -  **index.html:** The main HTML file that includes the Canvas element.
   -  **frontend.js:** Client-side JavaScript code.
-  **backend.js:** Server-side JavaScript code.

## Usage

1. Clone the repository:

```bash
git clone https://github.com/HEAD0223/multiplayer-shooter.git
cd multiplayer-shooter
```

2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm start
```

4. The server should be running on the specified port (default is 3000).

## Gif

![Multiplayer-Shooter](./public/img/Multiplayer-Shooter.gif)

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## Dependencies

-  **GSAP:** GreenSock Animation Platform for smooth and performant animations.
-  **Tailwind CSS:** A utility-first CSS framework.
-  **Socket.io:** A real-time communication library.
-  **Express:** A web application framework for Node.js.
-  **Nodemon:** A tool that helps in the development of Node.js-based applications by automatically restarting the server.

Make sure to include these dependencies in your project.
