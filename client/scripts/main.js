var scene;
var camera;
var renderer;

var cube;
var light;

var init = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    window.addEventListener("resize", resizeCanvas);

    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshLambertMaterial({color: 0x00FF00});
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    light = new THREE.PointLight(0xFFFF00);
    light.position.set(0, 0, 5);
    scene.add(light);

    camera.position.z = 5;
}

var render = function(){
    requestAnimationFrame(render);

    cube.rotation.x += 0.03;
	cube.rotation.y += 0.03;

    renderer.render(scene, camera);
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
    var warning = "Your graphics card does not seem to support WebGL. Find out how to get it here.";
    document.getElementById("container").appendChild(warning);
}