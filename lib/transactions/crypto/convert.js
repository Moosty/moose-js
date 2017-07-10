var Buffer = require('buffer/').Buffer;

function bufferToHex (buffer) {
	return naclInstance.to_hex(buffer);
}

function hexToBuffer (hex) {
	return naclInstance.from_hex(hex);
}

// TODO: Discuss behaviour and output format
function useFirstEightBufferEntriesReversed (publicKeyBytes) {
	var publicKeyTransform = Buffer.alloc(8);

	for (var i = 0; i < 8; i++) {
		publicKeyTransform[i] = publicKeyBytes[7 - i];
	}

	return publicKeyTransform;
}

module.exports = {
	bufferToHex: bufferToHex,
	hexToBuffer: hexToBuffer,
	useFirstEightBufferEntriesReversed: useFirstEightBufferEntriesReversed
};