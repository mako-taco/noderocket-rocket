'use strict';

function SmoothSensors (windowSize) {
	this.windowSize = windowSize || 10;
	this.data = [];
	this.times = [];
}

SmoothSensors.prototype = {
	mark: function (datum) {
		this.data.push(datum);
		if(this.data.length > this.windowSize) {
			this.data.shift();
		}
	},

	/**
	 * Get an array of rocket data with outliers for a specific field removed
	 *
	 * @param {String} field - a field in rocketData to filter on
	 * @return {RocketData[]}
	 */
	removeOutliers: function (field) {
		this.quartileIndex1 = Math.floor(this.data.length * .25);
		this.quartileIndex3 = Math.floor(this.data.length * .75);
		this.medianIndex = Math.floor(this.data.length * .50);
		var data = this.data.slice().sort(function (a, b) {
			return a - b;
		});
		var interQuartileDistance = data[this.quartileIndex3] - data[this.quartileIndex1];
		var median = data[this.medianIndex];
		var min = median - 1.5 * interQuartileDistance;
		var max = median + 1.5 * interQuartileDistance;

		return this.data.filter(function(datum) {
			var val = datum[field];
			return val < max && val > min;
		});
	},

	getAltitude: function() {
		var noOutliers = this.data.removeOutliers('alt');
		var sum = noOutliers.map(function (x) {
			return x.alt;
		}).reduce(function(a, b) {
			return a + b;
		});

		return sum / noOutliers.length;
	}
};

module.exports = SmoothSensors;
