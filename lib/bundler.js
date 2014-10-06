var stream = require('stream');
var util = require('util');
var extend = require('extend');
var fs = require('fs');

/**
 * Class allows bundle several files into one
 */
function FilesBundler(watermark) {
	this.sourceFiles = [];
	this.state = FilesBundler.OPEN;
	this.watermark = watermark || FilesBundler.DEFAULT_WATERMARK;
	this.size = 0; // used size so far
	this._currentStream = null;
	this._currentIndex = -1;

	stream.Readable.call(this);
}

util.inherits(FilesBundler, stream.Readable);

FilesBundler.OPEN = 0; // bundles is accepting files
FilesBundler.CLOSED = 1; // bundle is being written of is finished, does not acept files
FilesBundler.DEFAULT_WATERMARK = 1024*1024*10; // default watermark is 10Mb

FilesBundler.prototype._read = function(size) {
	console.log('_read');
 if (this.state === FilesBundler.OPEN) {
	 console.log('Not ready to be read');
	 return;
 }

 var r = this._currentStream.read();

 if (r) {
	 console.log('data', r);
	 this.push(r);
 } else {
	 console.log('no data found');
 }
};


/**
 * Starts creation of bundle. Stream will be opened for reading
 */
FilesBundler.prototype.bundle = function() {
	if (this.sourceFiles.size === 0) {
		this.end();
	}
	this.state = FilesBundler.CLOSED;
	var header = {
		files: []
	};
	var curPos = 0;

	for (var f in this.sourceFiles) {
		var fileDef = this.sourceFiles[f];
		fileDef.start = curPos;
		curPos += fileDef.size;
		header.files.push(this.sourceFiles[f]);

	}
	var headerStr = JSON.stringify(header);
	
	var headerLengthBuf = new Buffer(4);
	var headerBuf = new Buffer(headerStr);

	headerLengthBuf.writeInt32LE(headerBuf.length);

	this.push(headerLengthBuf);
	this.push(headerBuf);

	this._currentStream = fs.createReadStream(this.sourceFiles[0].path);
	var that = this;

	function prepareNextStream() {
		++that._currentIndex;
		console.log('Preparing stream', that._currentIndex);
		if (that._currentIndex < that.sourceFiles.length) {
			that._currentStream = fs.createReadStream(that.sourceFiles[that._currentIndex].path, {encoding: null});
			that._currentStream.on('end', function() {
				console.log('Read stream end');
				prepareNextStream();
			});

			that._currentStream.on('open', function() {
				console.log('opened');
				that.read(0);
			});

			that._currentStream.on('readable', function() {
				console.log('readable');
				var r = that._currentStream.read();
				if (r) {
					that.push(r);
				}
			});
			that._currentStream.on('error', function(err) {
				console.log(err);
			});
		} else {
			console.log('end');
			that.push(null);
		}
	}
	prepareNextStream();
};

/**
 * Adds file into bundle. File can be added into bundle only
 * until bundle is not finished. It creates copy of privided object.
 *
 * @param fileDef {object} - { {stat like object enriched by path (path to file) property. Size and path property is required}}
 * @return true if file is added, otherwise false. False can be returned also in case
 * of watermark overflow (on subsequent additions)
 *
 */
FilesBundler.prototype.addFile = function(fileDef) {
	if (this.state === FilesBundler.OPEN) {
		var copy = {};

		extend(true, copy, fileDef);
		this.sourceFiles.push(copy);

		this.size += fileDef.size;
		return true;
	} else {
		return false;
	}
};


module.exports = {
	FilesBundler : FilesBundler
};
