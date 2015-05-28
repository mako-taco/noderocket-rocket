'use strict';

import RocketModule from '../rocket-module';
import SmoothSensors from '../smooth-sensors';
import AltitudeTimer from '../altitude-timer';

const PRE_LAUNCH = 'PRE_LAUNCH';
const LAUNCHED = 'LAUNCHED';
const AFTER_CHUTE = 'AFTER_CHUTE';


class ParachuteModule extends RocketModule {
	constructor(rocket, io) {
		super('parachute-smart', rocket, io);
		this.smoothSensors = new SmoothSensors();
		this.altitudeTimer = new AltitudeTimer(.5);
		this.state = PRE_LAUNCH;
	}

	onRocketReady() {
		module.log('Rocket ready!');
	}

	onRocketData(datum) {
		this.log('[%s] %s', this.getName(), this.state);

		this.smoothSensors.mark(datum);

		switch (this.state) {
			case PRE_LAUNCH:
				if (datum.ay < -2) {
					this.state = LAUNCHED;
				}
				break;
			case LAUNCHED:
				this.altitudeTimer.mark(datum);
				if (this.altitudeTimer.shouldDeploy()) {
					this.rocket.deployParachute();
					this.state = AFTER_CHUTE;
				}
				break;
			case AFTER_CHUTE:
				break;

		}
	}

	doEnable() {
		if (!this.enabled) {
			this.rocket.on('rocket.ready', this.onRocketReady);
			this.rocket.on('rocket.data', this.onRocketData);
		}
	}

	doDisable() {
		if (this.enabled) {
			this.rocket.removeListener('rocket.ready', this.onRocketReady);
			this.rocket.removeListener('rocket.data', this.onRocketData);
		}
	}
}
