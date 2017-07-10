/**
 * Song module provides functions used to create song registration transactions.
 * @class song
 */

var crypto      = require('./crypto.js');
var constants   = require('../constants.js');
var slots       = require('../time/slots.js');

/**
 * @method createSong
 * @param secret
 * @param secondSecret
 * @param options
 *
 * @return {Object}
 */

function createSong (secret, secondSecret, options) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 5,
		amount: 0,
		fee: constants.fees.song,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			song: {
				type: options.type,
				title: options.title,
				artist: options.artist,
				genre: options.genre,
				owners: options.owners,
				fingerprint: options.fingerprint
			}
		}
	};

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createSong: createSong
};
