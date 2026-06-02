class Engine3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.width / this.canvas.height,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        
        this.gameObjects = [];
        this.running = true;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.fps = 0;
        this.input = {};
        
        this.setupInput();
        this.addLighting();
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

    addLighting() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    addGameObject(obj) {
        this.scene.add(obj.mesh);
        this.gameObjects.push(obj);
    }

    update() {
        const moveSpeed = 0.1;
        
        if (this.input['w'] || this.input['W']) this.camera.position.z -= moveSpeed;
        if (this.input['s'] || this.input['S']) this.camera.position.z += moveSpeed;
        if (this.input['a'] || this.input['A']) this.camera.position.x -= moveSpeed;
        if (this.input['d'] || this.input['D']) this.camera.position.x += moveSpeed;
        if (this.input[' ']) this.camera.position.y += moveSpeed;
        if (this.input['Shift']) this.camera.position.y -= moveSpeed;

        this.gameObjects.forEach(obj => {
            if (obj.update) obj.update(this.input, this);
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
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
            document.getElementById('stats3d').textContent = `FPS: ${this.fps}`;
        }
    }

    stop() {
        this.running = false;
    }
}
