// @preval
// Force tree shaking on emoji-mart by exposing just a subset of its functionality

const emojiIndex = require('emoji-mart').emojiIndex;

// This fixes some encoding issues with preval
emojiIndex.emojis = JSON.parse(JSON.stringify(emojiIndex.emojis));
emojiIndex.emoticons = JSON.parse(JSON.stringify(emojiIndex.emoticons));

module.exports.emojiIndex = emojiIndex;
