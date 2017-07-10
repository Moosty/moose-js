var MooseJS = {};
MooseJS.crypto = require('../transactions/crypto');
MooseJS.song = require('../transactions/song');
MooseJS.multisignature = require('../transactions/multisignature');
MooseJS.signature = require('../transactions/signature');
MooseJS.delegate = require('../transactions/delegate');
MooseJS.transaction = require('../transactions/transaction');
MooseJS.transfer = require('../transactions/transfer');
MooseJS.vote = require('../transactions/vote');

/**
 * ParseOfflineRequest module provides automatic routing of new transaction requests which can be signed locally,
 * and then broadcast without any passphrases being transmitted.
 *
 * @method ParseOfflineRequest
 * @param requestType
 * @param options
 * @main moose
 */

function ParseOfflineRequest (requestType, options) {
	if (!(this instanceof ParseOfflineRequest)) {
		return new ParseOfflineRequest(requestType, options);
	}

	this.requestType = requestType;
	this.options = options;
	this.requestMethod = this.httpGETPUTorPOST(requestType);
	this.params = '';

	return this;
}

/**
 * @method checkDoubleNamedAPI
 * @param requestType string
 * @param options
 * @return string
 */

ParseOfflineRequest.prototype.checkDoubleNamedAPI = function (requestType, options) {
	if (requestType === 'transactions' || requestType === 'accounts/delegates') {
		if (options && !options.hasOwnProperty('secret')) {
			requestType = 'getTransactions';
		}
	}

	return requestType;
};

/**
 * @method httpGETPUTorPOST
 * @param requestType string
 * @return string
 */

ParseOfflineRequest.prototype.httpGETPUTorPOST = function (requestType) {
	requestType = this.checkDoubleNamedAPI(requestType, this.options);

	var requestIdentification =  {
		'accounts/open': 'POST',
		'accounts/generatePublicKey': 'POST',
		'delegates/forging/enable': 'NOACTION',
		'delegates/forging/disable': 'NOACTION',
		'songs/stream': 'NOACTION',
		'multisignatures/sign': 'POST',
		'accounts/delegates': 'PUT',
		'transactions': 'PUT',
		'signatures': 'PUT',
		'delegates': 'PUT',
		'songs': 'PUT',
		'multisignatures': 'POST'
	};

	if (!requestIdentification[requestType]) {
		return 'GET';
	} else {
		return requestIdentification[requestType];
	}
};

/**
 * @method checkOfflineRequestBefore
 *
 * @return {object}
 */

ParseOfflineRequest.prototype.checkOfflineRequestBefore = function () {
	if (this.options && this.options.hasOwnProperty('secret')) {
		var accountKeys = MooseJS.crypto.getKeys(this.options['secret']);
		var accountAddress = MooseJS.crypto.getAddress(accountKeys.publicKey);
	}

	var OfflineRequestThis = this;
	var requestIdentification =  {
		'accounts/open': function () {
			return {
				requestMethod: 'GET',
				requestUrl: 'accounts?address=' + accountAddress
			};
		},
		'accounts/generatePublicKey': function () {
			return {
				requestMethod: 'GET',
				requestUrl: 'accounts?address=' + accountAddress
			};
		},
		'delegates/forging/enable': 'POST',
		'delegates/forging/disable': 'POST',
		'songs/stream': 'POST',
		'multisignatures/sign': function () {
			var transaction = MooseJS.multisignature.signTransaction(OfflineRequestThis.options['transaction'],
        OfflineRequestThis.options['secret']);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'signatures',
				params: { signature: transaction }
			};
		},
		'accounts/delegates': function () {
			var transaction = MooseJS.vote.createVote(OfflineRequestThis.options['secret'],
        OfflineRequestThis.options['delegates'], OfflineRequestThis.options['secondSecret'] );
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		},
		'transactions': function () {
			var transaction = MooseJS.transaction.createTransaction(OfflineRequestThis.options['recipientId'],
        OfflineRequestThis.options['amount'], OfflineRequestThis.options['secret'], OfflineRequestThis.options['secondSecret']);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		},
		'signatures': function () {
			var transaction = MooseJS.signature.createSignature(OfflineRequestThis.options['secret'],
        OfflineRequestThis.options['secondSecret']);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		},
		'delegates': function () {
			var transaction = MooseJS.delegate.createDelegate(OfflineRequestThis.options['secret'],
        OfflineRequestThis.options['username'], OfflineRequestThis.options['secondSecret']);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		},
		'songs': function () {
			var SongOptions = {
				title: OfflineRequestThis.options['title'],
				artist: OfflineRequestThis.options['artist'],
				genre: OfflineRequestThis.options['genre'],
				owners: OfflineRequestThis.options['owners'],
				fingerprint: OfflineRequestThis.options['fingerprint'],
				type: OfflineRequestThis.options['type'],
				secret: OfflineRequestThis.options['secret'],
				secondSecret: OfflineRequestThis.options['secondSecret']
			};
			var transaction = MooseJS.song.createSong(SongOptions);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		},
		'multisignatures': function () {
			var transaction = MooseJS.multisignature.createMultisignature(OfflineRequestThis.options['secret'], 
        OfflineRequestThis.options['secondSecret'], OfflineRequestThis.options['keysgroup'], 
        OfflineRequestThis.options['lifetime'], OfflineRequestThis.options['min']);
      
			return {
				requestMethod: 'POST',
				requestUrl: 'transactions',
				params: { transaction: transaction }
			};
		}
	};
  
	return requestIdentification[this.requestType]();
};

/**
 * @method transactionOutputAfter
 * @param requestAnswer
 *
 * @return {object}
 */

ParseOfflineRequest.prototype.transactionOutputAfter = function (requestAnswer) {
	if (this.options['secret']) {
		var accountKeys = MooseJS.crypto.getKeys(this.options['secret']);
		var accountAddress = MooseJS.crypto.getAddress(accountKeys.publicKey);
	}

	var requestIdentification =  {
		'accounts/open': function () {
			if (requestAnswer.error === 'Account not found') {
				return {
					success: 'true',
					'account': {
						'address': accountAddress,
						'unconfirmedBalance': '0',
						'balance': '0',
						'publicKey': accountKeys.publicKey,
						'unconfirmedSignature': '0',
						'secondSignature': '0',
						'secondPublicKey': null,
						'multisignatures': null,
						'u_multisignatures': null
					}
				};
			} else {
				return requestAnswer;
			}
		},
		'accounts/generatePublicKey': function () {
			return {
				'success': 'true',
				'publicKey': accountKeys.publicKey
			};
		},
		'delegates/forging/enable': function () {
			return {
				'success': 'false',
				'error': 'Forging not available via offlineRequest'
			};
		},
		'delegates/forging/disable': function () {
			return {
				'success': 'false',
				'error': 'Forging not available via offlineRequest'
			};
		},
		'songs/stream': function () {
			return {
				'success': 'false',
				'error': 'Stream song not available via offlineRequest'
			};
		},
		'multisignatures/sign': function () {
			return requestAnswer;
		},
		'accounts/delegates': function () {
			return requestAnswer;
		},
		'transactions': function () {
			return requestAnswer;
		},
		'signatures': function () {
			return requestAnswer;
		},
		'delegates': function () {
			return requestAnswer;
		},
		'songs': function () {
			return requestAnswer;
		},
		'multisignatures': function () {
			return requestAnswer;
		}
	};

	return requestIdentification[this.requestType]();
};

module.exports = ParseOfflineRequest;