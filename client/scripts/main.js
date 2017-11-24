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
	

		var wakeableUi = new Wakeable(document.getElementById("ui"));
		document.getElementById("graphics").addEventListener("mousemove", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("ui").addEventListener("mousemove", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("graphics").addEventListener("touchstart", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("ui").addEventListener("touchstart", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("input").addEventListener("keydown", wakeableUi.wake.bind(wakeableUi));
		document.getElementById("input").addEventListener("focus", wakeableUi.keepAwake.bind(wakeableUi));
		document.getElementById("input").addEventListener("blur", wakeableUi.unkeepAwake.bind(wakeableUi));
		window.setInterval(wakeableUi.sleep.bind(wakeableUi), 100);
		wakeableUi.sleep();

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

		var modalContainer = document.getElementById("modalContainer");
		modals = {
			intro: new Modal(document.getElementById("intro"), modalContainer),
			sharing: new Modal(document.getElementById("sharing"), modalContainer)
		}
		modals.intro.on("unfocus", wakeableUi.wake.bind(wakeableUi));

		var start = document.getElementsByClassName("start")[0];
		var showStartButton = function () {
			start.innerHTML = "Start the Program >";
			start.id = "loaded";
			start.addEventListener("click", (function () { this.focused = false; }).bind(modals.intro));
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
		render();
}
document.body.onload = main;
