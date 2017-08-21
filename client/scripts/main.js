var init = function(){
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("middlelay").appendChild(renderer.domElement);
    
    window.addEventListener("resize", resizeCanvas);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var textureLoader = new THREE.TextureLoader();

    orbit1 = new THREE.Group();
    orbit2 = new THREE.Group();

    var orbitPathGeometry = new THREE.Geometry();
    var orbitSegments = 256;
    for(var i = 0; i < orbitSegments; i++){
        orbitPathGeometry.vertices.push(new THREE.Vector3(Math.cos(i * (2 * Math.PI / orbitSegments)), Math.sin(i * (2 * Math.PI / orbitSegments)), 0));
    }
    var orbitPathMaterial = new THREE.LineBasicMaterial();
    orbitPathMaterial.transparent = true;
    orbitPathMaterial.opacity = 0.6;

    orbit1Path = new THREE.LineLoop(orbitPathGeometry, orbitPathMaterial);
    var orbit1PathScale = new THREE.Matrix4();
    orbit1PathScale.makeScale(3, 3, 3);
    orbit1Path.applyMatrix(orbit1PathScale);
    orbit1.add(orbit1Path);

    orbit2Path = new THREE.LineLoop(orbitPathGeometry, orbitPathMaterial);
    var orbit2PathScale = new THREE.Matrix4();
    orbit2PathScale.makeScale(1.5, 1.5, 1.5);
    orbit2Path.applyMatrix(orbit2PathScale);
    orbit2.add(orbit2Path);
    
    var planetMap = textureLoader.load(planet1());
    var planetMaterial = new THREE.SpriteMaterial({map: planetMap});
    
    planetCenter = new THREE.Sprite(planetMaterial);
    planet1 = new THREE.Sprite(planetMaterial);
    var planet1Scaling = new THREE.Matrix4();
    planet1Scaling.makeScale(0.66, 0.66, 0.66);
    planet1.applyMatrix(planet1Scaling);
    planet1.position.set(3, 0, 0);

    planet2 = new THREE.Sprite(planetMaterial);
    var planet2Scaling = new THREE.Matrix4();
    planet2Scaling.makeScale(0.44, 0.44, 0.44);
    planet2.applyMatrix(planet2Scaling);
    planet2.position.set(1.5, 0, 0);
    
    orbit2.position.set(planet1.position.x, planet1.position.y, planet1.position.z);
    orbit2.add(planet2);
    orbit1.add(planet1);
    orbit1.add(orbit2);

    scene.add(planetCenter);
    scene.add(orbit1);

    camera.position.z = 5;
}

var render = function(){
    requestAnimationFrame(render);
    var delta = clock.getDelta();

    orbit1.rotation.z += 0.125 * delta;
    orbit2.rotation.z += 1 * delta;

    renderer.render(scene, camera);
}

var resizeCanvas = function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// The remoteFactorize function is used to make requests for factorization to the AWS Lambda function that has been loaded onto the endpoint in the code below.
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

