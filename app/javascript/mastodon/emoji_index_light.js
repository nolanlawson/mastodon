// @preval
// Force tree shaking on emoji-mart by exposing just a subset of its functionality

const emojiMart = require('emoji-mart');

const emojiIndex = {
};

emojiIndex.search = emojiMart.emojiIndex.search.bind(emojiIndex);
emojiIndex.emojis = JSON.parse(JSON.stringify(emojiMart.emojiIndex.emojis));
emojiIndex.emoticons = JSON.parse(JSON.stringify(emojiMart.emojiIndex.emoticons));

console.log('old', emojiMart.emojiIndex);
console.log('new', emojiIndex);

exports.emojiIndex = emojiIndex;
