class Player2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.color = '#00ff00';
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 3;
        this.jumpPower = 12;
        this.useGravity = true;
        this.onGround = false;
    }

    update(input, engine) {
        // Horizontal movement
        this.velocityX = 0;
        if (input['ArrowLeft']) this.x -= this.speed;
        if (input['ArrowRight']) this.x += this.speed;

        // Jumping
        if (input[' '] && this.onGround) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }

        // Boundary check
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > engine.canvas.width) this.x = engine.canvas.width - this.width;
    }
}

// Initialize 2D Engine
const engine2D = new Engine2D('canvas2d');
const player2D = new Player2D(185, 300);
engine2D.addGameObject(player2D);
