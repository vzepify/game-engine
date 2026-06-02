# 🎮 3D Game Engine

A lightweight, web-based 3D game engine built with Three.js that allows you to create fully playable games directly in your browser, with a built-in editor similar to PlayCanvas.

## Features

✨ **Editor Interface**
- Visual scene hierarchy
- Real-time inspector for editing properties
- Add/remove game objects
- Save/load scenes
- Built-in console

🎯 **Game Engine**
- Entity-Component System (ECS)
- Full 3D graphics with Three.js
- Physics simulation (gravity, collisions, rigidbodies)
- Input management (keyboard, mouse, touch)
- Component-based architecture
- Scene management

🔧 **Built-in Components**
- **Transform**: Position, rotation, scale
- **Rigidbody**: Physics, velocity, forces
- **BoxCollider**: Collision detection
- **Movement**: Speed-based movement
- **Animator**: Keyframe animation
- **Script**: Custom game logic
- **AudioSource**: Sound playback

📦 **Predefined Game Objects**
- Cube, Sphere, Plane, Cylinder, Pyramid
- Camera, Light

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/vzepify/game-engine.git
cd game-engine
```

### 2. Run Locally
```bash
# Python 3
python -m http.server 8000

# OR Node.js
npx http-server
```

Open: `http://localhost:8000`

### 3. Deploy to GitHub Pages
1. Push to GitHub
2. Settings > Pages
3. Deploy from branch: main
4. Access at: `https://yourusername.github.io/game-engine`

## Basic Usage

### Create Your First Game
1. Click **+ Add Object** in the left panel
2. Select an object type (Cube, Sphere, etc.)
3. Click object to select it
4. Edit properties in the Inspector (right panel)
5. Add components for functionality
6. Click **▶ Play** to test your game
7. Click **💾 Save** to save locally

### Adding Components
Select object → Inspector → **+ Add Component**

Available components:
- **Rigidbody**: Add physics
- **BoxCollider**: Add collision
- **Movement**: Player movement
- **Script**: Custom logic
- **Animator**: Animations
- **AudioSource**: Sound

### Writing Scripts

Add a Script component and write JavaScript:

```javascript
// Access: gameObject, deltaTime, engine, input

const speed = 5;
if (input.isKeyDown('ArrowUp')) {
    gameObject.position.z -= speed * deltaTime;
}
if (input.isKeyDown('ArrowDown')) {
    gameObject.position.z += speed * deltaTime;
}
```

## Keyboard Shortcuts

- **Ctrl+S** / **Cmd+S**: Save scene
- **Delete**: Delete selected object
- **Arrow Keys**: Game controls (in play mode)

## API Reference

### Adding Objects Programmatically

```javascript
const cube = new Cube('MyBox');
engine.addGameObject(cube);
```

### Components

```javascript
// Rigidbody
const rb = obj.addComponent(new Rigidbody(mass=1, useGravity=true));
rb.addForce(new THREE.Vector3(10, 0, 0));

// BoxCollider
obj.addComponent(new BoxCollider(width=1, height=1, depth=1));

// Movement
const move = obj.addComponent(new Movement(speed=5));
move.moveForward(10);
move.rotate(0, Math.PI/2, 0);

// Script
const script = obj.addComponent(new Script());
script.scriptCode = `console.log('Hello');`;
```

### Input

```javascript
engine.input.isKeyDown('ArrowUp')      // Check if key held
engine.input.isKeyPressed('Space')     // Check if just pressed
engine.input.getAxis()                 // Arrow keys: {x: -1..1, y: -1..1}
engine.input.getWASDAxis()            // WASD keys: {x: -1..1, y: -1..1}
```

## Example: Simple Game

```javascript
// Create player
const player = new Cube('Player');
player.setPosition(0, 5, 0);
engine.addGameObject(player);
player.addComponent(new Rigidbody(1, true));
player.addComponent(new BoxCollider(1, 2, 1));

// Add movement script
const script = player.addComponent(new Script());
script.scriptCode = `
    const speed = 10;
    if (input.isKeyDown('ArrowLeft')) {
        gameObject.position.x -= speed * deltaTime;
    }
    if (input.isKeyDown('ArrowRight')) {
        gameObject.position.x += speed * deltaTime;
    }
`;

// Create ground
const ground = new Plane('Ground', 50, 50);
engine.addGameObject(ground);
ground.addComponent(new Rigidbody(0, false, true));
```

## Performance

- Optimized for small to medium games
- Real-time FPS/triangle counter
- Reasonable performance on modern browsers

## Troubleshooting

**Physics not working?**
- Ensure Rigidbody is added
- Check useGravity is enabled

**Game running slow?**
- Check object count in stats
- Reduce triangle count

**Script errors?**
- Check browser console
- Verify variable names

## License

MIT - Free to use for any project!

---

**Happy Game Development! 🚀**