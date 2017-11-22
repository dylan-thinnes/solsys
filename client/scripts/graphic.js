// RenderClock is an instance of the Timer class. It tells the renderer how much time has elapsed to keep track of planetary movements.
var RenderClock = new Timer();
RenderClock.start();

Randomizer = new (function () {
	var randomizer = null;
	this.seed = "";
	this.setSeed = function (newSeed) {
		randomizer = xor4096(newSeed);
	}
	this.random = randomizer();
})();

Graphics = {}; // Creating actual graphics and sprites for the renderer

Blueprint = {}; // Just copy paste the existing Blueprint class

Progress = {}; // An object that keeps state of the progress in loading the page

function init () {} // The init function. Try to have as little logic in this as possible

//After all of this, the WebGL detection code


/* Refactored code goes above this comment, unrefactored code resides below */

//The init function is used for initialization
var init = function () {
    systemExists = false;
    timer = new Timer();
    timer.start();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("graphics").appendChild(renderer.domElement);
    window.addEventListener("resize", resizeCanvas);
    controls = new THREE.OrbitControls(camera, document.getElementById("mouse"));
    camera.position.set(0, 0, 15);
    random = xor4096("meow");
    sunMaterials = [];
    planetMaterials = [];
    ringMaterials = [];
    rootGroup = new THREE.Group();
    rootGroup.rotation.set(Math.PI / 2, 0, 0);
    scene.add(rootGroup);
    solSys = {};

    orbitPathGeometry = new THREE.Geometry();
    var orbitSegments = 256;
    for(var i = 0; i < orbitSegments; i++){
        orbitPathGeometry.vertices.push(new THREE.Vector3(Math.cos(i * (2 * Math.PI / orbitSegments)), Math.sin(i * (2 * Math.PI / orbitSegments)), 0));
    }
    orbitPathMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
    orbitPathMaterial.transparent = true;
    orbitPathMaterial.opacity = 0.4;

    genStars();

    var start = Date.now();
    genMaterials(function(progress){
        //console.log(`${progress.loaded}/${progress.total}: ${progress.percent}%`);
    }, function(time){
        //console.log(`Material generation finished: ${time} seconds`);
    });
}

//The genMaterials function is used to generate the materials and textures for planets and objects in the scene
var genMaterials = function(onProgress, onFinished){
    var start = Date.now();
    var sunJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4]; //Add sun JSVGs
    var planetJSVGs = [SVGTOJS.planet1, SVGTOJS.planet2, SVGTOJS.planet3, SVGTOJS.planet4];
    var ringJSVGs = [ring1a, ring1b];
    var progress = {loaded: 0, total: sunJSVGs.length + planetJSVGs.length + ringJSVGs.length, percent: 0};
    var textureLoader = new THREE.TextureLoader();
    var canvas = document.getElementById("planetCanvas");
    var ctx = canvas.getContext("2d");
    for(var i = 0; i < sunJSVGs.length; i++){
	sunJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        sunMaterials.push(material);
        progress.loaded++;
        progress.percent = progress.loaded / progress.total * 100;
        onProgress(progress);
    }
    for(var i = 0; i < planetJSVGs.length; i++){
	planetJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        planetMaterials.push(material);
        progress.loaded++;
        progress.percent = progress.loaded / progress.total * 100;
        onProgress(progress);
    }
    for(var i = 0; i < ringJSVGs.length; i++){
		ringJSVGs[i](ctx, 10.24, 10.24);
        let material = new THREE.SpriteMaterial({map: textureLoader.load(canvas.toDataURL())});
        material.depthTest = false;
        ringMaterials.push(material);
        progress.loaded++;
        progress.percent = progress.loaded / progress.total * 100;
        onProgress(progress);
    }
    canvas.parentNode.removeChild(canvas);
    onFinished((Date.now() - start) / 1000);
}

//The genStars function is used to randomly generate stars
var genStars = function(){
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
        scene.add(starsFields[ii]);
    }
}

//The genPlanets function is used to generate the planets of the solar system
var genPlanets = function(profile){
    systemExists = false;
    var blueprint = new Blueprint(profile);
    //console.log(blueprint);
    solSys = JSON.parse(JSON.stringify(blueprint.system));
    //Clear the previous system from the scene
    for(var i = 0; i < rootGroup.children.length; i++){
        rootGroup.remove(rootGroup.children[i]);
    }
    var start = Date.now(); // What is this???????
    addPlanets(solSys, rootGroup);
    //console.log(`Planet adding finished: ${(Date.now() - start) / 1000} seconds`);
    updatePlanets(solSys, solSys.spriteGroup.position);
    systemExists = true;
}

