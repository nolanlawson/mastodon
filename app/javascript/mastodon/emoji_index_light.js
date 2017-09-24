// @preval
// Force tree shaking on emoji-mart by exposing just a subset of its functionality

const emojiMart = require('emoji-mart');
module.exports.emojiIndex = JSON.parse(JSON.stringify(emojiMart.emojiIndex));
