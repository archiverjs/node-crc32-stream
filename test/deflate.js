/*global before,describe,it */

'use strict';

const {assert} = require('chai');
const crc32 = require('crc-32');

const {BinaryStream, DeadEndStream} = require('./helpers');

const DeflateCRC32Stream = require('../lib/deflate-crc32-stream.js');

describe('DeflateCRC32Stream', function() {
  it('should checksum data while passing through data', function(done) {
    const binary = new BinaryStream(1024 * 16);
    const checksum = new DeflateCRC32Stream();
    const deadend = new DeadEndStream();

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
  
  it('should have same checksum when bytes written together or separately', function(done) {
    const checksum = new DeflateCRC32Stream();
    const deadend = new DeadEndStream();
    
    const expectedChecksumValue = crc32.buf([157, 10, 217, 109, 100, 200, 300]) >>> 0;

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), expectedChecksumValue);
      done();
    });
    
    checksum.write(Buffer.from([157, 10, 217, 109]));
    checksum.write(Buffer.from([100, 200, 300]));
    checksum.end();
    checksum.pipe(deadend);
  });

  it('should gracefully handle having no data chunks passed to it', function(done) {
    const checksum = new DeflateCRC32Stream();
    const deadend = new DeadEndStream();

    checksum.on('end', function() {
      assert.equal(checksum.digest().readUInt32BE(0), 0);
      done();
    });

    checksum.pipe(deadend);
    checksum.end();
  });
});
