class Player3D {
    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.rotationSpeed = 0.05;
    }

    update(input, engine) {
        if (input['ArrowLeft']) this.mesh.rotation.y += this.rotationSpeed;
        if (input['ArrowRight']) this.mesh.rotation.y -= this.rotationSpeed;
        if (input['ArrowUp']) this.mesh.rotation.x += this.rotationSpeed;
        if (input['ArrowDown']) this.mesh.rotation.x -= this.rotationSpeed;
    }
}

// Initialize 3D Engine
const engine3D = new Engine3D('canvas3d');
const player3D = new Player3D();
engine3D.addGameObject(player3D);
