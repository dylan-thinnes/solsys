// The Blueprint class turns factorization profiles into recursive collections of planets
//     that can be easily parsed by the graphical functions like addPlanets
Blueprint = function(profile){
    this.profile = JSON.parse(profile);
    this.system = {
        type: Blueprint.POSITIVE,
        orbitRadius: 0,
        scale: 1,
        children: []
    }
    this.orbitHistory = [this.system];
    this.genChildren(this.profile);
    this.setSystemWidths(this.system, 0);
}

// The genChildren function takes in a FactorProfile node and decides what to do
Blueprint.prototype.genChildren = function (node) {
    if (node.isPrime) {
        if (isNaN(node.piX) === true) {
            var newLength = this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.piX);
            this.orbitHistory.pop();
        } else if (parseInt(node.piX) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.SKIP,
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                children: []
            });
        } else if (parseInt(node.piX) === 0) {
            // Do nothing
        } else {
            throw "piX type error: " + node.piX;
        }

        if (isNaN(node.power) === true) {
            var newLength = this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.POSITIVE,
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                children: []
            });
            this.orbitHistory.push(this.orbitHistory[this.orbitHistory.length - 1].children[newLength - 1]);
            this.genChildren(node.power);
            this.orbitHistory.pop();
        } else if (parseInt(node.power) === 1) {
            this.orbitHistory[this.orbitHistory.length - 1].children.push({
                type: Blueprint.POSITIVE,
                orbitRadius: undefined,
                scale: Math.pow(Blueprint.CHILD, this.orbitHistory.length),
                children: []
            });
        } else if (parseInt(node.power) === 0) {
            throw "power type error: 0";
        } else {
            throw "power type error: " + node.power;
        }        
    } else {
        if(node.factors){
            for (var ii = node.factors.length - 1; ii >= 0; ii--) {
                this.genChildren(node.factors[ii]);
            }
        }
    }
}

// The setSystemWidths function is used to calculate and set the widths of given planet systems, and in the process set radii.
Blueprint.prototype.setSystemWidths = function(system, depth){
    var width = 1;
    var radius = 0.5;
    if(system.children){
        width += 2 * system.children.length * Blueprint.SPACING;
        for(var i = 0; i < system.children.length; i++){
            radius += Blueprint.SPACING;
            width += 2 * Blueprint.CHILD * this.setSystemWidths(system.children[i], depth + 1);
            radius += Blueprint.CHILD * system.children[i].width / 2;
            system.children[i].orbitRadius = Math.pow(Blueprint.CHILD, depth) * radius;
            radius += Blueprint.CHILD * system.children[i].width / 2;
        }
    }
    system.width = width;
    return width;
}

Blueprint.SKIP = 0;
Blueprint.POSITIVE = 1;
Blueprint.NEGATIVE = -1;
Blueprint.CHILD = 0.9;
Blueprint.SPACING = /*Math.pow(0.618033988749894, 2)*/0.1;

var testData = {"value": "469920081273", "isPrime": false, "factors": [{"value": "156640027091", "isPrime": true, "power": "1", "piX": {"value": "6333243058", "isPrime": false, "factors": [{"value": "837509", "isPrime": true, "power": "1", "piX": {"value": "66665", "isPrime": false, "factors": [{"value": "199", "isPrime": true, "power": "1", "piX": {"value": "26", "isPrime": false, "factors": [{"value": "13", "isPrime": true, "power": "1", "piX": {"value": "2", "isPrime": true, "power": {"value": "2", "isPrime": true, "power": "1", "piX": "0"}, "piX": "0"}}, {"value": "2", "isPrime": true, "power": "1", "piX": "0"}]}}, {"value": "67", "isPrime": true, "power": "1", "piX": {"value": "15", "isPrime": false, "factors": [{"value": "5", "isPrime": true, "power": "1", "piX": "0"}, {"value": "3", "isPrime": true, "power": "1", "piX": "1"}]}}, {"value": "5", "isPrime": true, "power": "1", "piX": {"value": "2", "isPrime": true, "power": "1", "piX": "0"}}]}}, {"value": "199", "isPrime": true, "power": "1", "piX": {"value": "37", "isPrime": true, "power": "1", "piX": {"value": "11", "isPrime": true, "power": "1", "piX": {"value": "2", "isPrime": true, "power": {"value": "2", "isPrime": true, "power": "1", "piX": "0"}, "piX": "0"}}}}, {"value": "19", "isPrime": true, "power": "1", "piX": {"value": "6", "isPrime": false, "factors": [{"value": "3", "isPrime": true, "power": "1", "piX": "0"}, {"value": "2", "isPrime": true, "power": "1", "piX": "0"}]}}, {"value": "2", "isPrime": true, "power": "1", "piX": "0"}]}}, {"value": "3", "isPrime": true, "power": "1", "piX": "1"}]};
var blueprint = new Blueprint(JSON.stringify(testData));
console.log(blueprint.system);