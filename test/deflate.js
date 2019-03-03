/*global before,describe,it */

'use strict';

var assert = require('chai').assert;

var helpers = require('./helpers');
var BinaryStream = helpers.BinaryStream;
var DeadEndStream = helpers.DeadEndStream;

var DeflateCRC32Stream = require('../lib/deflate-crc32-stream.js');

describe('DeflateCRC32Stream', function() {
  it('should checksum data while passing through data', function(done) {
    var binary = new BinaryStream(1024 * 16);
    var checksum = new DeflateCRC32Stream();
    var deadend = new DeadEndStream();

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), 3893830384);
      assert.equal(checksum.digest('hex'), 'e81722f0');
      assert.equal(checksum.hex(), 'E81722F0');
      assert.equal(checksum.size(), 16384);
      assert.equal(checksum.size(true), 402);
      done();
    });

    checksum.pipe(deadend);
    binary.pipe(checksum);
  });

  it('should gracefully handle having no data chunks passed to it', function(done) {
    var checksum = new DeflateCRC32Stream();
    var deadend = new DeadEndStream();

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), 0);
      done();
    });

    checksum.pipe(deadend);
    checksum.end();
  });
});
