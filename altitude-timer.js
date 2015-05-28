class AltitudeTimer {
	constructor(threshold = 0) {
		this.previousAltitude = 0;
		this.previousTime = 0;
		this.altitude = 0;
		this.time = 0;

		this.velocity = 0;
		this.threshold = threshold;

		this.firstTime = true;
		this.deploy = false;
	}

	mark(data) {
		this.previousTime = this.time;
		this.time = data.dt.getTime();
		this.previousAltitude = this.altitude;
		this.altitude = data.alt;

		let dt = (this.time - this.previousTime) / 1000;
		let da = (this.altitude - this.previousAltitude);

		this.velocity = da / dt;
		console.log(this.velocity);

		if (this.firstTime) {
			this.firstTime = false;
		}
		else if (Math.abs(this.velocity) < this.threshold) {
			this.deploy = true;
		}
	}

	shouldDeploy() {
		return this.deploy;
	}
}
