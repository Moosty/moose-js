if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var moose = common.moose;
	var sinon = common.sinon;
	process.env.NODE_ENV = 'test';
}

describe('Moose.api()', function () {

	var MOOSE = moose.api();

	describe('moose.api()', function () {

		it('should create a new instance when using moose.api()', function () {
			(MOOSE).should.be.ok();
		});

		it('new moose.api() should be Object', function () {
			(MOOSE).should.be.type('object');
		});

		it('should use testnet peer for testnet settings', function () {
			var TESTMOOSE = moose.api({ testnet: true });

			(TESTMOOSE.port).should.be.equal(4460);
			(TESTMOOSE.testnet).should.be.equal(true);
		});

	});

	describe('#listPeers', function () {
		it('should give a set of the peers', function () {
			(MOOSE.listPeers()).should.be.ok;
			(MOOSE.listPeers()).should.be.type.Object;
			(MOOSE.listPeers().official.length).should.be.equal(4);
			(MOOSE.listPeers().testnet.length).should.be.equal(1);
		});
	});

	describe('.currentPeer', function () {

		it('currentPeer should be set by default', function () {
			(MOOSE.currentPeer).should.be.ok;
		});
	});

	describe('#getNethash', function () {

		it('Nethash should be hardcoded variables', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa',
				'broadhash': 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa',
				'os': 'moose-js-api',
				'version': '0.0.1',
				'minVersion': '>=0.0.1',
				'port': 4440
			};
			(MOOSE.getNethash()).should.eql(NetHash);
		});

		it('should give corret Nethash for testnet', function () {
			MOOSE.setTestnet(true);

			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa',
				'broadhash': 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa',
				'os': 'moose-js-api',
				'version': '0.0.1',
				'minVersion': '>=0.0.1',
				'port': 4460
			};

			(MOOSE.getNethash()).should.eql(NetHash);
		});


		it('should be possible to use my own Nethash', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': '123',
				'broadhash': 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa',
				'os': 'moose-js-api',
				'version': '0.0.0a',
				'minVersion': '>=0.0.1',
				'port': 4440
			};
			var MOOSENethash = moose.api({ nethash: '123' });

			(MOOSENethash.nethash).should.eql(NetHash);
		});
	});

	describe('#setTestnet', function () {

		it('should set to testnet', function () {
			var MOOSECOIN = moose.api();
			MOOSECOIN.setTestnet(true);

			(MOOSECOIN.testnet).should.be.true;
		});

		it('should set to mainnet', function () {
			var MOOSECOIN = moose.api();
			MOOSECOIN.setTestnet(false);

			(MOOSECOIN.testnet).should.be.false;
		});
	});

	describe('#setNode', function () {

		it('should be able to set my own node', function () {
			var myOwnNode = 'myOwnNode.com';
			MOOSE.setNode(myOwnNode);

			(MOOSE.currentPeer).should.be.equal(myOwnNode);
		});

		it('should select a node when not explicitly set', function () {
			MOOSE.setNode();

			(MOOSE.currentPeer).should.be.ok();
		});
	});

	describe('#selectNode', function () {

		it('should return the node from initial settings when set', function () {
			var MooseUrlInit = moose.api({ port: 4460, node: 'localhost', ssl: true, randomPeer: false });

			(MooseUrlInit.selectNode()).should.be.equal('localhost');
		});
	});

	describe('#getRandomPeer', function () {

		it('should give a random peer', function () {
			(MOOSE.getRandomPeer()).should.be.ok();
		});
	});

	describe('#banNode', function () {

		it('should add current node to MOOSE.bannedPeers', function () {
			var currentNode = MOOSE.currentPeer;
			MOOSE.banNode();

			(MOOSE.bannedPeers).should.containEql(currentNode);
		});
	});

	describe('#getFullUrl', function () {

		it('should give the full url inclusive port', function () {
			var MooseUrlInit = moose.api({ port: 4460, node: 'localhost', ssl: false });
			var fullUrl = 'http://localhost:4460';

			(MooseUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});

		it('should give the full url without port and with SSL', function () {
			var MooseUrlInit = moose.api({ port: '', node: 'localhost', ssl: true });
			var fullUrl = 'https://localhost';

			(MooseUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});
	});

	describe('#getURLPrefix', function () {

		it('should be http when ssl is false', function () {
			MOOSE.setSSL(false);

			(MOOSE.getURLPrefix()).should.be.equal('http');
		});

		it('should be https when ssl is true', function () {
			MOOSE.setSSL(true);

			(MOOSE.getURLPrefix()).should.be.equal('https');
		});
	});

	describe('#trimObj', function () {

		var untrimmedObj = {
			' my_Obj ': ' myval '
		};

		var trimmedObj = {
			'my_Obj': 'myval'
		};

		it('should not be equal before trim', function () {
			(untrimmedObj).should.not.be.equal(trimmedObj);
		});

		it('should be equal after trim an Object in keys and value', function () {
			var trimIt = MOOSE.trimObj(untrimmedObj);

			(trimIt).should.be.eql(trimmedObj);
		});

		it('should accept numbers and strings as value', function () {
			var obj = {
				'myObj': 2
			};

			var trimmedObj = MOOSE.trimObj(obj);
			(trimmedObj).should.be.ok;
			(trimmedObj).should.be.eql({ myObj: '2' });
		});
	});

	describe('#toQueryString', function () {

		it('should create a http string from an object. Like { obj: "myval", key: "myval" } -> obj=myval&key=myval', function () {
			var myObj = {
				obj: 'myval',
				key: 'my2ndval'
			};

			var serialised = MOOSE.toQueryString(myObj);

			(serialised).should.be.equal('obj=myval&key=my2ndval');
		});
	});

	describe('#serialiseHttpData', function () {

		it('should create a http string from an object and trim.', function () {
			var myObj = {
				obj: ' myval',
				key: 'my2ndval '
			};

			var serialised = MOOSE.serialiseHttpData(myObj);

			(serialised).should.be.equal('?obj=myval&key=my2ndval');
		});
	});

	describe('#getAddressFromSecret', function () {

		it('should create correct address and publicKey', function () {
			var address = {
				publicKey: 'a4465fd76c16fcc458448076372abf1912cc5b150663a64dffefe550f96feadd',
				address: '12475940823804898745M'
			};

			(MOOSE.getAddressFromSecret('123')).should.eql(address);
		});
	});

	describe('#checkRequest', function () {

		it('should identify GET requests', function () {
			var requestType = 'api/loader/status';
			var options = '';
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/sync';
			var options = '';
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/ping';
			var options = '';
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');
		});

		it('should identify POST requests', function () {
			var requestType = 'accounts/generatePublicKey';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'multisignatures/sign';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');
		});

		it('should identify PUT requests', function () {
			var requestType = 'accounts/delegates';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'signatures';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'transactions';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');
		});

		it('should identify NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');

			var requestType = 'songs/stream';
			var options = {secret: '123'};
			var checkRequestAnswer = MOOSE.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');
		});
	});

	describe('#checkOptions', function () {

		it('should not accept falsy options like undefined', function (done) {
			try {
				moose.api().sendRequest('delegates/', {limit:undefined}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be undefined');
				done();
			}
		});

		it('should not accept falsy options like NaN', function (done) {
			try {
				moose.api().sendRequest('delegates/', {limit:NaN}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be NaN');
				done();
			}
		});

	});

	describe('#changeRequest', function () {

		it('should give the correct parameters for GET requests', function () {
			var requestType = 'transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = moose.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					blockId: '123',
					senderId: '123'
				},
				requestUrl: 'http://localhost:4440/api/transactions?blockId=123&senderId=123'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for GET requests with parameters', function () {
			var requestType = 'delegates/search/';
			var options = {q: 'oliver'};
			var checkRequestAnswer = moose.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					q: 'oliver',
				},
				requestUrl: 'http://localhost:4440/api/delegates/search/?q=oliver'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = moose.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: '',
				requestParams: '',
				requestUrl: ''
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for POST requests', function () {
			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = moose.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {secret: '123'},
				requestUrl: 'http://localhost:4440/api/accounts?address=12475940823804898745M'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for PUT requests', function () {
			var requestType = 'signatures';
			var options = {secret: '123', secondSecret: '1234'};
			var checkRequestAnswer = moose.api({ node: 'localhost' }).changeRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer.requestParams.transaction).should.have.property('id').which.is.a.String();
			(checkRequestAnswer.requestParams.transaction).should.have.property('amount').which.is.a.Number();
			(checkRequestAnswer.requestParams).should.have.property('transaction').which.is.a.Object();
		});
	});

	describe('#sendRequest', function () {
		var expectedResponse = {
			body: { success: true, height: 2850466 },
		};

		it('should receive Height from a random public peer', function (done) {
			sinon.stub(MOOSE, 'sendRequestPromise').resolves(expectedResponse);

			MOOSE.sendRequest('blocks/getHeight', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true();

				MOOSE.sendRequestPromise.restore();
				done();
			});
		});
	});

	describe('#listActiveDelegates', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'thepool',
					address: '10839494368003872009M',
					publicKey: 'b002f58531c074c7190714523eec08c48db8c7cfc0c943097db1a2e82ed87f84',
					vote: '2315391211431974',
					producedblocks: 13340,
					missedblocks: 373,
					rate: 1,
					rank: 1,
					approval: 21.64,
					productivity: 97.28,
				}],
			},
		};

		it('should list active delegates', function () {
			var callback = sinon.spy();
			var options = { limit: '1' };
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listActiveDelegates('1', callback);

			(MOOSE.sendRequest.calledWith('delegates/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listStandbyDelegates', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'bangomatic',
					address: '15360265865206254368M',
					publicKey: 'f54ce2a222ab3513c49e586464d89a2a7d9959ecce60729289ec0bb6106bd4ce',
					vote: '1036631485530636',
					producedblocks: 12218,
					missedblocks: 139,
					rate: 102,
					rank: 102,
					approval: 9.69,
					productivity: 0,
				}],
			},
		};

		it('should list standby delegates', function () {
			var callback = sinon.spy();
			var options =  { limit: '1', orderBy: 'rate:asc', offset: 101 };
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listStandbyDelegates('1', callback);

			(MOOSE.sendRequest.calledWith('delegates/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#searchDelegateByUsername', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'oliver',
					address: '10872755118372042973M',
					publicKey: 'ac2e6931e5df386f3b8d278f9c14b6396ea6f2d8c6aab6e3bc9b857b3e136877',
					vote: '22499233987816',
					producedblocks: 0,
					missedblocks: 0,
				}],
			},
		};

		it('should find a delegate by name', function () {
			var callback = sinon.spy();
			var options = { q: 'oliver' };
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.searchDelegateByUsername('oliver', callback);

			(MOOSE.sendRequest.calledWith('delegates/search/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listBlocks', function () {
		var expectedResponse = {
			body: {
				success: true,
				blocks: [{
					id: '7650813318077105965',
					version: 0,
					timestamp: 30745470,
					height: 2852547,
					previousBlock: '15871436233132203555',
					numberOfTransactions: 0,
					totalAmount: 0,
					totalFee: 0,
					reward: 500000000,
					payloadLength: 0,
					payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
					generatorPublicKey: 'b3953cb16e2457b9be78ad8c8a2985435dedaed5f0dd63443bdfbccc92d09f2d',
					generatorId: '6356913781456505636M',
					blockSignature: '2156b5b20bd338fd1d575ddd8550fd5675e80eec70086c31e60e797e30efdeede8075f7ac35db3f0c45fed787d1ffd7368a28a2642ace7ae529eb538a0a90705',
					confirmations: 1,
					totalForged: '500000000',
				}],
			},
		};

		it('should list amount of blocks defined', function () {
			var callback = sinon.spy();
			var options = { limit: '1'};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listBlocks('1', callback);

			(MOOSE.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listForgedBlocks', function () {
		var expectedResponse = {
			body: {
				success: true
			}
		};

		it('should list amount of ForgedBlocks', function () {
			var callback = sinon.spy();
			var key = '130649e3d8d34eb59197c00bcf6f199bc4ec06ba0968f1d473b010384569e7f0';
			var options = { generatorPublicKey: key};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listForgedBlocks(key, callback);

			(MOOSE.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#getBlock', function () {
		var expectedResponse = {
			body: {
				success: true,
				blocks: [{
					id: '5834892157785484325',
					version: 0,
					timestamp: 25656190,
					height: 2346638,
					previousBlock: '10341689082372310738',
					numberOfTransactions: 0,
					totalAmount: 0,
					totalFee: 0,
					reward: 500000000,
					payloadLength: 0,
					payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
					generatorPublicKey: '2cb967f6c73d9b6b8604d7b199271fed3183ff18ae0bd9cde6d6ef6072f83c05',
					generatorId: '9540619224043865035M',
					blockSignature: '0c0554e28adeeed7f1071cc5cba76b77340e0f406757e7a9e7ab80b1711856089ec743dd4954c2db10ca6e5e2dab79d48d15f7b5a08e59c29d622a1a20e1fd0d',
					confirmations: 506049,
					totalForged: '500000000',
				}],
				count: 1,
			},
		};

		it('should get a block of certain height', function () {
			var callback = sinon.spy();
			var blockId = '2346638';
			var options = { height: blockId};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.getBlock(blockId, callback);

			(MOOSE.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listTransactions', function () {
		var expectedResponse = {
			body: {
				success: true,
				transactions: [{
					id: '16951900355716521650',
					height: 2845738,
					blockId: '10920144534340154099',
					type: 0,
					timestamp: 30676572,
					senderPublicKey: '2cb967f6c73d9b6b8604d7b199271fed3183ff18ae0bd9cde6d6ef6072f83c05',
					senderId: '9540619224043865035M',
					recipientId: '12731041415715717263M',
					recipientPublicKey: 'a81d59b68ba8942d60c74d10bc6488adec2ae1fa9b564a22447289076fe7b1e4',
					amount: 146537207,
					fee: 10000000,
					signature: 'b5b6aa065db4c47d2fa5b0d8568138460640216732e3926fdd7eff79f3f183e93ffe38f0e33a1b70c97d4dc9efbe61da55e94ab24ca34e134e71e94fa1b6f108',
					signatures: [],
					confirmations: 7406,
					asset: {},
				}],
				count: '120',
			},
		};


		it('should list transactions of a defined account', function () {
			var callback = sinon.spy();
			var address = '12731041415715717263M';
			var options = {
				senderId: address,
				recipientId: address,
				limit: '1',
				offset: '2',
				orderBy: 'timestamp:desc'
			};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listTransactions(address, '1', '2', callback);

			(MOOSE.sendRequest.calledWith('transactions', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#getTransaction', function () {
		var expectedResponse = {
			body: {
				success: true,
				transaction: {
					id: '7520138931049441691',
					height: 2346486,
					blockId: '11556561638256817055',
					type: 0,
					timestamp: 25654653,
					senderPublicKey: '632763673e5b3a0b704cd723d8c5bdf0be47e08210fe56a0c530f27ced6c228e',
					senderId: '1891806528760779417M',
					recipientId: '1813095620424213569M',
					recipientPublicKey: 'e01b6b8a9b808ec3f67a638a2d3fa0fe1a9439b91dbdde92e2839c3327bd4589',
					amount: 56340416586,
					fee: 10000000,
					signature: 'd04dc857e718af56ae3cff738ba22dce7da0118565675527ddf61d154cfea70afd11db1e51d6d9cce87e0780685396daab6f47cae74c22fa20638c9b71883d07',
					signatures: [],
					confirmations: 506685,
					asset: {},
				},
			},
		};

		it('should list a defined transaction', function () {
			var callback = sinon.spy();
			var transactionId= '7520138931049441691';
			var options = {
				id: transactionId
			};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.getTransaction(transactionId, callback);

			(MOOSE.sendRequest.calledWith('transactions/get', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listVotes', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'thepool',
					address: '10839494368003872009M',
					publicKey: 'b002f58531c074c7190714523eec08c48db8c7cfc0c943097db1a2e82ed87f84',
					vote: '2317408239538758',
					producedblocks: 13357,
					missedblocks: 373,
					rate: 1,
					rank: 1,
					approval: 21.66,
					productivity: 97.28,
				}],
			},
		};

		it('should list votes of an account', function () {
			var callback = sinon.spy();
			var address= '16010222169256538112M';
			var options = {
				address: address
			};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listVotes(address, callback);

			(MOOSE.sendRequest.calledWith('accounts/delegates', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#listVoters', function () {
		var expectedResponse = {
			body: {
				success: true,
				accounts: [{
					username: null,
					address: '7288548278191946381M',
					publicKey: '8c325dc9cabb3a81e40d7291a023a1574629600931fa21cc4fcd87b2d923214f',
					balance: '0',
				}],
			},
		};

		it('should list voters of an account', function () {
			var callback = sinon.spy();
			var publicKey= '6a01c4b86f4519ec9fa5c3288ae20e2e7a58822ebe891fb81e839588b95b242a';
			var options = {
				publicKey: publicKey
			};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.listVoters(publicKey, callback);

			(MOOSE.sendRequest.calledWith('delegates/voters', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#getAccount', function () {
		var expectedResponse = {
			body: {
				success: true,
				account: {
					address: '12731041415715717263M',
					unconfirmedBalance: '7139704369275',
					balance: '7139704369275',
					publicKey: 'a81d59b68ba8942d60c74d10bc6488adec2ae1fa9b564a22447289076fe7b1e4',
					unconfirmedSignature: 1,
					secondSignature: 1,
					secondPublicKey: 'b823d706cec22383f9f10bb5095a66ed909d9224da0707168dad9d1c9cdef29c',
					multisignatures: [],
					'u_multisignatures': [],
				},
			},
		};

		it('should get account information', function () {
			var callback = sinon.spy();
			var address= '12731041415715717263M';
			var options = {
				address: address
			};
			sinon.stub(MOOSE, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSE.getAccount(address, callback);

			(MOOSE.sendRequest.calledWith('accounts', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSE.sendRequest.restore();
		});
	});

	describe('#sendMOOSE', function () {
		var expectedResponse = {
			body: { success: true, transactionId: '8921031602435581844' }
		};
		it('should send testnet MOOSE', function () {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '4460',
				bannedPeers: []
			};
			var callback = sinon.spy();
			var MOOSEnode = moose.api(options);
			var secret = 'soap arm custom rhythm october dove chunk force own dial two odor';
			var secondSecret = 'spider must salmon someone toe chase aware denial same chief else human';
			var recipient = '10279923186189318946M';
			var amount = 100000000;
			sinon.stub(MOOSEnode, 'sendRequest').callsArgWith(2, expectedResponse);

			MOOSEnode.sendMOOSE(recipient, amount, secret, secondSecret, callback);

			(MOOSEnode.sendRequest.calledWith('transactions', {
				recipientId: recipient,
				amount: amount,
				secret: secret,
				secondSecret: secondSecret
			})).should.be.true();

			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			MOOSEnode.sendRequest.restore();
		});
	});

	describe('#checkReDial', function () {

		it('should check if all the peers are already banned', function () {
			(moose.api().checkReDial()).should.be.equal(true);
		});

		it('should be able to get a new node when current one is not reachable', function (done) {
			moose.api({ node: '123', randomPeer: true }).sendRequest('blocks/getHeight', {}, function (result) {
				(result).should.be.type('object');
				done();
			});
		});

		it('should recognize that now all the peers are banned for mainnet', function () {
			var thisMOOSE = moose.api();
			thisMOOSE.bannedPeers = moose.api().defaultPeers;

			(thisMOOSE.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for testnet', function () {
			var thisMOOSE = moose.api({ testnet: true });
			thisMOOSE.bannedPeers = moose.api().defaultTestnetPeers;

			(thisMOOSE.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for ssl', function () {
			var thisMOOSE = moose.api({ssl: true});
			thisMOOSE.bannedPeers = moose.api().defaultSSLPeers;

			(thisMOOSE.checkReDial()).should.be.equal(false);
		});

		it('should stop redial when all the peers are banned already', function (done) {
			var thisMOOSE = moose.api();
			thisMOOSE.bannedPeers = moose.api().defaultPeers;
			thisMOOSE.currentPeer = '';

			thisMOOSE.sendRequest('blocks/getHeight').then(function (e) {
				(e.message).should.be.equal('could not create http request to any of the given peers');
				done();
			});
		});

		it('should redial to new node when randomPeer is set true', function (done) {
			var thisMOOSE = moose.api({ randomPeer: true, node: '123' });

			thisMOOSE.getAccount('12731041415715717263M', function (data) {
				(data).should.be.ok;
				(data.success).should.be.equal(true);
				done();
			});
		});

		it('should not redial to new node when randomPeer is set to true but unknown nethash provided', function () {
			var thisMOOSE = moose.api({ randomPeer: true, node: '123', nethash: '123' });

			(thisMOOSE.checkReDial()).should.be.equal(false);
		});

		it('should redial to mainnet nodes when nethash is set and randomPeer is true', function () {
			var thisMOOSE = moose.api({ randomPeer: true, node: '123', nethash: 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa' });

			(thisMOOSE.checkReDial()).should.be.equal(true);
			(thisMOOSE.testnet).should.be.equal(false);
		});

		it('should redial to testnet nodes when nethash is set and randomPeer is true', function () {
			var thisMOOSE = moose.api({ randomPeer: true, node: '123', nethash: 'fba30b2e8c1b9c7d41d956e2874d845fe4ef9f28a76abdb909e01a971fffabaa' });

			(thisMOOSE.checkReDial()).should.be.equal(true);
			(thisMOOSE.testnet).should.be.equal(true);
		});

		it('should not redial when randomPeer is set false', function () {
			var thisMOOSE = moose.api({ randomPeer: false});

			(thisMOOSE.checkReDial()).should.be.equal(false);
		});
	});

	describe('#sendRequest with promise', function () {

		it('should be able to use sendRequest as a promise for GET', function (done) {
			moose.api().sendRequest('blocks/getHeight', {}).then(function (result) {
				(result).should.be.type('object');
				(result.success).should.be.equal(true);
				(result.height).should.be.type('number');
				done();
			});
		});

		it('should route the request accordingly when request method is POST but GET can be used', function (done) {
			moose.api().sendRequest('accounts/open', { secret: '123' }).then(function (result) {
				(result).should.be.type('object');
				(result.account).should.be.ok;
				done();
			});
		});

		it('should respond with error when API call is disabled', function (done) {
			moose.api().sendRequest('delegates/forging/enable', { secret: '123' }).then(function (result) {
				(result.error).should.be.equal('Forging not available via offlineRequest');
				done();
			});
		});

		it('should be able to use sendRequest as a promise for POST', function (done) {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '4460',
				bannedPeers: []
			};

			var MOOSEnode = moose.api(options);
			var secret = 'soap arm custom rhythm october dove chunk force own dial two odor';
			var secondSecret = 'spider must salmon someone toe chase aware denial same chief else human';
			var recipient = '10279923186189318946M';
			var amount = 100000000;

			MOOSEnode.sendRequest('transactions', { recipientId: recipient, secret: secret, secondSecret: secondSecret, amount: amount }).then(function (result) {
				(result).should.be.type('object');
				(result).should.be.ok;
				done();
			});
		});
	});

	describe('#listMultisignatureTransactions', function () {

		it('should list all current not signed multisignature transactions', function (done) {
			moose.api().listMultisignatureTransactions(function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});

	describe('#getMultisignatureTransaction', function () {

		it('should get a multisignature transaction by id', function (done) {
			moose.api().getMultisignatureTransaction('123', function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});
});
