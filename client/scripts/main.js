var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", resizeCanvas);

var geometry = new THREE.BoxGeometry(2, 2, 2);
var material = new THREE.MeshLambertMaterial({color: 0x00FF00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var light = new THREE.PointLight(0xFFFF00);
light.position.set(0, 0, 5);
scene.add(light);

camera.position.z = 5;

var render = function(){
    requestAnimationFrame(render);

    cube.rotation.x += 0.03;
	cube.rotation.y += 0.03;

    renderer.render(scene, camera);
};

render();

function resizeCanvas(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}