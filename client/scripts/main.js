var main = function () {
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
	

		var wakeableUi = new Wakeable(document.getElementById("ui"));
		window.addEventListener("mousemove", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("input").addEventListener("keydown", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("input").addEventListener("focus", wakeableUi.keepAwake.bind(wakeableUi));
		document.getElementById("input").addEventListener("blur", wakeableUi.unkeepAwake.bind(wakeableUi));
		window.setInterval(wakeableUi.sleep.bind(wakeableUi), 100);

		var view = new Radio(true, [
			new Button(document.getElementById("orbit")),
			new Button(document.getElementById("zoom")),
			new Button(document.getElementById("move"))
		]);
		new Button(document.getElementById("download"));
		new Button(document.getElementById("link"));
		new Button(document.getElementById("share"));
		var setSeed = function () {
			currSeed = new Seed(document.getElementById("input").value);
			document.getElementById("number").innerHTML = currSeed.value;
			return currSeed.value;
		}

		modals = {
			intro: new Modal(document.getElementById("intro")),
			sharing: new Modal(document.getElementById("sharing"))
		}
		var modalContainerNode = document.getElementById("modalContainer");
		var showModalContainer = function () {modalContainerNode.style.zIndex = "1000000";}
		var hideModalContainer = function () {modalContainerNode.style.zIndex = "";}
		for (var index in modals) {
			var currModal = modals[index];
			currModal.on("focus", showModalContainer);
			currModal.on("focus", wakeableUi.keepAwake.bind(wakeableUi));
			currModal.on("unfocus", wakeableUi.unkeepAwake.bind(wakeableUi));
			currModal.on("unfocus", hideModalContainer);
		}

		var startLoad = new ProgressNode(document.getElementById("startLoad")); 
		progressBar.on("finishTask", startLoad.requestFrameForPercent.bind(startLoad));
		var showStartButton = function () {
			document.getElementById("startLoad").style.opacity = "0.5";
			//document.getElementById("startButton").style.display = "inline-block";
		}
		progressBar.on("finishAll", showStartButton);

		setSeed();
		document.getElementById("input").addEventListener("keypress", function (event) {
			if (event.keyCode === 13 || event.charCode === 13) {
				event.preventDefault();
				var value = setSeed();
				Randomizer.setSeed(value);
				var profile = getRemoteBlueprint(value, Graphics.genPlanets.bind(Graphics));
			}
		});


    		setTimeout(Graphics.loadMaterials.bind(Graphics, progressBar), 1);
	} else {
	    document.getElementById("webgl-unsupported").innerHTML = "Your graphics card does not seem to support WebGL. <br/><br/> Find out how to get it here: <a href=\"https://get.webgl.org/\" target=\"_blank\">https://get.webgl.org/</a>";
	}
}
document.body.onload = main;
