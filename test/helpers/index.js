import crypto from "crypto";
import { WriteStream } from "fs";
import { Stream } from "stream";
import { Readable, Writable } from "readable-stream";

export function adjustDateByOffset(d, offset) {
    d = (d instanceof Date) ? d : new Date();
    if (offset >= 1) {
        d.setMinutes(d.getMinutes() - offset);
    }
    else {
        d.setMinutes(d.getMinutes() + Math.abs(offset));
    }
    return d;
}

export function binaryBuffer(n) {
    const buffer = Buffer.allocUnsafe(n);
    for (let i = 0; i < n; i++) {
        buffer.writeUInt8(i & 255, i);
    }
    return buffer;
}

export class BinaryStream extends Readable {
    constructor(size, options) {
        super(size, options);
        const buf = Buffer.allocUnsafe(size);
        for (let i = 0; i < size; i++) {
            buf.writeUInt8(i & 255, i);
        }
        this.push(buf);
        this.push(null);
    }
    _read(size) { }
}

export class DeadEndStream extends Writable {
    _write(chuck, encoding, callback) {
        callback();
    }
}

export class WriteHashStream extends WriteStream {
    constructor(path, options) {
        super(path, options);
        this.hash = crypto.createHash('sha1');
        this.digest = null;
        this.on('close', function () {
            this.digest = this.hash.digest('hex');
        });
    }
    write(chunk) {
        if (chunk) {
            this.hash.update(chunk);
        }
        return super.write(chunk);
    }
}
