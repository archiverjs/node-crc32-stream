import {Transform, TransformOptions} from "stream";
import {DeflateRaw, ZlibOptions} from "zlib";

export class CRC32Stream extends Transform {
    private checksum: Buffer;
    rawSize: number;

    constructor(options?: TransformOptions);

    digest(encoding: BufferEncoding): string;
    digest(encoding?: undefined): Buffer;

    hex(): string;

    size(): number;
}

// DeflateRaw in @types/node is an interface.
// So ignore its required members.
// @ts-ignore
export class DeflateCRC32Stream implements DeflateRaw {
    checksum: Buffer;
    rawSize: number;
    compressedSize: number;

    constructor(options?: ZlibOptions);

    digest(encoding: BufferEncoding): string;
    digest(encoding?: undefined): typeof this.checksum;

    hex(): string;

    size(compressed?: boolean): number;
}