var planet1 = function(){
    var ctx=document.getElementById("planetCanvas").getContext("2d");var funcNames=["clearRect","save","translate","scale","beginPath","moveTo","bezierCurveTo","closePath","fill","stroke","restore","rotate","arc","lineTo"];for(var ii=0;ii<funcNames.length;ii++)window["f"+ii.toString()]=ctx[funcNames[ii]].bind(ctx);ctx.save();ctx.strokeStyle="transparent";f0(0,0,1E3,1E3);f1();f2(0,0);f3(37.795,37.795);f1();f2(0,-270.542);f1();ctx.fillStyle="#0cf";f4();f5(13.229,270.542);
    f6(20.535,270.542,26.458,276.464,26.458,283.771);f6(26.458,291.077,20.535,297,13.229,297);f6(5.922,297,0,291.077,0,283.771);f6(0,276.464,5.922,270.542,13.229,270.542);f7();f8();f9();f10();f1();ctx.fillStyle="#c87137";f4();f5(4.86,286.31);f6(4.618,286.308,4.365,286.342,4.104,286.417);f6(3.543,286.577,2.104,287.046,1.519,287.673);f6(1.089,288.133,1.472,288.711,1.163,289.195);f2(13.231,283.77);f12(0,0,13.232,2.719,2.371,1);f2(-13.231,-283.77);f13(3.743,292.991);f6(4.049,293.306,4.37,293.604,4.705,293.887);
    f13(4.709,293.89);f6(5.492,294.544,6.346,295.12,7.258,295.575);f6(7.342,295.326,7.1,294.751,7.229,294.373);f6(7.398,293.883,7.943,293.544,8.02,292.948);f6(8.048,292.724,8.673,292.524,8.741,292.308);f6(8.93,291.728,8.436,292.266,8.386,291.642);f6(8.371,291.453,7.738,291.437,7.702,291.234);f6(7.57,290.498,8.008,289.539,7.957,289.26);f6(7.873,288.79,8.159,288.022,7.767,287.59);f6(7.297,287.071,6.096,286.913,5.411,286.679);f6(5.157,286.592,5.144,286.308,4.859,286.308);f7();f5(13.23,270.542);
    f2(13.228,283.771);f12(0,0,13.23,-1.57,-2.241,1);f2(-13.228,-283.771);f13(5.005,273.409);f6(4.662,273.682,4.332,273.971,4.018,274.276);f13(4.005,274.288);f6(3.695,274.591,3.399,274.908,3.118,275.24);f13(3.103,275.257);f2(13.229,283.771);f12(0,0,13.23,-2.442,-3.141,1);f2(-13.229,-283.771);f6(.512,283.104,1.025,282.661,1.529,282.339);f6(1.775,282.183,1.755,282.339,2.019,282.335);f6(2.234,282.332,2.564,281.71,2.767,281.626);f6(4.297,281.006,5.687,280.917,6.413,277.89);
    f6(6.527,277.417,7.036,277.436,7.138,276.92);f6(7.284,276.172,6.753,275.997,7.203,275.407);f6(7.399,275.15,7.941,275.667,8.207,275.436);f6(8.651,275.052,9.185,273.694,9.687,273.331);f6(10.615,272.661,12.246,272.571,13.109,272.217);f6(14.372,271.698,14.744,271.023,15.028,270.664);f2(13.226,283.798);f12(0,0,13.257,-1.434,-1.57,1);f2(-13.226,-283.798);f7();f5(21.41,273.374);f6(21.045,273.895,20.682,273.156,20.298,275.367);f6(20.085,276.597,18.85,277.485,18.269,278.484);
    f6(18.014,278.922,18.415,279.747,17.849,279.896);f6(16.955,280.131,16.185,279.982,15.342,280.042);f6(14.536,280.101,13.652,280.372,13.072,280.385);f6(11.702,280.412,11.044,280.024,10.677,280.44);f6(10.362,280.799,10.985,281.398,11.119,282.287);f6(11.141,282.434,10.492,282.919,10.307,283.301);f6(10.157,283.61,10.461,283.822,10.5,283.961);f6(10.552,284.147,10.852,284.053,11.37,283.945);f6(11.555,283.906,11.904,284.325,12.392,284.168);f6(13.022,283.965,13.82,283.173,14.109,283.108);
    f6(15.06,282.894,14.688,283.249,14.797,283.613);f6(15.202,284.969,16.489,286.481,16.067,287.56);f6(15.712,288.473,17.1,288.933,17.37,288.984);f6(17.755,289.057,17.217,288.4,17.684,287.863);f6(18.202,287.267,18.387,286.422,19.021,285.792);f6(19.274,285.54,19.806,285.897,20.077,285.679);f6(20.419,285.404,20.314,284.453,20.61,284.189);f6(21.377,283.501,22.376,283.64,22.517,283.961);f6(22.621,284.198,22.963,283.926,23.032,284.131);f6(23.161,284.517,22.972,285.34,22.995,285.631);
    f6(23.144,287.527,21.319,287.654,21.295,289.43);f6(21.292,289.645,21.59,289.947,21.607,290.145);f6(21.632,290.438,21.291,290.784,21.4,291.013);f6(21.583,291.397,21.785,291.895,22.102,292.133);f6(22.314,292.291,22.881,291.705,23.299,291.628);f6(23.677,291.558,23.534,291.738,23.914,291.572);f2(13.222,283.769);f12(0,0,13.236,.63,0,1);f2(-13.222,-283.769);f2(13.215,283.777);f12(0,0,13.243,-0,-.903,1);f2(-13.215,-283.777);f7();f8();f9();f10();f1();ctx.fillStyle="#c87137";f4();f5(10.178,275.164);
    f6(10.228,275.441,10.3,275.103,10.665,275.282);f6(10.799,275.347,10.948,275.669,11.197,275.828);f6(11.43,275.977,11.762,275.957,11.947,276.126);f6(12.102,276.268,11.911,276.446,12.107,276.545);f6(12.341,276.662,12.742,276.885,13.213,276.912);f6(13.54,276.932,13.935,276.758,14.183,276.799);f6(14.606,276.866,14.584,277.125,14.854,277.058);f6(15.51,276.893,15.654,276.876,15.838,276.272);f6(15.888,276.108,15.324,276.039,15.296,275.783);f6(15.269,275.533,15.454,275.713,15.448,275.423);
    f6(15.443,275.127,14.866,274.62,14.718,274.257);f6(14.611,273.996,14.966,273.837,14.793,273.757);f6(14.069,273.427,13.289,274.773,12.692,275.097);f6(12.557,275.169,12.612,274.856,12.487,274.82);f2(13.161,272.31);f12(0,0,2.6,1.833,2.27,0);f2(-13.161,-272.31);f6(11.224,274.094,11.414,274.068,11.127,273.876);f6(10.84,273.686,10.673,273.792,10.541,273.932);f6(10.358,274.124,10.423,274.514,10.344,274.739);f6(10.311,274.847,10.128,274.888,10.179,275.163);f7();f5(14.943,294.211);f2(14.994,294.583);
    f12(0,0,.376,-1.707,-2.16,1);f2(-14.994,-294.583);f6(14.281,294.578,14.181,294.473,13.903,295.041);f6(13.624,295.606,14.043,295.558,13.786,295.954);f6(13.666,296.138,13.758,296.541,13.464,296.626);f6(13.169,296.712,12.588,296.591,12.438,296.976);f6(12.703,296.998,12.964,296.995,13.229,297);f2(13.225,283.76);f12(0,0,13.24,1.57,1.06,1);f2(-13.225,-283.76);f6(19.077,295.324,18.747,295.066,18.503,295.143);f6(18.218,295.233,17.89,295.428,17.729,295.308);f6(17.555,295.178,17.294,295.135,17.288,294.988);
    f6(17.284,294.852,17.528,294.614,17.621,294.419);f6(17.813,294.017,15.681,294.526,15.384,294.722);f6(15.123,294.892,15.245,294.185,14.942,294.211);f7();f5(9.085,290.978);f6(9.038,290.941,9.122,290.873,9.115,290.803);f6(9.109,290.735,9.039,290.606,9.047,290.528);f6(9.064,290.348,9.191,290.215,9.296,290.136);f6(9.493,289.989,9.686,290.256,9.904,290.16);f6(10.046,290.097,10.242,289.91,10.344,289.745);f6(10.4,289.655,10.33,289.531,10.43,289.528);f6(10.633,289.522,10.79,289.7,10.9,289.916);
    f6(10.944,290.004,11.093,290.1,11.038,290.183);f6(10.933,290.343,10.813,290.272,10.734,290.367);f6(10.539,290.602,10.351,290.91,10.15,290.931);f6(9.984,290.949,10.057,290.881,9.99,290.802);f6(9.941,290.747,9.753,290.674,9.67,290.674);f6(9.621,290.674,9.605,290.76,9.558,290.799);f2(9.066,290.22);f12(0,0,.759,.867,1.547,0);f2(-9.066,-290.22);f7();f8();f9();f10();f10();f10();ctx.restore();    
    return document.getElementById("planetCanvas").toDataURL();
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