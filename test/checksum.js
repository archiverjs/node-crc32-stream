/*global before,describe,it */

'use strict';

const {assert} = require('chai');

const {BinaryStream, DeadEndStream} = require('./helpers');

const CRC32Stream = require('../lib/crc32-stream.js');

describe('CRC32Stream', function() {
  it('should checksum data while passing through data', function(done) {
    const binary = new BinaryStream(1024 * 16);
    const checksum = new CRC32Stream();
    const deadend = new DeadEndStream();

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), 3893830384);
      assert.equal(checksum.digest('hex'), 'e81722f0');
      assert.equal(checksum.hex(), 'E81722F0');
      assert.equal(checksum.size(), 16384);
      done();
    });

    checksum.pipe(deadend);
    binary.pipe(checksum);
  });

  it('should gracefully handle having no data chunks passed to it', function(done) {
    const checksum = new CRC32Stream();
    const deadend = new DeadEndStream();

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), 0);
      done();
    });

    checksum.pipe(deadend);
    checksum.end();
  });
});
