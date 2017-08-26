var Timer = function(){
    this.startTime = 0;
    this.pauseTime = 0;
    this.lastTime = 0;
    this.timePaused = 0;
    this.running = false;
}

Timer.prototype.start = function(){
    this.startTime = Date.now();
    this.pauseTime = Date.now();
    this.lastTime = Date.now();
    this.timePaused = 0;
    this.running = true;
}

Timer.prototype.stop = function(){
    this.startTime = 0;
    this.pauseTime = 0;
    this.lastTime = 0;
    this.running = false;
}

Timer.prototype.resume = function(){
    if(!this.running){
        this.timePaused += Date.now() - this.pauseTime;
        this.running = true;
    }
}

Timer.prototype.pause = function(){
    if(this.running){
        this.pauseTime = Date.now();
        this.running = false;
    }
}

Timer.prototype.isRunning = function(){
    return this.running;
}

Timer.prototype.getElapsedMillis = function(){
    return Date.now() - this.startTime - ((this.running) ? 0 : (Date.now() - this.pauseTime)) - this.timePaused;
}

Timer.prototype.getElapsedSeconds = function(){
    return this.getElapsedMillis() / 1000;
}

Timer.prototype.getDeltaTime = function(){
    var delta = Date.now() - this.lastTime;
    this.lastTime = Date.now();
    return delta;
}