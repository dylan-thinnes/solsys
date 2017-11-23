// Emitter is a class for making simple event emitters and listeners. Also works for PubSub implementation.
var Emitter = function () {
	this.listeners = {};
}
Emitter.prototype.on = function (name, listener, count) {
	if (this.listeners[name] === undefined) this.listeners[name] = [];
	var id = (Math.random() * Math.pow(2, 32)).toString(36);
	this.listeners[name][id] = {l: listener, c: count};
	return this.off.bind(this, name, id); //Prevents chaining, but I prefer added functionality over sugar.
}
// Only listens once.
Emitter.prototype.once = function (name, listener) {
	this.on(name, listener, 1);
}
// Removes a function of a specific id from the named event's callback list
Emitter.prototype.off = function (name, id) {
	if (this.listeners[name] === undefined || this.listeners[name][id] === undefined) return;
	delete this.listeners[name][id];
}
// Emits the event by calling all its associated listeners
Emitter.prototype.emit = function (name, event) {
	if (this.listeners[name] === undefined) return;
	for (var id in this.listeners[name]) { this.callListener(name, id, event); }
}
// Passes the event to the 
Emitter.prototype.callListener = function (name, id, event) {
	this.listeners[name][id].l(event);
	if (this.listeners[name][id].c) this.listeners[name][id].c--;
	if (this.listeners[name][id].c === 0) delete this.listeners[name][id];
}
