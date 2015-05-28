'use strict';
var util = require('util');

var RocketModule = require('../rocket-module');
// var SmoothSensors = require('../smooth-sensors');
var AltitudeTimer = require('../altitude-timer');

var PRE_LAUNCH = 'PRE_LAUNCH';
var LAUNCHED = 'LAUNCHED';
var AFTER_CHUTE = 'AFTER_CHUTE';


function ParachuteModule(rocket, io) {
	console.log('Parachute module started');
	RocketModule.call(this, 'smart-parachute', rocket, io);

	// this.smoothSensors = new SmoothSensors();
	this.altitudeTimer = new AltitudeTimer(.5);
	this.state = PRE_LAUNCH;

	this.onRocketReady = function () {
		this.log('Rocket ready!');
	};
	this.onRocketData = function(datum) {
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
	};
}

ParachuteModule.prototype = {

	doEnable: function() {
		if (!this.enabled) {
			this.rocket.on('rocket.ready', this.onRocketReady);
			this.rocket.on('rocket.data', this.onRocketData);
		}
	},

	doDisable: function() {
		if (this.enabled) {
			this.rocket.removeListener('rocket.ready', this.onRocketReady);
			this.rocket.removeListener('rocket.data', this.onRocketData);
		}
	}
};

util.inherits(ParachuteModule, RocketModule);

module.exports = ParachuteModule;
