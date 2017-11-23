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
Graphics = function(width, height, graphicsNode){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer();
    graphicsNode.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.setSize.bind(this));
    this.camera.position.set(0, 0, 15);

    this.sunMaterials = [];
    this.planetMaterials = [];
    this.ringMaterials = [];
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
    this.systemExists = false;
    this.setSize();
}

// The loadMaterials function is used to load the materials and textures for planets and objects in the scene
Graphics.prototype.loadMaterials = function(progress) {
    var start = Date.now();
    var sunJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4]; //Add sun JSVGs
    var planetJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4];
    var ringJSVGs = []; // SVGTOJS.ring1, SVGTOJS.ring2, etc
    progress.init(sunJSVGs.length + planetJSVGs.length + ringJSVGs.length);
    var textureLoader = new THREE.TextureLoader();
    var canvas = document.getElementById("planetCanvas");
    var ctx = canvas.getContext("2d");
    for(var i = 0; i < sunJSVGs.length; i++){
	    sunJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        this.sunMaterials.push(material);
        progress.finishTask();
    }
    for(var i = 0; i < planetJSVGs.length; i++){
	    planetJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        this.planetMaterials.push(material);
        progress.finishTask();
    }
    for(var i = 0; i < ringJSVGs.length; i++){
		ringJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        this.ringMaterials.push(material);
        progress.finishTask();
    }
    canvas.parentNode.removeChild(canvas);
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
        this.scene.add(starsFields[ii]);
    }
}

// The genPlanets function is used to generate the planets of the solar system
Graphics.prototype.genPlanets = function(profile){
    this.systemExists = false;
    var blueprint = new Blueprint(profile);
    this.solSys = JSON.parse(JSON.stringify(blueprint.system));
    for(var i = 0; i < this.rootGroup.children.length; i++){
        this.rootGroup.remove(this.rootGroup.children[i]);
    }
    this.addPlanets(this.solSys, this.rootGroup);
    this.update();
    this.systemExists = true;
}

// The addPlanets function is used to add the planets of the solSys object to the threejs scene
Graphics.prototype.addPlanets = function(planet, parentGroup){
    // Create orbit group
    var orbitGroup = new THREE.Group();
    orbitGroup.rotation.set(Math.floor(Randomizer.random() * 2 * Math.PI), Math.floor(Randomizer.random() * 2 * Math.PI), Math.floor(Randomizer.random() * 2 * Math.PI));
    planet.orbitGroup = orbitGroup;
    // Create sprite group
    var spriteGroup = new THREE.Group();
    planet.spriteGroup = spriteGroup;
    // Create back ring
    if(planet.ring){
        var ringScale = new THREE.Matrix4();
        ringScale.makeScale(planet.scale, planet.scale, 1); // Maybe change this
        var ringIndex = Math.floor(Randomizer.random() * this.ringMaterials.length / 2);
        // var ringSpriteA = new THREE.Sprite(this.ringMaterials[ringIndex]);
        var ringSpriteA = new THREE.Sprite();
        ringSpriteA.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteA);
    }
    // Create planet sprite
    var planetScale = new THREE.Matrix4();
    planetScale.makeScale(planet.scale, planet.scale, 1);
    var planetSprite = new THREE.Sprite((parentGroup === this.rootGroup) ? this.sunMaterials[Math.floor(Randomizer.random() * this.sunMaterials.length)] : this.planetMaterials[Math.floor(Randomizer.random() * this.planetMaterials.length)]);
    planetSprite.applyMatrix(planetScale);
    spriteGroup.add(planetSprite);
    // Create front ring
    if(planet.ring){
        // var ringSpriteB = new THREE.Sprite(this.ringMaterials[ringIndex + 1]);
        var ringSpriteB = new THREE.Sprite();
        ringSpriteB.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteB);
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

