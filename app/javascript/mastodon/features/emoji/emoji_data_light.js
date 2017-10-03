const data = require('./emoji_data_compressed');

// decompress
data.emojis = data.emojis.map(compressedEmoji => ({
  short_names: compressedEmoji[0],
  unified: compressedEmoji[1],
  search: compressedEmoji[2],
}));

module.exports = data;
