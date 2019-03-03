/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */

'use strict';

const zlib = require('zlib');
const {inherits} = require('util');

const {crc32} = require('crc');

const DeflateCRC32Stream = module.exports = function (options) {
  zlib.DeflateRaw.call(this, options);

  this.checksum = Buffer.allocUnsafe(4);
  this.checksum.writeInt32BE(0, 0);

  this.rawSize = 0;
  this.compressedSize = 0;
};

inherits(DeflateCRC32Stream, zlib.DeflateRaw);

DeflateCRC32Stream.prototype.push = function(chunk, encoding) {
  if (chunk) {
    this.compressedSize += chunk.length;
  }

  return zlib.DeflateRaw.prototype.push.call(this, chunk, encoding);
};

DeflateCRC32Stream.prototype.write = function(chunk, enc, cb) {
  if (chunk) {
    this.checksum = crc32(chunk, this.checksum);
    this.rawSize += chunk.length;
  }

  return zlib.DeflateRaw.prototype.write.call(this, chunk, enc, cb);
};

DeflateCRC32Stream.prototype.digest = function(encoding) {
  const checksum = Buffer.allocUnsafe(4);
  checksum.writeUInt32BE(this.checksum >>> 0, 0);
  return encoding ? checksum.toString(encoding) : checksum;
};

DeflateCRC32Stream.prototype.hex = function() {
  return this.digest('hex').toUpperCase();
};

DeflateCRC32Stream.prototype.size = function(compressed) {
  compressed = compressed || false;

  if (compressed) {
    return this.compressedSize;
  } else {
    return this.rawSize;
  }
};
