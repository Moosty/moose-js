/**
 * Slots module provides functions for calculating time and slots against the Moose blockchain epoch.
 * @class slots
 *
 * @method beginEpochTime
 * @return Date UTC 05/20/2017 0:00 Am
 */

function beginEpochTime () {
	return new Date(Date.UTC(2017, 6, 9, 20, 0, 0, 0));
}

/**
 * @method getEpochTime
 * @param time
 * @return {number} (time - beginEpochTime) in seconds
 */

function getEpochTime (time) {
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	var d = beginEpochTime();
	var t = d.getTime();
	return Math.floor((time - t) / 1000);
}

/**
 * `interval` is stored as a number in seconds. Value is 10.
 * @property interval
 * @static
 * @final
 * @type Number
 */

/**
 * `delegates` is stored as a number in amount of delegates. Value is 11.
 * @property delegates
 * @static
 * @final
 * @type Number
 */

var interval = 10,
	delegates = 11;

/**
 * @method getTime
 * @param time
 * @return {number}
 */

function getTime (time) {
	return getEpochTime(time);
}

/**
 * @method getRealTime
 * @param epochTime
 * @return {number}
 */

function getRealTime (epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime();
	}
	var d = beginEpochTime();
	var t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
}

/**
 * @method getSlotNumber
 * @param epochTime
 * @return {number}
 */

function getSlotNumber (epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime();
	}

	return Math.floor(epochTime / interval);
}

/**
 * @method getSlotTime
 * @param slot
 * @return {number}
 */

function getSlotTime (slot) {
	return slot * interval;
}

/**
 * @method getNextSlot
 * @return {number}
 */

function getNextSlot () {
	var slot = getSlotNumber();

	return slot + 1;
}

/**
 * @method getLastSlot
 * @return {number}
 */

function getLastSlot (nextSlot) {
	return nextSlot + delegates;
}

module.exports = {
	interval: interval,
	delegates: delegates,
	getTime: getTime,
	getRealTime: getRealTime,
	getSlotNumber: getSlotNumber,
	getSlotTime: getSlotTime,
	getNextSlot: getNextSlot,
	getLastSlot: getLastSlot
};