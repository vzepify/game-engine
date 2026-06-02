class Editor {
    constructor() {
        this.engine = new GameEngine('viewport');
        this.selectedObject = null;
        this.selectedObjectId = null;
        
        this.engine.sceneManager.createScene('Default Scene');
        this.engine.sceneManager.loadScene('Default Scene');
        
        this.updateHierarchy();
        this.setupEventListeners();
        
        console.log('Editor initialized');
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveScene();
                }
            }
            if (e.key === 'Delete') {
                if (this.selectedObject) {
                    this.deleteObject(this.selectedObject);
                }
            }
        });
    }

    addObject(type) {
        let obj;

        switch (type) {
            case 'cube':
                obj = new Cube();
                break;
            case 'sphere':
                obj = new Sphere();
                break;
            case 'plane':
                obj = new Plane();
                break;
            case 'cylinder':
                obj = new Cylinder();
                break;
            case 'pyramid':
                obj = new Pyramid();
                break;
            case 'camera':
                obj = new CameraObject();
                break;
            case 'light':
                obj = new Light();
                break;
            default:
                obj = new GameObject('GameObject');
        }

        this.engine.addGameObject(obj);
        this.engine.sceneManager.addObjectToScene(obj);
        this.updateHierarchy();
        
        document.getElementById('addObjectModal').classList.remove('active');
        
        return obj;
    }

    selectObject(id) {
        this.selectedObjectId = id;
        this.selectedObject = this.engine.findGameObject(id);
        this.updateHierarchy();
        this.updateInspector();
    }

    deleteObject(obj) {
        if (obj) {
            obj.destroy(this.engine);
            this.engine.sceneManager.removeObjectFromScene = (o) => {
                const scene = this.engine.sceneManager.currentScene;
                const index = scene.gameObjects.indexOf(o);
                if (index > -1) scene.gameObjects.splice(index, 1);
            };
            this.engine.sceneManager.removeObjectFromScene(obj);
            this.selectedObject = null;
            this.selectedObjectId = null;
            this.updateHierarchy();
            this.updateInspector();
        }
    }

    updateHierarchy() {
        const hierarchyEl = document.getElementById('hierarchy');
        hierarchyEl.innerHTML = '';

        this.engine.gameObjects.forEach(obj => {
            const item = document.createElement('div');
            item.className = 'tree-item';
            if (this.selectedObjectId === obj.id) {
                item.classList.add('selected');
            }

            const icon = obj.isCamera ? '📷' : obj instanceof Light ? '💡' : '📦';
            item.textContent = `${icon} ${obj.name}`;
            item.onclick = () => this.selectObject(obj.id);

            hierarchyEl.appendChild(item);
        });
    }

    updateInspector() {
        const inspectorEl = document.getElementById('inspector');
        inspectorEl.innerHTML = '';

        if (!this.selectedObject) {
            inspectorEl.innerHTML = '<div class="panel-title">Select an object to edit</div>';
            return;
        }

        const transformSection = document.createElement('div');
        transformSection.className = 'inspector-section';
        transformSection.innerHTML = `
            <div class="inspector-header">Transform</div>
            <div class="inspector-content">
                <div class="property">
                    <div class="property-label">Position</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
                        <input type="number" step="0.1" value="${this.selectedObject.position.x.toFixed(2)}" 
                            onchange="editor.selectedObject.position.x = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.position.y.toFixed(2)}" 
                            onchange="editor.selectedObject.position.y = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.position.z.toFixed(2)}" 
                            onchange="editor.selectedObject.position.z = parseFloat(this.value)">
                    </div>
                </div>
                <div class="property">
                    <div class="property-label">Rotation</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
                        <input type="number" step="0.1" value="${this.selectedObject.rotation.x.toFixed(2)}" 
                            onchange="editor.selectedObject.rotation.x = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.rotation.y.toFixed(2)}" 
                            onchange="editor.selectedObject.rotation.y = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.rotation.z.toFixed(2)}" 
                            onchange="editor.selectedObject.rotation.z = parseFloat(this.value)">
                    </div>
                </div>
                <div class="property">
                    <div class="property-label">Scale</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
                        <input type="number" step="0.1" value="${this.selectedObject.scale.x.toFixed(2)}" 
                            onchange="editor.selectedObject.scale.x = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.scale.y.toFixed(2)}" 
                            onchange="editor.selectedObject.scale.y = parseFloat(this.value)">
                        <input type="number" step="0.1" value="${this.selectedObject.scale.z.toFixed(2)}" 
                            onchange="editor.selectedObject.scale.z = parseFloat(this.value)">
                    </div>
                </div>
            </div>
        `;
        inspectorEl.appendChild(transformSection);

        const componentsSection = document.createElement('div');
        componentsSection.className = 'inspector-section';
        componentsSection.innerHTML = `
            <div class="inspector-header">Components</div>
            <div class="inspector-content" id="componentsList"></div>
        `;
        inspectorEl.appendChild(componentsSection);

        const componentsList = document.getElementById('componentsList');
        this.selectedObject.components.forEach((comp) => {
            const compDiv = document.createElement('div');
            compDiv.style.marginBottom = '10px';
            compDiv.style.padding = '8px';
            compDiv.style.background = '#2a2a2a';
            compDiv.style.borderRadius = '3px';
            
            let compHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${comp.constructor.name}</strong>
                    <button style="padding: 4px 8px; background: #ff6b6b; border: none; color: white; border-radius: 3px; cursor: pointer; font-size: 11px;">Remove</button>
                </div>
            `;

            if (comp instanceof Rigidbody) {
                compHTML += `
                    <div class="property"><label class="property-label">Mass</label><input type="number" value="${comp.mass}" onchange="editor.selectedObject.getComponent(Rigidbody).mass = parseFloat(this.value)"></div>
                    <div class="property"><label class="property-label"><input type="checkbox" ${comp.useGravity ? 'checked' : ''} onchange="editor.selectedObject.getComponent(Rigidbody).useGravity = this.checked"> Use Gravity</label></div>
                `;
            } else if (comp instanceof BoxCollider) {
                compHTML += `
                    <div class="property"><label class="property-label">Width</label><input type="number" step="0.1" value="${comp.width}" onchange="editor.selectedObject.getComponent(BoxCollider).width = parseFloat(this.value)"></div>
                    <div class="property"><label class="property-label">Height</label><input type="number" step="0.1" value="${comp.height}" onchange="editor.selectedObject.getComponent(BoxCollider).height = parseFloat(this.value)"></div>
                    <div class="property"><label class="property-label">Depth</label><input type="number" step="0.1" value="${comp.depth}" onchange="editor.selectedObject.getComponent(BoxCollider).depth = parseFloat(this.value)"></div>
                `;
            } else if (comp instanceof Script) {
                compHTML += `<div class="property"><textarea style="width: 100%; min-height: 100px; padding: 5px; background: #1a1a1a; border: 1px solid #333; color: #e0e0e0; border-radius: 3px; font-family: monospace; font-size: 11px;" onchange="editor.selectedObject.getComponent(Script).scriptCode = this.value">${comp.scriptCode}</textarea></div>`;
            }

            compDiv.innerHTML = compHTML;
            componentsList.appendChild(compDiv);
        });

        const addCompBtn = document.createElement('button');
        addCompBtn.textContent = '+ Add Component';
        addCompBtn.style.cssText = 'width: 100%; padding: 8px; background: #00a86b; border: none; color: white; border-radius: 3px; cursor: pointer; font-weight: 600;';
        addCompBtn.onclick = () => this.showAddComponentMenu();
        componentsList.appendChild(addCompBtn);
    }

    showAddObjectMenu() {
        document.getElementById('addObjectModal').classList.add('active');
    }

    showAddComponentMenu() {
        if (!this.selectedObject) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add Component</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button onclick="editor.selectedObject.addComponent(new Rigidbody()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Rigidbody</button>
                    <button onclick="editor.selectedObject.addComponent(new BoxCollider()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Box Collider</button>
                    <button onclick="editor.selectedObject.addComponent(new Movement()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Movement</button>
                    <button onclick="editor.selectedObject.addComponent(new Script()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Script</button>
                    <button onclick="editor.selectedObject.addComponent(new Animator()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Animator</button>
                    <button onclick="editor.selectedObject.addComponent(new AudioSource()); editor.updateInspector(); this.closest('.modal').remove();" class="tree-item-add">Audio</button>
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    playGame() {
        this.engine.play();
    }

    stopGame() {
        this.engine.stop();
    }

    saveScene() {
        const sceneData = this.engine.sceneManager.saveSceneToJSON();
        const json = JSON.stringify(sceneData, null, 2);
        localStorage.setItem('game-scene', json);
        console.log('Scene saved!');
    }

    loadScene() {
        const json = localStorage.getItem('game-scene');
        if (json) {
            const data = JSON.parse(json);
            console.log('Scene loaded!');
        }
    }

    exportGame() {
        const sceneData = this.engine.sceneManager.saveSceneToJSON();
        const json = JSON.stringify(sceneData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'game-scene.json';
        a.click();
        console.log('Game exported!');
    }
}

let editor;
window.addEventListener('load', () => {
    editor = new Editor();
});