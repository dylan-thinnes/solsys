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
		var share = new Button(document.getElementById("share"));
		var info = new Button(document.getElementById("info"));
		var link = new Button(document.getElementById("link"), true);
		var facebook = new Button(document.getElementById("facebook"), true);
		var twitter = new Button(document.getElementById("twitter"), true);
		var reddit = new Button(document.getElementById("reddit"), true);
		var mail = new Button(document.getElementById("mail"), true);
		var sharingTooltip = document.getElementById("tooltip");
		var setSharingLinks = function () {
			mail.node.href = "";
			facebook.node.href = "";
			twitter.node.href = "";
			reddit.node.href = "";
		}
		var setSharingTooltip = function (text) {
			sharingTooltip.innerHTML = text;
		}
		mail.node.addEventListener("mouseenter", setSharingTooltip.bind(this, "Mail to a Friend"));
		mail.node.addEventListener("mouseleave", setSharingTooltip.bind(this, "Share on Social Media"));
		link.node.addEventListener("mouseenter", setSharingTooltip.bind(this, "Copy this System's Link to Clipboard"));
		link.node.addEventListener("mouseleave", setSharingTooltip.bind(this, "Share on Social Media"));
		link.on("click", copyUrlToClipboard);
		link.on("click", setSharingTooltip.bind(this, "Copied URL to clipboard!"));
		facebook.node.addEventListener("mouseenter", setSharingTooltip.bind(this, "Update Your Status"));
		facebook.node.addEventListener("mouseleave", setSharingTooltip.bind(this, "Share on Social Media"));
		twitter.node.addEventListener("mouseenter", setSharingTooltip.bind(this, "Tweet About It"));
		twitter.node.addEventListener("mouseleave", setSharingTooltip.bind(this, "Share on Social Media"));
		reddit.node.addEventListener("mouseenter", setSharingTooltip.bind(this, "Post on Reddit"));
		reddit.node.addEventListener("mouseleave", setSharingTooltip.bind(this, "Share on Social Media"));

		var modalContainer = document.getElementById("modalContainer");
		modals = {
			intro: new Modal(document.getElementById("intro"), modalContainer),
			credits: new Modal(document.getElementById("credits"), modalContainer),
			sharing: new Modal(document.getElementById("sharing"), modalContainer)
		}
		var creditsClose = new Button(modals.credits.node.getElementsByClassName("close")[0]);
		creditsClose.node.addEventListener("click", (function () { this.focused = false; }).bind(modals.credits));
		info.on("click", (function () { this.focused = true; }).bind(modals.credits));
		var sharingClose = new Button(modals.sharing.node.getElementsByClassName("close")[0]);
		sharingClose.node.addEventListener("click", (function () { this.focused = false; }).bind(modals.sharing));
		share.on("click", (function () { this.focused = true; }).bind(modals.sharing));
		modals.intro.on("unfocus", wakeableUi.wake.bind(wakeableUi));

		var start = document.getElementsByClassName("start")[0];
		var showStartButton = function () {
			start.innerHTML = "Start the Program >";
			start.id = "loaded";
			start.addEventListener("click", (function () { this.focused = false; }).bind(modals.intro));
		}
		progressBar.on("finishAll", showStartButton);

		var setValue = function () {
			updateSharingUrls();
			var value = new Seed(location.hash.slice(1)).value;
			document.getElementById("number").innerHTML = value;
			Randomizer.setSeed(value);
			var profile = getRemoteBlueprint(value, Graphics.genPlanets.bind(Graphics));
		}
		var input = document.getElementById("input");
		if (location.hash.slice(1) === "") location.hash = (["Alfa","Brav","Char","Delt","Echo","Foxt","Golf","Hote","Indi","Juli","Kilo","Lima","Mike","Nove","Osca","Papa","Queb","Rome","Sier","Tang","Unif","Vict","Whis","XRay","Yank","Zulu"])[Math.floor(Math.random()*26)];
		input.value = location.hash.slice(1);
		setValue();
		document.getElementById("input").addEventListener("keypress", function (event) {
			if (event.keyCode === 13 || event.charCode === 13) {
				event.preventDefault();
				location.hash = input.value;
			}
		});
		window.addEventListener("hashchange", setValue);


    		setTimeout(Graphics.loadMaterials.bind(Graphics, progressBar), 1);
	} else {
	    document.getElementById("webgl-unsupported").innerHTML = "Your graphics card does not seem to support WebGL. <br/><br/> Find out how to get it here: <a href=\"https://get.webgl.org/\" target=\"_blank\">https://get.webgl.org/</a>";
	}
		render();
}
document.body.onload = main;
