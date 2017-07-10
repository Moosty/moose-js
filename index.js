/**
 * Index module comprising all submodules of moose-js.
 * @module moose
 * @main moose
 */

global.Buffer = global.Buffer || require('buffer').Buffer;
global.naclFactory = require('js-nacl');

global.naclInstance;
naclFactory.instantiate(function (nacl) {
	naclInstance = nacl;
});

moose = {
	crypto : require('./lib/transactions/crypto.js'),
	song: require('./lib/transactions/song.js'),
	delegate : require('./lib/transactions/delegate.js'),
	multisignature : require('./lib/transactions/multisignature.js'),
	signature : require('./lib/transactions/signature.js'),
	transaction : require('./lib/transactions/transaction.js'),
	transfer: require('./lib/transactions/transfer'),
	vote : require('./lib/transactions/vote.js'),
	api: require('./lib/api/mooseApi'),
	slots: require('./lib/time/slots')
};

module.exports = moose;
