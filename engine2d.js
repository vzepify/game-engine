class Engine2D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.running = true;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.fps = 0;
        this.gravity = 0.6;
        this.input = {};
        
        this.setupInput();
        this.start();
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.input[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.input[e.key] = false;
        });
    }

    addGameObject(obj) {
        this.gameObjects.push(obj);
    }

    update() {
        this.gameObjects.forEach(obj => {
            if (obj.update) obj.update(this.input, this);
            
            // Apply gravity
            if (obj.useGravity) {
                obj.velocityY += this.gravity;
                obj.y += obj.velocityY;
                
                // Floor collision
                if (obj.y + obj.height >= this.canvas.height) {
                    obj.y = this.canvas.height - obj.height;
                    obj.velocityY = 0;
                    obj.onGround = true;
                }
            }
        });
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.gameObjects.forEach(obj => {
            this.ctx.fillStyle = obj.color || '#00ff00';
            this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            
            if (obj.render) obj.render(this.ctx);
        });
    }

    start() {
        const gameLoop = () => {
            this.update();
            this.render();
            this.updateFPS();
            
            if (this.running) {
                requestAnimationFrame(gameLoop);
            }
        };
        gameLoop();
    }

    updateFPS() {
        this.frameCount++;
        const currentTime = Date.now();
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            document.getElementById('stats2d').textContent = `FPS: ${this.fps}`;
        }
    }

    stop() {
        this.running = false;
    }
}
