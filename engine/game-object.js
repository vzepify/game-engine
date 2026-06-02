class GameObject {
    static idCounter = 0;

    constructor(name = 'GameObject', geometry = null, material = null) {
        this.id = GameObject.idCounter++;
        this.name = name;
        this.enabled = true;
        this.components = [];
        
        if (geometry && material) {
            this.mesh = new THREE.Mesh(geometry, material);
        } else {
            this.mesh = new THREE.Group();
        }
        
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
        this.scale = this.mesh.scale;
        
        this.velocity = new THREE.Vector3();
        this.angularVelocity = new THREE.Vector3();
        this.mass = 1;
        this.useGravity = false;
        this.constraints = {};
    }

    addComponent(component) {
        component.gameObject = this;
        this.components.push(component);
        if (component.onAdd) {
            component.onAdd();
        }
        return component;
    }

    removeComponent(ComponentClass) {
        const index = this.components.findIndex(c => c instanceof ComponentClass);
        if (index > -1) {
            const component = this.components[index];
            if (component.onRemove) {
                component.onRemove();
            }
            this.components.splice(index, 1);
        }
    }

    getComponent(ComponentClass) {
        return this.components.find(c => c instanceof ComponentClass);
    }

    getAllComponents(ComponentClass) {
        return this.components.filter(c => c instanceof ComponentClass);
    }

    update(deltaTime, engine) {}

    setPosition(x, y, z) {
        this.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.rotation.set(x, y, z);
    }

    setScale(x, y = x, z = x) {
        this.scale.set(x, y, z);
    }

    clone() {
        const cloned = new GameObject(
            this.name + ' (Clone)',
            this.mesh.geometry?.clone(),
            this.mesh.material?.clone()
        );
        
        cloned.position.copy(this.position);
        cloned.rotation.copy(this.rotation);
        cloned.scale.copy(this.scale);
        cloned.useGravity = this.useGravity;
        cloned.mass = this.mass;
        
        return cloned;
    }

    destroy(engine) {
        this.components.forEach(comp => {
            if (comp.onDestroy) {
                comp.onDestroy();
            }
        });
        
        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }
        if (this.mesh.material) {
            if (Array.isArray(this.mesh.material)) {
                this.mesh.material.forEach(m => m.dispose());
            } else {
                this.mesh.material.dispose();
            }
        }
        
        engine.removeGameObject(this);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            enabled: this.enabled,
            position: this.position.toArray(),
            rotation: this.rotation.toArray(),
            scale: this.scale.toArray(),
            mass: this.mass,
            useGravity: this.useGravity,
            type: this.constructor.name,
            components: this.components.map(c => c.toJSON())
        };
    }
}

class Cube extends GameObject {
    constructor(name = 'Cube', size = 1) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00a86b,
            shininess: 100
        });
        super(name, geometry, material);
    }
}

class Sphere extends GameObject {
    constructor(name = 'Sphere', radius = 1, widthSegments = 32, heightSegments = 32) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00a86b,
            shininess: 100
        });
        super(name, geometry, material);
    }
}

class Plane extends GameObject {
    constructor(name = 'Plane', width = 10, height = 10) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        super(name, geometry, material);
        this.rotation.x = -Math.PI / 2;
    }
}

class Cylinder extends GameObject {
    constructor(name = 'Cylinder', radiusTop = 1, radiusBottom = 1, height = 2) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00a86b,
            shininess: 100
        });
        super(name, geometry, material);
    }
}

class Pyramid extends GameObject {
    constructor(name = 'Pyramid', size = 1, height = 2) {
        const geometry = new THREE.ConeGeometry(size, height, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00a86b,
            shininess: 100
        });
        super(name, geometry, material);
    }
}

class CameraObject extends GameObject {
    constructor(name = 'Camera') {
        super(name);
        this.isCamera = true;
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xffaa00,
            wireframe: false
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

class Light extends GameObject {
    constructor(name = 'Light', color = 0xffffff, intensity = 1) {
        super(name);
        this.lightObject = new THREE.DirectionalLight(color, intensity);
        this.lightObject.castShadow = true;
        this.lightObject.shadow.camera.left = -50;
        this.lightObject.shadow.camera.right = 50;
        this.lightObject.shadow.camera.top = 50;
        this.lightObject.shadow.camera.bottom = -50;
        this.mesh.add(this.lightObject);
        this.color = color;
        this.intensity = intensity;
    }

    setColor(color) {
        this.color = color;
        this.lightObject.color.setHex(color);
    }

    setIntensity(intensity) {
        this.intensity = intensity;
        this.lightObject.intensity = intensity;
    }
}