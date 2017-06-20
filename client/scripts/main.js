var init = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousewheel", onMouseWheel);
    document.addEventListener("DOMMouseScroll", onMouseWheel); //why firefox
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("resize", resizeCanvas);

    solSysRotation = new THREE.Quaternion();
    solSys = new THREE.Group();

    var textureLoader = new THREE.TextureLoader();
    var planetMap = textureLoader.load("../data/planetRyan.png");
    var planetMaterial = new THREE.SpriteMaterial({map: planetMap});
    planetSprite = new THREE.Sprite(planetMaterial);
    planetSprite.position.set(3, 0, 0);
    solSys.add(planetSprite);

    var geometry = new THREE.PlaneGeometry(2, 2);
    var material = new THREE.MeshLambertMaterial({map: planetMap});
    planetPlane = new THREE.Mesh(geometry, material);
    planetPlane.position.set(-3, 0, 0);
    solSys.add(planetPlane);

    scene.add(solSys);

    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 5);
    scene.add(light);

    camera.position.z = 5;
    mouseDown = false;
}

var render = function(){
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

var onMouseDown = function(e){
	mouseDown = true;
	startX = e.clientX;
    startY = e.clientY;
}

var onMouseMove = function(e){
	if (mouseDown === true) {
	    var dx = e.clientX - startX;
	    var dy = e.clientY - startY;
	    solSysRotation.setFromAxisAngle(new THREE.Vector3(dy, dx, 0).normalize(), Math.sqrt(dx * dx + dy * dy) * 0.01);
	    solSys.quaternion.premultiply(solSysRotation);
	    startX = e.clientX;
	    startY = e.clientY;
	}
}

var onMouseUp = function(e){
	mouseDown = false;
}

var onMouseOut = function(e){
	mouseDown = false;
}

var onMouseWheel = function(e){
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    camera.position.z -= (e.wheelDelta || -e.detail) * 0.1;
}

var resizeCanvas = function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

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
    var warning = "Your graphics card does not seem to support WebGL. <br /> Find out how to get it here.";
    document.getElementById("container").innerHTML = warning;
}