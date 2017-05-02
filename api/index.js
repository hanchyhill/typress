var server = require("./api-server");
var getData = require("./getTyData");

server.start(getData.getTyData);