// The setSize function is used to resize the renderer and camera with the given width and height
Graphics.prototype.setSize = function (width, height) {
    if (isNaN(width) || isNaN(height)) {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
}

// The updatePlanets function updates the positions of the planets of the solSys object
Graphics.prototype.updatePlanets = function(planet, parentPosition){
    planet.spriteGroup.position.set(Math.cos(RenderClock.getMultipliedElapsedSeconds() * planet.speed) * planet.orbitRadius, Math.sin(RenderClock.getMultipliedElapsedSeconds() * planet.speed) * planet.orbitRadius, 0);
    planet.orbitGroup.position.set(parentPosition.x, parentPosition.y, parentPosition.z);
    if(planet.children){
        for(var i = 0; i < planet.children.length; i++){
            this.updatePlanets(planet.children[i], planet.spriteGroup.position);
        }
    }
}

// The update function updates the elements of the Graphics object
Graphics.prototype.update = function(){
    this.updatePlanets(this.solSys, this.solSys.spriteGroup.position);
}

// The render function renders the elements of the Graphics object
Graphics.prototype.render = function(){
    this.renderer.render(this.scene, this.camera);
}

// The Blueprint class turns factorization profiles into recursive collections of planets
//     that can be easily parsed by the graphical functions like addPlanets
Blueprint = function(profile){
    this.profile = JSON.parse(profile);
    this.system = {
        type: Blueprint.POSITIVE,
        ring: false,
        orbitRadius: 0,
        scale: 1,
        speed: 0,
        children: []
    }
    this.orbitHistory = [this.system];
    this.genChildren(this.profile);
    this.setSystemWidths(this.system, 0);
}

// The genChildren function takes in a FactorProfile node and decides what to do
Blueprint.prototype.genChildren = function (node) {
    if (node.isPrime) {
        if (isNaN(node.piX) === true) {
            var newLength = this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                ring: (Math.floor(Randomizer.random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * Randomizer.random(),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.piX);
            this.orbitHistory.pop();
        } else if (parseInt(node.piX) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                ring: (Math.floor(Randomizer.random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * Randomizer.random(),
                children: []
            });
        } else if (parseInt(node.piX) === 0) {
            // Do nothing
        } else {
            throw "piX type error: " + node.piX;
        }

        if (isNaN(node.power) === true) {
            var newLength = this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.POSITIVE,
                ring: (Math.floor(Randomizer.random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * Randomizer.random(),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.power);
            this.orbitHistory.pop();
        } else if (parseInt(node.power) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.POSITIVE,
                ring: (Math.floor(Randomizer.random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * Randomizer.random(),
                children: []
            });
        } else if (parseInt(node.power) === 0) {
            throw "power type error: 0";
        } else {
            throw "power type error: " + node.power;
        }        
    } else {
        if(node.factors){
            for (var ii = node.factors.length - 1; ii >= 0; ii--) {
                this.genChildren(node.factors[ii]);
            }
        }
    }
}

// The setSystemWidths function is used to calculate and set the widths of given planet systems, and in the process set radii.
Blueprint.prototype.setSystemWidths = function(system, depth){
    var width = 1;
    var radius = 0.5;
    if(system.children){
        width += 2 * system.children.length * Blueprint.SPACING;
        for(var i = 0; i < system.children.length; i++){
            radius += Blueprint.SPACING;
            width += 2 * Blueprint.CHILD * this.setSystemWidths(system.children[i], depth + 1);
            radius += Blueprint.CHILD * system.children[i].width / 2;
            system.children[i].orbitRadius = Math.pow(Blueprint.CHILD, depth) * radius;
            radius += Blueprint.CHILD * system.children[i].width / 2;
        }
    }
    system.width = width;
    return width;
}

Blueprint.SKIP = 0;
Blueprint.POSITIVE = 1;
Blueprint.NEGATIVE = -1;
Blueprint.CHILD = 0.9;
Blueprint.SPACING = /*Math.pow(0.618033988749894, 2)*/0.1;

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
    Graphics = new Graphics(window.innerWidth, window.innerHeight, document.getElementById("graphics"));
    Controls = new THREE.OrbitControls(Graphics.camera, document.getElementById("mouse"));
    Graphics.genStars();
    progressBar = new Progress();
    progressBar.on("finishTask", console.log);
    progressBar.on("finishTask", console.log.bind(this, "progressBar done!"));
    Graphics.loadMaterials(progressBar);
}

// The render function is the main render loop
var render = function(){
    requestAnimationFrame(render);
    if (Graphics.systemExists){
        Graphics.update();
    }
    Graphics.render();
}

// WebGL detection
try {
    var canvas = document.createElement('canvas');
    supportsWebGL = !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
} catch ( e ) {
    supportsWebGL = false;
}
if (supportsWebGL) {
    init();
    render();
} else {
    document.getElementById("webgl-unsupported").innerHTML = "Your graphics card does not seem to support WebGL. <br/><br/> Find out how to get it here: <a href=\"https://get.webgl.org/\" target=\"_blank\">https://get.webgl.org/</a>";
}
