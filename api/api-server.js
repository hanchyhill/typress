var http = require("http");
var url = require("url");
var qs = require('querystring');
var getJpBulletin = require("./get-bulletin.js").getJpBulletin;

function start(getTyData) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    var queryUrl = url.parse(request.url).query ;
    

    var interface =  qs.parse(queryUrl)["interface"];
    if(interface=='bulletin'){
      //console.log('getBulletin');
      getJpBulletin('http://tgftp.nws.noaa.gov/data/raw/ww/wwjp25.rjtd..txt')
      //getJpBulletin('http://localhost:10080/static/JP/WWJP25 RJTD 250000.txt')
      .then(data=>{
        //console.log(data);
        response.writeHead(200, {"Content-Type": "text/json","Access-Control-Allow-Origin":"*"});
        response.write(JSON.stringify(data));
        response.end();
        //console.log(data);
      })
      .catch(error=>{
        console.log(error.message);
        let text =`{"error":true,
          "errorMessage":"${error.message}"
          }`;
        response.write(text);
        response.end();
      });
    }
    else{
      let sTime =  qs.parse(queryUrl)["startTime"];
      let eTime =  qs.parse(queryUrl)["endTime"];
      response.writeHead(200, {"Content-Type": "text/json","Access-Control-Allow-Origin":"*"});
      getTyData(response,sTime,eTime,interface);
    }
  }

  http.createServer(onRequest).listen(10082);
  console.log("Server 10082 has started.");
}

exports.start = start;