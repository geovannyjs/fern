'use strict';

//controller
var { Controller } = require('./controller');

//initialize
fern.mount(document.getElementById("main"))(Controller);
