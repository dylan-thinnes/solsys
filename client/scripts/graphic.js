// RenderClock is an instance of the Timer class. It tells the renderer how much time has elapsed to keep track of planetary movements.
var RenderClock = new Timer();
RenderClock.start();

Randomizer = new (function () {
	var generator = null;
	this.seed = "";
	this.setSeed = function (newSeed) {
		generator = xor4096(newSeed);
	}
	this.random = function () {return generator();}
})();

// The Graphics class handles....
Graphics = function(width, height, backgroundNode, graphicsNode){
    this.backgroundScene = new THREE.Scene();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 10000);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.backgroundRenderer = new THREE.WebGLRenderer();
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.opacity = "0";
    backgroundNode.appendChild(this.backgroundRenderer.domElement);
    graphicsNode.appendChild(this.renderer.domElement);
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("resize", this.setSize.bind(this));
    this.camera.position.set(0, 0, 1);

    this.sunMaterials = [];
    this.planetMaterials = [];
    this.ringMaterials = [];
    this.blackholeMaterials = [];
    this.orbitPathMaterial = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
    this.orbitPathGeometry = new THREE.Geometry();
    var orbitSegments = 256;
    for(var i = 0; i < orbitSegments; i++){
        this.orbitPathGeometry.vertices.push(new THREE.Vector3(Math.cos(i * (2 * Math.PI / orbitSegments)), Math.sin(i * (2 * Math.PI / orbitSegments)), 0));
    }

    this.rootGroup = new THREE.Group();
    this.rootGroup.rotation.set(Math.PI / 2, 0, 0);
    this.scene.add(this.rootGroup);
    this.solSys = {};
    this.nextSolSys = {};
    this.firstSystem = true;
    this.setSize();
    this.fade = 0;
    this.selectedPlanet = null;
}

// The loadMaterials function is used to load the materials and textures for planets and objects in the scene
Graphics.prototype.loadMaterials = function(progress) {
    var sunJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4, SVGTOJS.planet5]; //Add sun JSVGs
    var planetJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4, SVGTOJS.planet5];
    var ringJSVGs = [SVGTOJS.ring1, SVGTOJS.ring2, SVGTOJS.ring3, SVGTOJS.ring4];
    var blackholeJSVGs = [SVGTOJS.blackholeGrey];
    var blackholeDarks = ["#849999", "#c8a68b", "#a881b3", "#759275"];
    var blackholeMediums = ["#b9cccc", "#eed4bd", "#c8b5cd", "#a8c4a8"];
    var blackholeBrights = ["#e7ffff", "#fff1e5", "#e5d2ea", "#c1d4c1"];
    var primaryColors = ["#00ccff", "#0088aa", "#000080", "#00aad4", "#0000ff", "#0088aa", "#aa0044", "#deaa87", "#003380", "#2c2ca0", "#deaa87", "#0088aa"];
    var secondaryColors = ["#c87137", "#008000", "#c87137", "#008033", "#550000", "#217844", "#d35f8d", "#d45500", "#aa87de", "#aaccff", "#aa4400", "#b7c8c4"];
    var ringColors = ["#d40000", "#00f", "#c0f", "#00d400"]; // in groups of 4
    progress.init(sunJSVGs.length * primaryColors.length/*<----TEMPORARY UNTIL SUN SPRITES*/ + planetJSVGs.length * primaryColors.length + ringJSVGs.length * ringColors.length / 4 + blackholeJSVGs.length * blackholeBrights.length);
    for(var i = 0; i < sunJSVGs.length; i++){
        for(var j = 0; j < primaryColors.length; j++){
            let canvas = document.createElement("canvas");
            canvas.style.display = "none";
            canvas.width = 1024;
            canvas.height = 1024;
            ctx = canvas.getContext("2d");
            sunJSVGs[i](ctx, 10.24, 10.24, primaryColors[j], secondaryColors[j]);
            let texture = new THREE.Texture(canvas);
	        texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({map: texture});
            material.depthTest = false;
            this.sunMaterials.push(material);
            progress.finishTask();
        }
    }
    for(var i = 0; i < planetJSVGs.length; i++){
        for(var j = 0; j < primaryColors.length; j++){
            let canvas = document.createElement("canvas");
            canvas.style.display = "none";
            canvas.width = 1024;
            canvas.height = 1024;
            ctx = canvas.getContext("2d");
            planetJSVGs[i](ctx, 10.24, 10.24, primaryColors[j], secondaryColors[j]);
            let texture = new THREE.Texture(canvas);
	        texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({map: texture});
            material.depthTest = false;
            this.planetMaterials.push(material);
            progress.finishTask();
        }
    }
    for(var i = 0; i < ringJSVGs.length; i++){
        for(var j = 0; j < ringColors.length; j += 4){
            let canvas = document.createElement("canvas");
            canvas.style.display = "none";
            canvas.width = 2048;
            canvas.height = 2048;
            ctx = canvas.getContext("2d");
            ringJSVGs[i](ctx, 20.48 / 3, 20.48 / 3, ringColors[j], ringColors[j + 1], ringColors[j + 2], ringColors[j + 3]);
            let texture = new THREE.Texture(canvas);
	        texture.needsUpdate = true;
            texture.offset.y = -0.0008;
            let front = new THREE.SpriteMaterial({map: texture});
            front.depthTest = false;
            let back = front.clone();
            back.rotation = Math.PI;
            this.ringMaterials.push([front, back]);
            progress.finishTask();
        }
    }
    for(var i = 0; i < blackholeJSVGs.length; i++){
        for (var j = 0; j < blackholeBrights.length; j++) {
            let canvas = document.createElement("canvas");
            canvas.style.display = "none";
            canvas.width = 1024;
            canvas.height = 1024;
            ctx = canvas.getContext("2d");
            blackholeJSVGs[i](ctx, 10.24, 10.24, blackholeDarks[j], blackholeMediums[j], blackholeBrights[j]);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            let material = new THREE.SpriteMaterial({map: texture});
            material.needsUpdate = true;
            material.depthTest = false;
            this.blackholeMaterials.push(material);
            progress.finishTask();
        }
    }
}

