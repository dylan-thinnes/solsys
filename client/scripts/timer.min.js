/**
 * timer.js - A simple javascript timer with resuming, pausing, elapsed time, delta time, and a multiplier.
 * The time can be reversed, sped up or slowed down using the time multiplier.
 * @author Aaron Shappell
 */

/**
 * Defines a timer object with a multiplier of 1
 * @constructor
 */
var Timer = function(){
    this.elapsedTime = 0;
    this.pauseTime = 0;
    this.lastUpdate = 0;
    this.timePaused = 0;
    this.running = false;
    this.multiplier = 1;
}

/**
 * Updates the timer and returns the delta time since the last update
 * @return {number} the delta time
 */
Timer.prototype.update = function(){
    var delta;
    if(this.running){
        delta = (Date.now() - this.lastUpdate - this.timePaused) * this.multiplier;
        this.lastUpdate = Date.now();
        this.timePaused = 0;
        this.elapsedTime += delta;
    } else{
        delta = 0;
    }
    return delta;
}

/**
 * Starts the timer
 */
Timer.prototype.start = function(){
    this.elapsedTime = 0;
    this.pauseTime = Date.now();
    this.lastUpdate = Date.now();
    this.timePaused = 0;
    this.running = true;
}

/**
 * Stops the timer
 */
Timer.prototype.stop = function(){
    this.elapsedTime = 0;
    this.pauseTime = 0;
    this.lastUpdate = 0;
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
    return this.elapsedTime;
}

/**
 * Gets the elapsed time of the timer in seconds
 * @return {number} the elasped time in seconds
 */
Timer.prototype.getElapsedSeconds = function(){
    return this.getElapsedMillis() / 1000;
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