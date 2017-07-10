if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var moose = common.moose;
}
describe('transfer.js', function () {

	var transfer = moose.transfer;

	it('should be ok', function () {
		(transfer).should.be.ok;
	});

	it('should be object', function () {
		(transfer).should.be.type('object');
	});

	it('should have properties', function () {
		(transfer).should.have.property('createTransfer');
	});

	describe('#createTransfer', function () {

		var createTransfer = moose.transfer.createTransfer;
		var transferTransaction = createTransfer('secret', 'secondSecret', '1234213');

		it('should be a function', function () {
			(createTransfer).should.be.type('function');
		});

		it('should create a transfer song transaction', function () {
			(transferTransaction).should.be.type('object');
		});

		it('should create a transfer song transaction type 6', function () {
			(transferTransaction.type).should.be.equal(6);
		});

		it('should create a transfer song transaction with song id in asset', function () {
			(transferTransaction.asset.songtransfer.songid).should.be.equal('1234213');
		});

		it('should create a transfer song transaction with first signature', function () {
			(transferTransaction.signature).should.be.ok;
		});

		it('should create a transfer song transaction with second signature', function () {
			(transferTransaction.signSignature).should.be.ok;
		});

		it('should create a transfer song transaction with just one signature', function () {
			var transferTransactionOneSignature = createTransfer('secret', '', '1234213');
			(transferTransactionOneSignature.signature).should.be.ok;
			expect(transferTransactionOneSignature.secondSignature).to.be.undefined;
		});
	});
});
