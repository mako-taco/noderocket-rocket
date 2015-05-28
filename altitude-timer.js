function AltitudeTimer(threshold) {
	this.previousAltitude = 0;
	this.previousTime = 0;
	this.altitude = 0;
	this.time = 0;

	this.velocity = 0;
	this.threshold = threshold || 0;

	this.firstTime = true;
	this.deploy = false;
}

AltitudeTimer.prototype.mark = function(data) {
	this.previousTime = this.time;
	this.time = data.dt;
	this.previousAltitude = this.altitude;
	this.altitude = data.alt;

	var dt = (this.time - this.previousTime) / 1000;
	var da = (this.altitude - this.previousAltitude);

	this.velocity = da / dt;
	console.log(this.time + ', ' + this.altitude);

	if (this.firstTime) {
		this.firstTime = false;
	}
	else if (Math.abs(this.velocity) < this.threshold) {
		this.deploy = true;
	}
};

AltitudeTimer.prototype.shouldDeploy = function() {
	return this.deploy;
};

module.exports = AltitudeTimer;
