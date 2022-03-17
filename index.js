require("dotenv").config();

const bot = require('./bot');
const notion = require('./notion');
require('./web')(bot, notion);
