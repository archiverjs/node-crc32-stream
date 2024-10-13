/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */
import CRC32Stream from "./crc32-stream.js";
import DeflateCRC32Stream from "./deflate-crc32-stream.js";

export { CRC32Stream, DeflateCRC32Stream };
export default {
  CRC32Stream,
  DeflateCRC32Stream,
};
