var init = function(){
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("middlelay").appendChild(renderer.domElement);
    
    window.addEventListener("resize", resizeCanvas);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    var textureLoader = new THREE.TextureLoader();
    var planets = [planet1, planet3, planet4]; //Add planet2
    var planetMap;
    var planetMaterial;

    orbit1 = new THREE.Group();
    orbit2 = new THREE.Group();

    var orbitPathGeometry = new THREE.Geometry();
    var orbitSegments = 256;
    for(var i = 0; i < orbitSegments; i++){
        orbitPathGeometry.vertices.push(new THREE.Vector3(Math.cos(i * (2 * Math.PI / orbitSegments)), Math.sin(i * (2 * Math.PI / orbitSegments)), 0));
    }
    var orbitPathMaterial = new THREE.LineBasicMaterial();
    orbitPathMaterial.transparent = true;
    orbitPathMaterial.opacity = 0.4;

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
    
    planetMap = textureLoader.load(planets[Math.floor(Math.random() * planets.length)]());
    planetMaterial = new THREE.SpriteMaterial({map: planetMap});
    planetCenter = new THREE.Sprite(planetMaterial);

    planetMap = textureLoader.load(planets[Math.floor(Math.random() * planets.length)]());
    planetMaterial = new THREE.SpriteMaterial({map: planetMap});
    planet1 = new THREE.Sprite(planetMaterial);
    var planet1Scaling = new THREE.Matrix4();
    planet1Scaling.makeScale(0.66, 0.66, 0.66);
    planet1.applyMatrix(planet1Scaling);
    planet1.position.set(3, 0, 0);

    planetMap = textureLoader.load(planets[Math.floor(Math.random() * planets.length)]());
    planetMaterial = new THREE.SpriteMaterial({map: planetMap});
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

    camera.position.z = 15;
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

var planet2 = function(){
    //Todo ryan
}

var planet3 = function(){
    var ctx=document.getElementById("planetCanvas").getContext("2d");var funcNames=["clearRect","save","translate","scale","beginPath","arc","closePath","fill","stroke","restore","moveTo","bezierCurveTo","rotate"];for(var ii=0;ii<funcNames.length;ii++)window["f"+ii.toString()]=ctx[funcNames[ii]].bind(ctx);ctx.save();ctx.strokeStyle="transparent";f0(0,0,1E3,1E3);f1();f3(37.795,37.795);f1();f2(0,-270.542);f1();ctx.fillStyle="navy";f4();f5(13.229,283.771,13.229,0,6.283185307179586,true);f6();f7();f8();f9();
    f1();ctx.fillStyle="#c87137";f4();f10(14.155,289.724);f11(14.738,290.39,16.247,289.964,17.433,290.498);f11(17.741,290.636,17.866,291.306,18.044,291.421);f11(18.552,291.744,17.394,291.619,17.22,291.927);f11(15.76,294.537,15.047,294.232,15.189,294.538);f11(15.432,295.067,15.972,294.748,15.867,295.245);f11(15.651,296.259,14.907,296.999,13.228,296.999);f11(10.136,296.999,7.291,295.939,5.039,294.16);f11(4.658,293.78,4.389,293.496,4.304,293.161);f11(4.252,292.956,4.382,292.6,4.424,292.482);
    f11(4.489,292.298,4.6,292.507,4.816,292.349);f11(5.112,292.135,5.39,291.777,5.731,291.405);f11(6.236,290.854,5.895,290.058,6.083,289.749);f11(6.355,289.303,6.558,288.464,6.855,288.47);f11(8.522,288.504,7.721,289.068,8.661,288.817);f11(9.747,288.527,9.233,288.387,10.014,288.192);f11(12.747,287.506,13.573,289.057,14.155,289.722);f6();f7();f8();f9();f1();ctx.fillStyle="#c87137";f4();f10(16.803,294.18);f11(16.748,294.11,16.46,294.386,16.415,294.544);f11(16.369,294.7,16.275,295.433,16.439,295.544);
    f11(16.604,295.654,17.238,295.32,17.266,295.164);f11(17.296,295.007,16.929,294.788,16.886,294.651);f11(16.843,294.514,16.858,294.251,16.803,294.18);f6();f10(4.052,274.243);f2(13.232,283.776);f5(0,0,13.235,-2.337,-2.911,1);f2(-13.232,-283.776);f11(.086,282.058,.873,283.363,1.807,283.01);f11(2.477,282.724,3.001,282.643,3.426,282.677);f11(3.617,282.693,3.425,282.93,3.58,282.984);f11(3.748,283.042,4.261,282.919,4.398,283.001);f11(5.202,283.484,5.534,284.344,6.346,284.4);
    f11(6.967,284.442,7.55,283.881,8.302,283.527);f11(8.735,283.325,9.343,283.472,9.569,283.018);f11(9.814,282.527,9.643,281.392,9.098,279.993);f11(8.754,279.111,7.638,279.191,7.215,278.534);f11(7.177,278.476,7.002,277.599,7.342,277.2);f11(7.645,276.846,8.448,276.986,8.7,276.62);f11(8.988,276.2,8.977,276.018,8.945,275.756);f11(8.925,275.596,8.512,275.846,8.297,275.783);f11(7.877,275.661,7.738,275.82,7.455,275.884);f11(6.991,275.99,7.029,275.758,6.887,275.511);f11(6.307,274.509,4.845,274.287,4.052,274.243);
    f6();f10(17.982,271.425);f11(17.046,272.968,20.618,273.22,20.863,273.953);f11(21.113,274.696,20.002,275.379,18.853,276.385);f11(17.703,277.391,14.502,277.822,13.754,279.565);f11(13.007,281.31,14.909,279.737,14.83,280.221);f11(14.752,280.704,13.965,281.027,14.058,282.255);f11(14.151,283.483,15.28,284.823,15.812,284.617);f11(16.208,284.464,16.216,282.154,16.76,280.467);f11(16.853,280.177,17.292,280.038,17.405,279.812);f11(17.518,279.585,17.305,279.27,17.496,279.098);
    f11(18.986,277.761,22.367,278.964,23.623,277.928);f11(24.013,277.608,24.366,277.33,24.629,277.058);f2(13.208,283.796);f5(0,0,13.26,-.533,-1.202,1);f2(-13.208,-283.796);f6();f7();f8();f9();f1();ctx.fillStyle="#c87137";f4();f10(17.648,281.081);f11(17.594,281.221,17.903,281.391,18.065,281.411);f11(18.162,281.424,17.786,282.045,18.032,282.004);f11(18.199,281.977,19.017,281.312,19.052,281.239);f11(19.134,281.059,18.497,280.859,18.552,280.478);f11(18.608,280.097,17.992,280.301,17.854,280.425);
    f11(17.715,280.55,17.701,280.942,17.648,281.081);f6();f10(24.576,280.856);f11(24.125,280.933,24.061,283.988,23.811,284.388);f11(23.546,284.815,22.961,285.123,22.654,285.066);f11(22.347,285.008,21.406,285.768,21.496,286.205);f11(21.586,286.645,22.298,287.561,22.439,288.174);f11(22.58,288.787,21.52,289.847,21.629,290.538);f11(21.712,291.069,21.989,291.5,22.522,291.744);f11(22.683,291.818,22.829,292.341,22.977,292.212);f11(23.127,292.08,23.381,291.957,23.452,291.758);
    f11(23.768,290.876,24.394,289.968,24.804,289.645);f2(25.256,290.19);f5(0,0,.708,-2.264,-1.709,0);f2(-25.256,-290.19);f11(25.603,288.568,25.93,287.601,26.151,286.604);f11(26.175,286.054,26.169,285.526,26.139,285.164);f11(26.102,284.72,25.589,283.902,25.542,283.14);f11(25.487,282.253,24.992,281.099,24.672,280.882);f2(24.592,280.983);f5(0,0,.129,-.91,-1.702,1);f2(-24.592,-280.983);f6();f10(13.23,270.542);f11(12.654,270.546,12.076,270.573,11.506,270.654);f11(11.571,270.957,11.589,270.817,11.705,271.158);
    f11(11.823,271.508,11.252,271.758,11.845,271.837);f11(12.439,271.916,12.986,271.393,13.283,271.041);f11(13.576,270.695,13.581,270.924,13.801,270.554);f11(13.611,270.539,13.419,270.546,13.229,270.542);f6();f7();f8();f9();f9();f9();ctx.restore();
    return document.getElementById("planetCanvas").toDataURL();    
}

var planet4 = function(){
    var ctx=document.getElementById("planetCanvas").getContext("2d");var funcNames=["clearRect","save","translate","scale","beginPath","arc","closePath","fill","stroke","restore","moveTo","bezierCurveTo","rotate"];for(var ii=0;ii<funcNames.length;ii++)window["f"+ii.toString()]=ctx[funcNames[ii]].bind(ctx);ctx.save();ctx.strokeStyle="transparent";f0(0,0,1E3,1E3);f1();f2(0,0);f3(37.795,37.795);f1();f2(0,-270.542);f1();ctx.fillStyle="#00aad4";f4();f5(13.229,283.771,13.229,0,6.283185307179586,true);f6();
    f7();f8();f9();f1();ctx.fillStyle="#008033";f4();f10(12.408,285.099);f11(12.184,285.086,12.027,285.743,11.972,287.933);f11(11.85,292.866,11.382,291.89,11.206,293.262);f11(10.831,296.168,11.931,293.637,13.229,297);f2(13.229,283.769);f5(0,0,13.231,1.57,1.187,1);f2(-13.229,-283.769);f11(18.883,294.728,16.714,294.438,16.765,293.119);f11(16.792,292.448,17.229,291.717,17.37,291.015);f11(17.434,290.697,17.318,290.214,17.282,290.045);f11(17.179,289.555,16.41,290.568,16.265,290.099);
    f11(16.09,289.536,16.354,288.327,16.129,287.789);f11(15.521,286.33,13.948,287.341,13.246,286.282);f11(12.923,285.794,12.632,285.111,12.408,285.099);f6();f10(11.075,285.018);f11(11.36,285.275,11.241,284.263,11.388,283.597);f11(11.478,283.193,11.956,282.84,11.884,282.409);f11(11.846,282.183,12.171,281.503,12.051,281.272);f11(11.811,280.808,10.465,280.361,9.951,280.108);f11(9.436,279.856,9.753,279.8,9.377,279.698);f11(8.437,279.443,7.595,280.549,7.28,280.352);f11(6.964,280.155,7.34,279.777,6.596,279.229);
    f11(6.12,278.879,6.13,277.936,5.615,277.194);f11(5.323,276.774,5.675,276.283,4.981,276.442);f11(4.45,276.564,4.196,275.982,3.848,276.679);f11(3.722,276.933,3.968,277.329,3.859,277.664);f11(3.452,278.915,2.397,280.931,2.169,282.369);f11(2.021,283.306,2.704,283.576,2.77,284.114);f11(2.957,285.638,3.712,286.121,4.43,286.683);f11(4.744,286.928,4.773,287.679,5.21,287.715);f11(6.1,287.787,6.187,287.895,6.122,287.455);f11(6.083,287.183,5.987,286.501,5.984,286.078);f11(5.982,285.727,6.884,285.301,6.901,284.628);
    f11(6.905,284.486,7.06,283.598,6.891,283.389);f11(6.682,283.132,6.296,283.744,6.069,283.445);f11(5.551,282.762,4.346,282.819,4.708,282.289);f11(5.383,281.301,5.931,282.104,6.96,282.176);f11(7.99,282.248,9.512,281.969,9.97,282.644);f11(10.38,283.401,10.79,284.76,11.075,285.018);f6();f10(9.647,286.36);f11(9.457,286.434,9.434,286.685,9.407,286.932);f11(9.389,287.095,9.207,287.257,9.274,287.43);f11(9.309,287.52,9.539,287.665,9.624,287.704);f11(9.719,287.749,9.792,287.618,9.894,287.589);
    f11(10.053,287.543,10.235,287.561,10.314,287.459);f11(10.469,287.253,10.258,287.297,10.14,287.251);f2(10.333,286.75);f5(0,0,.537,1.94,2.738,0);f2(-10.333,-286.75);f11(9.741,286.76,10.032,286.352,9.898,286.218);f11(9.764,286.084,9.836,286.284,9.647,286.358);f6();f10(22.67,276.839);f11(22.985,276.037,21.979,276.231,22.017,275.791);f11(22.099,274.841,18.544,276.466,18.307,276.773);f11(18.157,276.968,16.937,277.76,16.745,277.636);f11(15.86,277.062,14.432,280.02,13.618,279.312);
    f11(13.468,279.182,13.728,278.882,13.375,278.306);f11(13.077,277.82,12.166,277.09,11.989,276.583);f11(11.85,276.188,12.29,276.023,12.157,275.685);f11(11.917,275.083,11.663,274.785,11.51,274.641);f11(11.195,274.343,11.335,274.675,10.964,274.811);f11(10.426,275.008,9.387,275.084,9.113,274.662);f11(8.97,274.443,9.455,274.665,9.916,274.31);f11(10.154,274.126,10.103,273.772,10.312,273.492);f11(10.646,273.042,11.182,272.653,11.137,272.482);f11(10.805,271.219,11.141,271.752,11.5,271.559);
    f11(11.95,271.315,12.623,271.035,13.23,270.542);f11(18.551,270.542,23.14,273.684,25.239,278.215);f11(25.099,278.434,25.018,278.87,24.733,278.845);f11(24.365,278.815,23.767,278.279,23.416,278.279);f11(22.692,278.279,22.222,278.648,21.93,278.311);f11(21.772,278.128,21.985,277.992,22.068,277.793);f11(22.236,277.391,22.518,276.946,22.67,276.839);f6();f7();f8();f9();f1();ctx.fillStyle="#008033";f4();f10(17.951,293.029);f11(17.906,293.255,17.525,293.598,17.606,293.73);
    f11(17.686,293.862,18.033,293.696,18.246,293.815);f11(18.46,293.935,18.799,293.113,18.696,292.88);f11(18.594,292.647,18.516,292.445,18.367,292.486);f11(18.254,292.518,17.997,292.801,17.951,293.029);f6();f10(26.341,285.528);f11(26.091,285.709,25.837,285.667,25.462,285.969);f11(24.974,286.363,24.35,287.111,23.969,287.351);f11(23.493,287.648,23.413,287.375,23.139,287.7);f11(22.842,288.051,23.119,288.09,23.22,288.414);f11(23.327,288.76,23.265,289.39,23.153,289.645);
    f11(23.085,289.796,22.816,289.893,22.772,290.032);f11(22.452,291.049,22.924,291.789,23.198,292.467);f2(13.206,283.761);f5(0,0,13.253,.716,.133,1);f2(-13.206,-283.761);f6();f10(23.339,286.456);f11(23.787,286.499,23.735,286.273,23.732,285.753);f11(23.729,285.275,24.044,284.82,23.991,284.521);f11(23.961,284.354,23.816,284.279,23.747,284.06);f11(23.592,283.552,23.316,282.997,22.927,282.658);f11(22.857,282.598,22.866,282.433,22.784,282.396);f11(22.04,282.066,20.857,283.307,20.039,283.091);
    f11(19.552,282.962,19.012,282.661,18.767,282.237);f11(18.69,282.104,19.011,281.947,18.993,281.8);f11(18.971,281.628,18.606,281.48,18.418,281.537);f11(18.262,281.583,18.133,281.957,17.935,282.174);f11(17.787,282.338,17.555,282.338,17.498,282.469);f11(17.284,282.961,17.771,283.551,17.928,284.092);f11(17.981,284.275,17.675,284.392,17.724,284.579);f11(17.943,285.433,18.67,286.163,19.45,286.821);f11(19.666,287.003,19.713,287.763,19.964,287.812);f11(21.124,288.037,22.476,286.374,23.338,286.456);f6();
    f10(4.237,291.947);f11(4.019,291.96,3.751,292.016,3.667,292.017);f11(3.421,292.022,3.408,292.307,3.245,292.45);f2(13.246,283.745);f5(0,0,13.259,2.425,2.217,1);f2(-13.246,-283.745);f11(5.491,294.039,5.231,293.615,5.042,293.167);f11(4.891,292.811,4.987,292.686,4.681,292.361);f11(4.608,292.281,4.637,291.984,4.43,291.95);f2(4.314,292.869);f5(0,0,.926,-1.445,-1.654,1);f2(-4.314,-292.869);f6();f7();f8();f9();f9();f9();ctx.restore();
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