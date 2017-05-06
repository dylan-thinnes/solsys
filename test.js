const {Factor} = require("./factor.js");
var currfactor = new Factor(23442342465898, 1, false, function () { console.log(this.deepClone()); });