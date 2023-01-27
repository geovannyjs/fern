'use strict';

var input = 'src/index.js'

var config = {
  input: input,
  output: {
    format: 'umd',
    name: 'fern',
    exports: 'named'
  },
  plugins: []
}

module.exports = config