//The addPlanets function is used to add the planets of the solSys object to the threejs scene
var addPlanets = function(planet, parentGroup){
    //Create orbit group
    var orbitGroup = new THREE.Group();
    orbitGroup.rotation.set(Math.floor(random() * 2 * Math.PI), Math.floor(random() * 2 * Math.PI), Math.floor(random  () * 2 * Math.PI));
    planet.orbitGroup = orbitGroup;
    //Create sprite group
    var spriteGroup = new THREE.Group();
    planet.spriteGroup = spriteGroup;
    //Create back ring
    if(planet.ring){
        var ringScale = new THREE.Matrix4();
        ringScale.makeScale(planet.scale, planet.scale, 1); //Maybe change this
        var ringIndex = Math.floor(random() * ringMaterials.length / 2);
        //var ringSpriteA = new THREE.Sprite(ringMaterials[ringIndex]);
        var ringSpriteA = new THREE.Sprite();
        ringSpriteA.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteA);
    }
    //Create planet sprite
    var planetScale = new THREE.Matrix4();
    planetScale.makeScale(planet.scale, planet.scale, 1);
    var planetSprite = new THREE.Sprite((parentGroup === rootGroup) ? sunMaterials[Math.floor(random() * sunMaterials.length)] : planetMaterials[Math.floor(random() * planetMaterials.length)]);
    planetSprite.applyMatrix(planetScale);
    spriteGroup.add(planetSprite);
    //Create front ring
    if(planet.ring){
        //var ringSpriteB = new THREE.Sprite(ringMaterials[ringIndex + 1]);
        var ringSpriteB = new THREE.Sprite();
        ringSpriteB.applyMatrix(ringScale);
        spriteGroup.add(ringSpriteB);
    }
    //Create planet orbit path
    var orbitPath = new THREE.LineLoop(orbitPathGeometry, orbitPathMaterial);
    var orbitPathScale = new THREE.Matrix4();
    orbitPathScale.makeScale(planet.orbitRadius, planet.orbitRadius, 1);
    orbitPath.applyMatrix(orbitPathScale);
    orbitGroup.add(orbitPath, spriteGroup);
    //Add to parent planet
    parentGroup.add(orbitGroup);
    //Add planet children
    if(planet.children){
        for(var i = 0; i < planet.children.length; i++){
            addPlanets(planet.children[i], orbitGroup);
        }
    }
}

//The updatePlanets function updates the positions of the planets of the solSys object
var updatePlanets = function(planet, parentPosition){
    planet.spriteGroup.position.set(Math.cos(timer.getElapsedSeconds() * planet.speed) * planet.orbitRadius, Math.sin(timer.getElapsedSeconds() * planet.speed) * planet.orbitRadius, 0);
    planet.orbitGroup.position.set(parentPosition.x, parentPosition.y, parentPosition.z);
    if(planet.children){
        for(var i = 0; i < planet.children.length; i++){
            updatePlanets(planet.children[i], planet.spriteGroup.position);
        }
    }
}

//The render function is the main render loop
var render = function(){
    requestAnimationFrame(render);
    var delta = timer.getDeltaTime();
    if (systemExists){
        updatePlanets(solSys, solSys.spriteGroup.position);
    }
    renderer.render(scene, camera);
}

//The resizeCanvas function is used to resize the renderer and camera with the window
var resizeCanvas = function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// The Blueprint class turns factorization profiles into recursive collections of planets that can be easily parsed by the graphical functions like addPlanets
var Blueprint = function (profile) {
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

//The genChildren function takes in a FactorProfile node and decides what to do
Blueprint.prototype.genChildren = function (node) {
    if (node.isPrime) {
        if (isNaN(node.piX) === true) {
            var newLength = this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                ring: (Math.floor(random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * random(),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.piX);
            this.orbitHistory.pop();
        } else if (parseInt(node.piX) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                ring: (Math.floor(random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * random(),
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
                ring: (Math.floor(random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * random(),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.power);
            this.orbitHistory.pop();
        } else if (parseInt(node.power) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.POSITIVE,
                ring: (Math.floor(random() * 10) === 0),
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                speed: 0.5 * random(),
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

//The setSystemWidths function is used to calculate and set the widths of given planet systems, and in the process set radii.
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

var ring1a = function(){
    //Add jsvg
}

var ring1b = function(){
    //Add jsvg
}

//WebGL detection
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
