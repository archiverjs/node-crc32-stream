/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */
var zlib = require('zlib');
var inherits = require('util').inherits;
var crc32 = require('crc').crc32;

class DeflateCRC32Stream extends zlib.DeflateRaw {
  constructor(options) {
    super(options);
    this.checksum = new Buffer(4);
    this.checksum.writeInt32BE(0, 0);

    this.rawSize = 0;
    this.compressedSize = 0;
  }

  push(chunk, encoding) {
    if (chunk) {
      this.compressedSize += chunk.length;
    }

    return zlib.DeflateRaw.prototype.push.call(this, chunk, encoding);
  }

  write(chunk, enc, cb) {
    if (chunk) {
      this.checksum = crc32(chunk, this.checksum);
      this.rawSize += chunk.length;
    }

    return zlib.DeflateRaw.prototype.write.call(this, chunk, enc, cb);
  }

  digest(encoding) {
    var checksum = new Buffer(4);
    checksum.writeUInt32BE(this.checksum >>> 0, 0);
    return encoding ? checksum.toString(encoding) : checksum;
  }

  hex() {
    return this.digest('hex').toUpperCase();
  }

  size(compressed) {
    compressed = compressed || false;

    if (compressed) {
      return this.compressedSize;
    } else {
      return this.rawSize;
    }
  }
}

module.exports = DeflateCRC32Stream
