"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandomString = generateRandomString;
exports.processString = processString;
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
;
function processString(input) {
  // Remove special characters, numbers, spaces, and vowels, then convert to lower case
  const cleanedString = input.replace(/[^a-zA-Z]/g, '') // Remove non-letter characters
  .toLowerCase() // Convert to lower case
  .replace(/[aeiou]/g, ''); // Remove vowels

  // Return the first 5 characters
  return cleanedString.substring(0, 5);
}
;