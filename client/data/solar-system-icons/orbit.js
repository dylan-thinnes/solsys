ctx = document.getElementById("planetCanvas").getContext("2d");
ctx.clearRect(0, 0, 1000, 1000);
ctx.save();
ctx.strokeStyle = "#ffffff";
ctx.fillStyle = "transparent";
ctx.lineWidth = 1;
ctx.arc(500, 500, 500, 0, 2 * Math.PI, false);
ctx.stroke();
ctx.restore();