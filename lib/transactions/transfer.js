/**
 * Transfer module provides functions for creating "in" transfer transactions (balance transfers to an individual song account).
 * @class transfer
 */

var crypto      = require('./crypto.js');
var constants   = require('../constants.js');
var slots       = require('../time/slots.js');

/**
 * @method createTransfer
 * @param secret
 * @param secondSecret
 * @param songId
 *
 * @return {Object}
 */

function createTransfer (secret, secondSecret, songId) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 6,
		amount: 0,
		fee: constants.fees.send,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			songtransfer: {
				songid: songId
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
	createTransfer: createTransfer
};
