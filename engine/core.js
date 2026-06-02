class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        
        this.gameObjects = [];
        this.running = true;
        this.isPlaying = false;
        this.deltaTime = 0;
        this.lastTime = Date.now();
        this.frameCount = 0;
        this.fps = 0;
        
        this.input = new InputManager();
        this.physics = new Physics();
        this.sceneManager = new SceneManager(this);
        
        // Camera controls
        this.cameraControls = {
            moveSpeed: 0.1,
            rotateSpeed: 0.01,
            isRotating: false,
            lastX: 0,
            lastY: 0
        };
        
        this.setupLighting();
        this.setupHandlers();
        this.startGameLoop();
    }

    setupLighting() {
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -100;
        dirLight.shadow.camera.right = 100;
        dirLight.shadow.camera.top = 100;
        dirLight.shadow.camera.bottom = -100;
        this.scene.add(dirLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const gridHelper = new THREE.GridHelper(50, 50, 0x444, 0x222);
        this.scene.add(gridHelper);
    }

    setupHandlers() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (e) => {
            this.input.onKeyDown(e);
            this.handleCameraInput(e);
        });
        window.addEventListener('keyup', (e) => this.input.onKeyUp(e));
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
                this.cameraControls.isRotating = true;
                this.cameraControls.lastX = e.clientX;
                this.cameraControls.lastY = e.clientY;
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.cameraControls.isRotating && !this.isPlaying) {
                const deltaX = e.clientX - this.cameraControls.lastX;
                const deltaY = e.clientY - this.cameraControls.lastY;
                
                this.camera.position.applyAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    -deltaX * this.cameraControls.rotateSpeed
                );
                
                const up = new THREE.Vector3(0, 1, 0);
                const right = new THREE.Vector3();
                this.camera.getWorldDirection(right);
                right.cross(up).normalize();
                
                this.camera.position.applyAxisAngle(
                    right,
                    -deltaY * this.cameraControls.rotateSpeed
                );
                
                this.camera.lookAt(0, 0, 0);
                
                this.cameraControls.lastX = e.clientX;
                this.cameraControls.lastY = e.clientY;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.cameraControls.isRotating = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            if (!this.isPlaying) {
                e.preventDefault();
                const direction = this.camera.position.clone().normalize();
                const distance = this.camera.position.length();
                const newDistance = Math.max(2, Math.min(100, distance + e.deltaY * 0.01));
                this.camera.position.copy(direction.multiplyScalar(newDistance));
                this.camera.lookAt(0, 0, 0);
            }
        }, { passive: false });
    }

    handleCameraInput(e) {
        if (this.isPlaying) return;
        
        const moveSpeed = 0.5;
        
        if (e.key === 'w' || e.key === 'W') {
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
            this.camera.position.addScaledVector(forward, moveSpeed);
        }
        if (e.key === 's' || e.key === 'S') {
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
            this.camera.position.addScaledVector(forward, -moveSpeed);
        }
        if (e.key === 'a' || e.key === 'A') {
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
            this.camera.position.addScaledVector(right, -moveSpeed);
        }
        if (e.key === 'd' || e.key === 'D') {
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
            this.camera.position.addScaledVector(right, moveSpeed);
        }
        if (e.key === ' ') {
            e.preventDefault();
            this.camera.position.y += moveSpeed;
        }
        if (e.key === 'Shift') {
            this.camera.position.y -= moveSpeed;
        }
        
        this.camera.lookAt(0, 0, 0);
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        this.scene.add(gameObject.mesh);
        return gameObject;
    }

    removeGameObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
            this.scene.remove(gameObject.mesh);
        }
    }

    findGameObject(id) {
        return this.gameObjects.find(obj => obj.id === id);
    }

    getAllGameObjects() {
        return this.gameObjects;
    }

    update() {
        this.deltaTime = (Date.now() - this.lastTime) / 1000;
        this.lastTime = Date.now();

        this.gameObjects.forEach(obj => {
            if (obj.enabled) {
                obj.update(this.deltaTime, this);
                
                obj.components.forEach(comp => {
                    if (comp.enabled && comp.update) {
                        comp.update(this.deltaTime, this);
                    }
                });
            }
        });

        if (this.isPlaying) {
            this.physics.update(this.gameObjects, this.deltaTime);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    startGameLoop() {
        const gameLoop = () => {
            this.update();
            this.render();
            this.updateStats();

            if (this.running) {
                requestAnimationFrame(gameLoop);
            }
        };
        gameLoop();
    }

    updateStats() {
        this.frameCount++;
        const currentTime = Date.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            
            if (document.getElementById('fps')) {
                document.getElementById('fps').textContent = this.fps;
                document.getElementById('objectCount').textContent = this.gameObjects.length;
                
                let triangles = 0;
                this.gameObjects.forEach(obj => {
                    if (obj.mesh.geometry) {
                        triangles += obj.mesh.geometry.attributes.position.count / 3;
                    }
                });
                document.getElementById('triangles').textContent = Math.floor(triangles);
            }
        }
    }

    play() {
        this.isPlaying = true;
        console.log('▶️ Game is now playing!');
    }

    stop() {
        this.isPlaying = false;
        console.log('⏹️ Game stopped!');
    }

    dispose() {
        this.running = false;
        this.renderer.dispose();
    }
}

const engineConsole = {
    logs: [],
    
    log(message) {
        const entry = {
            type: 'info',
            message: String(message),
            time: new Date().toLocaleTimeString()
        };
        this.logs.push(entry);
        this.updateUI();
    },
    
    error(message) {
        const entry = {
            type: 'error',
            message: String(message),
            time: new Date().toLocaleTimeString()
        };
        this.logs.push(entry);
        this.updateUI();
    },
    
    warn(message) {
        const entry = {
            type: 'warning',
            message: String(message),
            time: new Date().toLocaleTimeString()
        };
        this.logs.push(entry);
        this.updateUI();
    },
    
    updateUI() {
        const consoleEl = document.getElementById('console');
        if (!consoleEl) return;
        consoleEl.innerHTML = '';
        this.logs.slice(-20).forEach(entry => {
            const div = document.createElement('div');
            div.className = `console-entry console-${entry.type}`;
            div.textContent = `[${entry.time}] ${entry.message}`;
            consoleEl.appendChild(div);
        });
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }
};

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (msg) => {
    originalLog(msg);
    engineConsole.log(msg);
};

console.error = (msg) => {
    originalError(msg);
    engineConsole.error(msg);
};

console.warn = (msg) => {
    originalWarn(msg);
    engineConsole.warn(msg);
};
