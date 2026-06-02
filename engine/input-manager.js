class InputManager {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseDown = false;
    }

    onKeyDown(event) {
        const key = event.key;
        if (!this.keys[key]) {
            this.keysPressed[key] = true;
        }
        this.keys[key] = true;
    }

    onKeyUp(event) {
        const key = event.key;
        this.keys[key] = false;
        this.keysReleased[key] = true;
        
        setTimeout(() => {
            this.keysReleased[key] = false;
        }, 0);
    }

    isKeyDown(key) {
        return this.keys[key] === true;
    }

    isKeyPressed(key) {
        return this.keysPressed[key] === true;
    }

    isKeyReleased(key) {
        return this.keysReleased[key] === true;
    }

    getAxis() {
        let x = 0;
        let y = 0;

        if (this.isKeyDown('ArrowRight')) x = 1;
        if (this.isKeyDown('ArrowLeft')) x = -1;
        if (this.isKeyDown('ArrowUp')) y = 1;
        if (this.isKeyDown('ArrowDown')) y = -1;

        return { x, y };
    }

    getWASDAxis() {
        let x = 0;
        let y = 0;

        if (this.isKeyDown('w') || this.isKeyDown('W')) y = 1;
        if (this.isKeyDown('s') || this.isKeyDown('S')) y = -1;
        if (this.isKeyDown('a') || this.isKeyDown('A')) x = -1;
        if (this.isKeyDown('d') || this.isKeyDown('D')) x = 1;

        return { x, y };
    }
}