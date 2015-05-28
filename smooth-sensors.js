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
		this.quartileIndex1 = Math.floor(this.data.length * .25);;
		this.quartileIndex3 = Math.floor(this.data.length * .75);;
		this.medianIndex = Math.floor(this.data.length * .50);;
		let data = this.data.slice().sort((a, b) => a - b);
		let interQuartileDistance = data[this.quartileIndex3] - data[quartileIndex1];
		let median = data[this.medianIndex];
		let min = median - 1.5 * interQuartileDistance;
		let max = median + 1.5 * interQuartileDistance;

		return this.data.filter(datum => {
			let val = datum[field];
			return val < max && val > min;
		});
	},

	getAltitude: function() {
		let noOutliers = this.data.removeOutliers('alt');
		let sum = noOutliers.map(x => x.alt).reduce((a, b) => a + b);

		return sum / noOutliers.length;
	}
};

module.exports = SmoothSensors;
