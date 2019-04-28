var server = require("./api-server2");
var getData = require("./getTyData");

server.start(getData.getTyData);
