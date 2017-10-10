// Project settings

var config = {};

config.api = {}; // Want to organize configs by different categories. So config.api, config.db, etc.

config.api.port = ':80';
config.api.url = "http://api.quicksnipp.com" + config.api.port;



// Export to be used
module.exports = config;