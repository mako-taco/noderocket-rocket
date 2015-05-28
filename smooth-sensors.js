'use strict';

export default class SmoothSensors {
	constructor(windowSize = 10) {
		this.quartileIndex1 = Math.floor(this.data.length * .25);;
		this.quartileIndex3 = Math.floor(this.data.length * .75);;
		this.medianIndex = Math.floor(this.data.length * .50);;
		this.windowSize = windowSize;
		this.data = new Array(windowSize);
		this.times = new Array(windowSize);
	}

	mark(datum) {
		this.data.push(datum);
		this.data.shift();
	}

	/**
	 * Get an array of rocket data with outliers for a specific field removed
	 *
	 * @param {String} field - a field in rocketData to filter on
	 * @return {RocketData[]}
	 */
	removeOutliers(field) {
		let data = this.data.slice().sort((a, b) => a - b);
		let interQuartileDistance = data[this.quartileIndex3] - data[quartileIndex1];
		let median = data[this.medianIndex];
		let min = median - 1.5 * interQuartileDistance;
		let max = median + 1.5 * interQuartileDistance;

		return this.data.filter(datum => {
			let val = datum[field];
			return val < max && val > min;
		});
	}

	getAltitude() {
		let noOutliers = this.data.removeOutliers('alt');
		let sum = noOutliers.map(x => x.alt).reduce((a, b) => a + b);

		return sum / noOutliers.length;
	}
}
