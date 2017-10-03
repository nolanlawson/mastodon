const data = require('./emoji_data_compressed');

if (performance.mark) {
  performance.mark('emoji_data_light_start');
}

// decompress
const emojis = {};
data.emojis.forEach(compressedEmoji => {
  const [ short_names, unified, search ] = compressedEmoji;
  emojis[short_names[0]] = {
    short_names,
    unified,
    search,
  };
});

data.emojis = emojis;

if (performance.mark) {
  performance.mark('emoji_data_light_end');
  performance.measure('emoji_data_light', 'emoji_data_light_start', 'emoji_data_light_end');
}

module.exports = data;
