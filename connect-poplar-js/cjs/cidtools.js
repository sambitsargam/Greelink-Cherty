"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCID = getCID;
async function getCID(data) {
  // Need to use dynamic imports, I think the static imports aren't working with Babel
  const {
    CID
  } = await import('multiformats/cid');
  const {
    sha256
  } = await import('multiformats/hashes/sha2');
  const raw = await import('multiformats/codecs/raw');

  // Convert data into buffer and get the CID
  const dataBuffer = Buffer.from(data);
  const hash = await sha256.digest(dataBuffer);
  const cid = CID.create(1, raw.code, hash);
  return cid.toString();
}