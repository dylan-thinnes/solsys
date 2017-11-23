/**
 * timer.js - A simple javascript timer with resuming, pausing, elapsed time, and delta time.
 * @author Aaron Shappell
 */

/**
 * Defines a timer object with a multiplier of 1
 * @constructor
 */
var Timer = function(){
    this.startTime = 0;
    this.pauseTime = 0;
    this.lastTime = 0;
    this.timePaused = 0;
    this.running = false;
    this.multiplier = 1;
}

/**
 * Starts the timer
 */
Timer.prototype.start = function(){
    this.startTime = Date.now();
    this.pauseTime = Date.now();
    this.lastTime = Date.now();
    this.timePaused = 0;
    this.running = true;
}

/**
 * Stops the timer
 */
Timer.prototype.stop = function(){
    this.startTime = 0;
    this.pauseTime = 0;
    this.lastTime = 0;
    this.running = false;
}

/**
 * Resumes the timer
 */
Timer.prototype.resume = function(){
    if(!this.running){
        this.timePaused += Date.now() - this.pauseTime;
        this.running = true;
    }
}

/**
 * Pauses the timer
 */
Timer.prototype.pause = function(){
    if(this.running){
        this.pauseTime = Date.now();
        this.running = false;
    }
}

/**
 * Gets if the timer is running or not
 * @return {boolean} running state of the timer
 */
Timer.prototype.isRunning = function(){
    return this.running;
}

/**
 * Gets the elapsed time of the timer in milliseconds
 * @return {number} the elasped time in milliseconds
 */
Timer.prototype.getElapsedMillis = function(){
    return Date.now() - this.startTime - ((this.running) ? 0 : (Date.now() - this.pauseTime)) - this.timePaused;
}

/**
 * Gets the elapsed time of the timer in seconds
 * @return {number} the elasped time in seconds
 */
Timer.prototype.getElapsedSeconds = function(){
    return this.getElapsedMillis() / 1000;
}

/**
 * Gets the delta time of the timer
 * @return {number} the delta time
 */
Timer.prototype.getDeltaTime = function(){
    var delta = Date.now() - this.lastTime;
    this.lastTime = Date.now();
    return delta;
}

/**
 * 
 * @return {number} the multiplied elasped time in milliseconds
 */
Timer.prototype.getMultipliedElapsedMillis = function(){
    return this.getElapsedMillis() * this.multiplier;
}

/**
 * Gets the multiplied elapsed time of the timer in seconds
 * @return {number} the multiplied elasped time in seconds
 */
Timer.prototype.getMultipliedElapsedSeconds = function(){
    return this.getElapsedSeconds() * this.multiplier;
}

/**
 * Gets the multiplied delta time of the timer
 * @return {number} the multiplied delta time
 */
Timer.prototype.getMultipliedDeltaTime = function(){
    return this.getDeltaTime() * this.multiplier;
}

/**
 * Sets the timer multiplier
 * @param {number} multiplier the multiplier to be set
 */
Timer.prototype.setMultiplier = function(multiplier){
    this.multiplier = multiplier;
}

/**
 * Gets the timer multiplier
 * @return {number} the multiplier
 */
Timer.prototype.getMultiplier = function(){
    return this.multiplier;
}