// The genStars function is used to randomly generate stars
Graphics.prototype.genStars = function(){
    var starsColours = [0x774444, 0x447744, 0x444477, 0x777744, 0x774477, 0x447777];
    var starsGeometries = [];
    var starsMaterials = [];
    for (var ii = 0; ii < starsColours.length; ii++) {
        starsGeometries[ii] = new THREE.Geometry();
        starsMaterials[ii] = new THREE.PointsMaterial({color: starsColours[ii], size: 2, sizeAttenuation: false});
    }
    for (var ii = 0; ii < 2000; ii++) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(10000);
        star.y = THREE.Math.randFloatSpread(10000);
        star.z = THREE.Math.randFloatSpread(10000);
        starsGeometries[ii % starsColours.length].vertices.push(star);
    }
    var starsFields = [];
    for (var ii = 0; ii < starsColours.length; ii++) {
        starsFields[ii] = new THREE.Points(starsGeometries[ii], starsMaterials[ii]);
        this.backgroundScene.add(starsFields[ii]);
    }
}

// The genPlanets function is used to generate the planets of the solar system
Graphics.prototype.genPlanets = function(system){
    if(this.firstSystem){
        this.firstSystem = false;
        this.fade = 1;
        this.solSys = system;
        for(var i = 0; i < this.rootGroup.children.length; i++){
            this.rootGroup.remove(this.rootGroup.children[i]);
        }
        this.addPlanets(this.solSys, this.rootGroup);
        this.update();
	Controls.reset();
	Controls.setScale(this.solSys.width * 1.8);
        Controls.update();
    } else{
        this.fade = -1;
        this.nextSolSys = system;
    }
}

// The addPlanets function is used to add the planets of the solSys object to the threejs scene
Graphics.prototype.addPlanets = function(planet, parentGroup){
    // Set random speed and rings
    planet.ring = Math.floor(Randomizer.random() * 10) === 0;
    planet.speed = 0.5 * Randomizer.random();
    // Create orbit group
    var orbitGroup = new THREE.Group();
    orbitGroup.rotation.set(Math.floor(Randomizer.random() * 2 * Math.PI), Math.floor(Randomizer.random() * 2 * Math.PI), Math.floor(Randomizer.random() * 2 * Math.PI));
    planet.orbitGroup = orbitGroup;
    // Create sprite group
    var spriteGroup = new THREE.Group();
    planet.spriteGroup = spriteGroup;
    // Create front ring
    if(planet.ring && planet.type !== 0){
        var ringScale = new THREE.Matrix4();
        ringScale.makeScale(planet.scale * 3, planet.scale * 3, 1); // Maybe change this
        var ringIndex = Math.floor(Randomizer.random() * this.ringMaterials.length);
        var ringSpriteBack = new THREE.Sprite(this.ringMaterials[ringIndex][0]);
        ringSpriteBack.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteBack);
    }
    // Create planet sprite
    var planetScale = new THREE.Matrix4();
    planetScale.makeScale(planet.scale, planet.scale, 1);
    var planetSprite;
    if(parentGroup === this.rootGroup){ // Sun
        planetSprite = new THREE.Sprite(this.sunMaterials[Math.floor(Randomizer.random() * this.sunMaterials.length)]);
    } else if(planet.type === 0){ // Blackhole
        planetScale.makeScale(planet.scale / 1.5, planet.scale / 1.5, 1);
        planetSprite = new THREE.Sprite(this.blackholeMaterials[Math.floor(Randomizer.random() * this.blackholeMaterials.length)]);
    } else{ // Ordinary planet
        planetSprite = new THREE.Sprite(this.planetMaterials[Math.floor(Randomizer.random() * this.planetMaterials.length)]);
    }
    planetSprite.applyMatrix(planetScale);
    planetSprite.material.rotation = Randomizer.random() * Math.PI * 2;
    spriteGroup.add(planetSprite);
    // Create back ring
    if(planet.ring && planet.type !== 0){
        ringScale.makeScale(-planet.scale * 3, planet.scale * 3, 1);
        var ringSpriteFront = new THREE.Sprite(this.ringMaterials[ringIndex][1]);
        ringSpriteFront.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteFront);
    }
    // Create planet orbit path
    var orbitPath = new THREE.LineLoop(this.orbitPathGeometry, this.orbitPathMaterial);
    var orbitPathScale = new THREE.Matrix4();
    orbitPathScale.makeScale(planet.orbitRadius, planet.orbitRadius, 1);
    orbitPath.applyMatrix(orbitPathScale);
    orbitGroup.add(orbitPath, spriteGroup);
    // Add to parent planet
    parentGroup.add(orbitGroup);
    // Add planet children
    if(planet.children){
        for(var i = 0; i < planet.children.length; i++){
            this.addPlanets(planet.children[i], orbitGroup);
        }
    }
}

