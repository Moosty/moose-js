if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var moose = common.moose;
}

describe('song.js', function () {

	var song = moose.song;

	it('should be object', function () {
		(song).should.be.type('object');
	});

	it('should have properties', function () {
		(song).should.have.property('createSong');
	});

	describe('#createSong', function () {

		var createSong = song.createSong;
		var trs = null;

		var options = {
			type: 0,
			genre: 2,
			title: 'Moose the song',
			artist: 'the MooseCoin trio',
			fingerprint: 'abc',
			owners: [
				{
					publicKey: '',
					stake: 100
				}
			]
		};

		it('should be a function', function () {
			(createSong).should.be.type('function');
		});

		it('should create song without second signature', function () {
			trs = createSong('secret', null, options);
			(trs).should.be.ok;
		});

		it('should create delegate with second signature', function () {
			trs = createSong('secret', 'secret 2', options);
			(trs).should.be.ok;
		});

		describe('returned song', function () {

			// var keys = moose.crypto.getKeys('secret');
			var secondKeys = moose.crypto.getKeys('secret 2');

			it('should be object', function () {
				(trs).should.be.type('object');
			});

			it('should have id as string', function () {
				(trs.id).should.be.type('string');
			});

			it('should have type as number and equal 5', function () {
				(trs.type).should.be.type('number').and.equal(5);
			});

			it('should have amount as number and equal 0', function () {
				(trs.amount).should.be.type('number').and.equal(0);
			});

			it('should have fee as number and equal 2500000000', function () {
				(trs.fee).should.be.type('number').and.equal(2500000000);
			});

			it('should have null recipientId', function () {
				trs.should.have.property('recipientId').equal(null);
			});

			it('should have senderPublicKey as hex string', function () {
				(trs.senderPublicKey).should.be.type('string').and.match(function () {
					try {
						new Buffer(trs.senderPublicKey, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});

			it('should have timestamp as number', function () {
				(trs.timestamp).should.be.type('number').and.not.NaN;
			});

			it('should have song inside asset', function () {
				(trs.asset).should.have.property('song');
			});

			describe('song asset', function () {

				it('should be ok', function () {
					(trs.asset.song).should.be.ok;
				});

				it('should be object', function () {
					(trs.asset.song).should.be.type('object');
				});

				it('should have genre property', function () {
					(trs.asset.song).should.have.property('genre').and.equal(options.genre);
				});

				it('should have title property', function () {
					(trs.asset.song).should.have.property('title').and.equal(options.title);
				});

				it('should have artist property', function () {
					(trs.asset.song).should.have.property('artist').and.equal(options.artist);
				});

				it('should have type property', function () {
					(trs.asset.song).should.have.property('type').and.equal(options.type);
				});

				it('should have fingerprint property', function () {
					(trs.asset.song).should.have.property('fingerprint').and.equal(options.fingerprint);
				});

				it('should have owners property', function () {
					(trs.asset.song).should.have.property('owners').and.equal(options.owners);
				});
			});

			it('should have signature as hex string', function () {
				(trs.signature).should.be.type('string').and.match(function () {
					try {
						new Buffer(trs.signature, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});

			it('should have second signature in hex', function () {
				(trs).should.have.property('signSignature').and.type('string').and.match(function () {
					try {
						new Buffer(trs.signSignature, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});

			it('should be signed correctly', function () {
				var result = moose.crypto.verify(trs);
				(result).should.be.ok;
			});

			it('should not be signed correctly now', function () {
				trs.amount = 10000;
				var result = moose.crypto.verify(trs);
				(result).should.be.not.ok;
			});

			it('should be second signed correctly', function () {
				trs.amount = 0;
				var result = moose.crypto.verifySecondSignature(trs, secondKeys.publicKey);
				(result).should.be.ok;
			});

			it('should not be second signed correctly now', function () {
				trs.amount = 10000;
				var result = moose.crypto.verifySecondSignature(trs, secondKeys.publicKey);
				(result).should.be.not.ok;
			});
		});
	});
});
