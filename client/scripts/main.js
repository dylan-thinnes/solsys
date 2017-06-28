var init = function(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 15);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    window.addEventListener("resize", resizeCanvas);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    solSysRotation = new THREE.Quaternion();
    solSys = new THREE.Group();

    var textureLoader = new THREE.TextureLoader();
    var planetMap = textureLoader.load("../data/planetRyan.png");
    var planetMaterial = new THREE.SpriteMaterial({map: planetMap, fog: true});
    planetSprite = new THREE.Sprite(planetMaterial);
    planetSprite.position.set(3, 0, 0);
    solSys.add(planetSprite);
    planetSprite2 = new THREE.Sprite(planetMaterial);
    planetSprite2.position.set(-3, 0, 0);
    solSys.add(planetSprite2);
    planetSprite3 = new THREE.Sprite(planetMaterial);
    planetSprite3.position.set(0, 0, -3);
    solSys.add(planetSprite3);
    planetSprite4 = new THREE.Sprite(planetMaterial);
    planetSprite4.position.set(0, 0, 3);
    solSys.add(planetSprite4);

    scene.add(solSys);

    camera.position.z = 5;
}

var render = function(){
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

var resizeCanvas = function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var remoteFactorize = function (number, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", "https://n3dl2qh6kj.execute-api.us-west-2.amazonaws.com/prod/factorize/?number=" + number.toString());
    req.setRequestHeader("x-api-key", "LtXAQm6tm05M7sd42Tcl72fyF328LCWd3wrXvWHM");
    req.onreadystatechange = (function (callback) {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(JSON.parse(JSON.parse(this.response).body));
        }
    }).bind(req, callback);
    req.send();
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