Graphics.prototype.onMouseMove = function(event){
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// The setSize function is used to resize the renderer and camera with the given width and height
Graphics.prototype.setSize = function (width, height) {
    if (isNaN(width) || isNaN(height)) {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    this.backgroundRenderer.setSize(width, height);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
}

// The updatePlanets function updates the positions of the planets of the solSys object
Graphics.prototype.updatePlanets = function(planet, parentPosition){
    planet.spriteGroup.position.set(Math.cos(RenderClock.getElapsedSeconds() * planet.speed) * planet.orbitRadius, Math.sin(RenderClock.getElapsedSeconds() * planet.speed) * planet.orbitRadius, 0);
    planet.orbitGroup.position.set(parentPosition.x, parentPosition.y, parentPosition.z);
    if(planet.children){
        for(var i = 0; i < planet.children.length; i++){
            this.updatePlanets(planet.children[i], planet.spriteGroup.position);
        }
    }
}

// The update function updates the elements of the Graphics object
Graphics.prototype.update = function(){
    if(!this.firstSystem){
        this.updatePlanets(this.solSys, this.solSys.spriteGroup.position);
    }
    if(this.fade < 0){
        this.renderer.domElement.style.opacity = (Number(this.renderer.domElement.style.opacity) - 0.03).toString();
        if(Number(this.renderer.domElement.style.opacity) <= 0){
            this.renderer.domElement.style.opacity = "0";
            this.fade = 1;
            this.solSys = this.nextSolSys;
            for(var i = 0; i < this.rootGroup.children.length; i++){
                this.rootGroup.remove(this.rootGroup.children[i]);
            }
            this.addPlanets(this.solSys, this.rootGroup);
            this.update();
	    Controls.reset();
	    Controls.setScale(this.solSys.width * 1.8);
            Controls.update();
        }
    } else if(this.fade > 0){
        this.renderer.domElement.style.opacity = (Number(this.renderer.domElement.style.opacity) + 0.03).toString();
        if(Number(this.renderer.domElement.style.opacity) >= 1){
            this.renderer.domElement.style.opacity = "1";
            this.fade = 0;
        }
    }
    this.raycaster.setFromCamera(this.mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if(intersects.length > 0){
        for(var index in intersects){
            if(intersects[index].object.type === "Sprite"){
                if(this.selectedPlanet != intersects[index].object){
                    this.selectedPlanet = intersects[index].objeect;
                    console.log("selected");
                }
                break;
            }
        }
    } else{
        this.selectedPlanet = null;
        //console.log("deselected");
    }
}

// The render function renders the elements of the Graphics object
Graphics.prototype.render = function(){
    this.backgroundRenderer.render(this.backgroundScene, this.camera);
    this.renderer.render(this.scene, this.camera);
}

// An object that keeps state of the progress in loading the page
Progress = function () {
    this.listeners = {};
    this.finished = 0;
};
Progress.prototype = Object.create(Emitter.prototype);
Object.defineProperty(Progress.prototype, "percent", {
	"get": function () {
		return Math.floor(this.finished / this.total * 1000) / 10
	},
	"set": function () {}
});
Progress.prototype.init = function (total) {
	this.start = Date.now();
	this.total = total;
}
Progress.prototype.finishTask = function () {
	this.finished++;
	this.emit("finishTask", this.percent);
	if (this.finished === this.total) {
		this.emit("finishAll");
		this.end = Date.now();
	}
}

// The init function. Try to have as little logic in this as possible
function init () {
    Randomizer.setSeed("meow");
    Graphics = new Graphics(window.innerWidth, window.innerHeight, document.getElementById("graphics-background"), document.getElementById("graphics"));
    Controls = new THREE.OrbitControls(Graphics.camera, document.getElementById("mouse"));
    Graphics.genStars();
    progressBar = new Progress();
    progressBar.on("finishTask", console.log);
    progressBar.on("finishAll", console.log.bind(this, "progressBar done!"));
}

// The render function is the main render loop
var render = function(){
    requestAnimationFrame(render);
    var deltaTime = RenderClock.update();
    Graphics.update();
    Graphics.render();
}


