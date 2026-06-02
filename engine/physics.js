class Physics {
    constructor() {
        this.gravity = new THREE.Vector3(0, -9.81, 0);
        this.groundLevel = 0;
    }

    update(gameObjects, deltaTime) {
        gameObjects.forEach(obj => {
            const rigidbody = obj.getComponent(Rigidbody);
            if (!rigidbody) return;

            if (rigidbody.isKinematic) return;

            if (rigidbody.useGravity) {
                rigidbody.velocity.add(this.gravity.clone().multiplyScalar(deltaTime));
            }

            rigidbody.velocity.multiplyScalar(Math.max(0, 1 - rigidbody.drag * deltaTime));

            if (!rigidbody.constraints.freezePositionX) {
                obj.position.x += rigidbody.velocity.x * deltaTime;
            }
            if (!rigidbody.constraints.freezePositionY) {
                obj.position.y += rigidbody.velocity.y * deltaTime;
            }
            if (!rigidbody.constraints.freezePositionZ) {
                obj.position.z += rigidbody.velocity.z * deltaTime;
            }

            if (obj.position.y <= this.groundLevel) {
                obj.position.y = this.groundLevel;
                rigidbody.velocity.y = 0;
            }
        });
    }
}