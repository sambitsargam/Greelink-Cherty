"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sameVersion = sameVersion;
exports.updateVersion = updateVersion;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function updateVersion(version, updateType, newBranch = null, prevVersions = []) {
  // Check and update the version based on the updateType
  switch (updateType) {
    case 'major':
      version.major += 1;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor += 1;
      version.patch = 0;
      break;
    case 'patch':
      version.patch += 1;
      break;
    default:
      throw new Error('Invalid updateType. Must be "major", "minor", or "patch".');
  }

  // Update the branch if newBranch is provided
  if (newBranch !== null) {
    version.branch = newBranch;
  }

  // Set previous versions
  version.previous = prevVersions;
  return version;
}
function sameVersion(version1, version2) {
  // Check if both inputs are objects
  if (typeof version1 !== 'object' || version1 === null || typeof version2 !== 'object' || version2 === null) {
    throw new Error('Both inputs must be objects');
  }

  // Compare major, minor, patch, and branch
  return version1.major === version2.major && version1.minor === version2.minor && version1.patch === version2.patch && version1.branch === version2.branch;
}