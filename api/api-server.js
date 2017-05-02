var http = require("http");
var url = require("url");
var qs = require('querystring');

function start(getTyData) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    var queryUrl = url.parse(request.url).query ;
    var sTime =  qs.parse(queryUrl)["startTime"];
    var eTime =  qs.parse(queryUrl)["endTime"];

    var interface =  qs.parse(queryUrl)["interface"];
    response.writeHead(200, {"Content-Type": "text/json","Access-Control-Allow-Origin":"*"});

    getTyData(response,sTime,eTime,interface);

  }

  http.createServer(onRequest).listen(8082);
  console.log("Server 8082 has started.");
}

exports.start = start;