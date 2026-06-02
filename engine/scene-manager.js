class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.scenes = new Map();
        this.currentScene = null;
    }

    createScene(name) {
        if (this.scenes.has(name)) {
            console.warn(`Scene '${name}' already exists`);
            return this.scenes.get(name);
        }

        const scene = {
            name: name,
            gameObjects: []
        };

        this.scenes.set(name, scene);
        return scene;
    }

    loadScene(name) {
        if (!this.scenes.has(name)) {
            console.error(`Scene '${name}' not found`);
            return false;
        }

        if (this.currentScene) {
            this.currentScene.gameObjects.forEach(obj => {
                this.engine.removeGameObject(obj);
            });
        }

        this.currentScene = this.scenes.get(name);
        
        this.currentScene.gameObjects.forEach(obj => {
            this.engine.addGameObject(obj);
        });

        return true;
    }

    getCurrentScene() {
        return this.currentScene;
    }

    addObjectToScene(obj, sceneName = null) {
        const scene = sceneName ? this.scenes.get(sceneName) : this.currentScene;
        if (!scene) return false;

        if (!scene.gameObjects.includes(obj)) {
            scene.gameObjects.push(obj);
        }
        return true;
    }

    saveSceneToJSON(sceneName = null) {
        const scene = sceneName ? this.scenes.get(sceneName) : this.currentScene;
        if (!scene) return null;

        return {
            name: scene.name,
            gameObjects: scene.gameObjects.map(obj => obj.toJSON())
        };
    }
}