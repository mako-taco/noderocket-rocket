import RocketModule from '../rocket-module';
import SmoothSensors from '../smooth-sensors';

class ParachuteModule extends RocketModule {
	constructor(rocket, io) {
		super('parachute-smart', rocket, io);
		this.smoothSensors = new SmoothSensors();
	}

	onRocketReady() {
		console.log('Rocket ready!');
	}

	onRocketData(datum) {
		this.smoothSensors.mark(datum);
		console.log(this.smoothSensors.getAltitude());
	}

	doEnable() {
		if(!this.enabled) {
			this.rocket.on('rocket.ready', this.onRocketReady);
			this.rocket.on('rocket.data', this.onRocketData);
		}
	}

	doDisable() {
		if(this.enabled) {
			this.rocket.removeListener('rocket.ready', this.onRocketReady);
			this.rocket.removeListener('rocket.data', this.onRocketData);
		}
	}
}