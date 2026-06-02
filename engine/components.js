class Component {
    constructor() {
        this.gameObject = null;
        this.enabled = true;
    }

    onAdd() {}
    onRemove() {}
    onDestroy() {}
    update(deltaTime, engine) {}

    toJSON() {
        return {
            type: this.constructor.name,
            enabled: this.enabled
        };
    }
}

class Transform extends Component {
    constructor() {
        super();
    }

    setPosition(x, y, z) {
        this.gameObject.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.gameObject.rotation.set(x, y, z);
    }

    setScale(x, y, z) {
        this.gameObject.scale.set(x, y, z);
    }
}

class Rigidbody extends Component {
    constructor(mass = 1, useGravity = true, isKinematic = false) {
        super();
        this.mass = mass;
        this.useGravity = useGravity;
        this.isKinematic = isKinematic;
        this.velocity = new THREE.Vector3();
        this.angularVelocity = new THREE.Vector3();
        this.drag = 0.01;
        this.angularDrag = 0.01;
        this.constraints = {
            freezePositionX: false,
            freezePositionY: false,
            freezePositionZ: false
        };
    }

    addForce(force) {
        if (!this.isKinematic) {
            this.velocity.add(force.multiplyScalar(1 / this.mass));
        }
    }

    setVelocity(velocity) {
        this.velocity.copy(velocity);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            mass: this.mass,
            useGravity: this.useGravity,
            isKinematic: this.isKinematic,
            drag: this.drag
        };
    }
}

class BoxCollider extends Component {
    constructor(width = 1, height = 1, depth = 1, isTrigger = false) {
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.isTrigger = isTrigger;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            width: this.width,
            height: this.height,
            depth: this.depth,
            isTrigger: this.isTrigger
        };
    }
}

class Script extends Component {
    constructor(scriptName = '') {
        super();
        this.scriptName = scriptName;
        this.scriptCode = '';
    }

    update(deltaTime, engine) {
        if (!this.scriptCode) return;
        try {
            const func = new Function('gameObject', 'deltaTime', 'engine', 'input', this.scriptCode);
            func(this.gameObject, deltaTime, engine, engine.input);
        } catch (error) {
            console.error('Script error:', error.message);
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            scriptName: this.scriptName,
            scriptCode: this.scriptCode
        };
    }
}

class Movement extends Component {
    constructor(speed = 5, rotationSpeed = 2) {
        super();
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
    }

    moveForward(amount) {
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.gameObject.mesh.quaternion);
        this.gameObject.position.addScaledVector(forward, amount);
    }

    moveRight(amount) {
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.gameObject.mesh.quaternion);
        this.gameObject.position.addScaledVector(right, amount);
    }

    moveUp(amount) {
        this.gameObject.position.y += amount;
    }

    rotate(x, y, z) {
        this.gameObject.rotation.x += x;
        this.gameObject.rotation.y += y;
        this.gameObject.rotation.z += z;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            speed: this.speed,
            rotationSpeed: this.rotationSpeed
        };
    }
}

class Animator extends Component {
    constructor() {
        super();
        this.animations = new Map();
        this.currentAnimation = null;
        this.isPlaying = false;
    }

    addAnimation(name, keyframes) {
        this.animations.set(name, keyframes);
    }

    play(name, loop = false) {
        if (this.animations.has(name)) {
            this.currentAnimation = {
                name: name,
                keyframes: this.animations.get(name),
                loop: loop,
                time: 0
            };
            this.isPlaying = true;
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentAnimation = null;
    }
}

class AudioSource extends Component {
    constructor(audioUrl = '') {
        super();
        this.audioUrl = audioUrl;
        this.audio = new Audio(audioUrl);
        this.volume = 1;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        this.volume = volume;
        this.audio.volume = volume;
    }
}