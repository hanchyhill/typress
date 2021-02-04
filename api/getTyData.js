var http=require('http');
const privateConfig = require('./config/private.config.json');
const ideaConfig = {
  username:'',
  password:'',
}
if (process.env.NODE_ENV === 'production') {
  ideaConfig.username = privateConfig.production.IDEA.username;
  ideaConfig.password = privateConfig.production.IDEA.password;
  } else {
  ideaConfig.username = privateConfig.development.IDEA.username;
  ideaConfig.password = privateConfig.development.IDEA.password;
}
console.log(ideaConfig);
function getTyData(response,sTime,eTime,interface,ins='BCGZ'){

//get 请求外网
//
  //console.log(sTime);
  //console.log(eTime);

  if(!sTime || Number(sTime) == NaN || sTime.length !=8){
      sTime = "20160828";
    }

  if(!eTime || Number(eTime) == NaN || sTime.length !=8){
    eTime = "20160830";
  }

  if(Number(sTime)>=Number(eTime)){
    sTime = "20160828";eTime = "20160830";
  }

  //console.log(sTime);
  console.log(interface);

  var dataURL = ""
  if(interface == "getInfo"){

    dataURL = `http://172.22.1.175/di/http.action?userId=${ideaConfig.username}&pwd=${ideaConfig.password}&interfaceId=getRACTyphoonInfo&dataFormat=json`;
    //dataURL = 'http://172.22.1.175/kk';
    //console.log(dataURL);
  }
  else if(interface == "getObs"){

    dataURL = `http://172.22.1.175/di/http.action?userId=${ideaConfig.username}&pwd=${ideaConfig.password}&interfaceId=getRACTyphoonObsTimeRange&dataFormat=json&s_ymdhms=`+
                sTime + '000000&e_ymdhms=' + eTime + '235900&fcid='+ins;
    //dataURL = 'http://172.22.1.175/kk';
    //console.log(dataURL);
  }
  else{
    response.write('');
    response.end();
    return;
  }

/*  response.write("test");
  response.end();
  return;
  console.log(dataURL);*/

  http.get(dataURL,(res)=>{
    if(res.statusCode>400){
      let text =`{"error":true,
      "errorMessage":"${res.statusCode}"
      }`
      response.write(text);
      response.end();
      return;
    };
    var html='';
    res.on('data',function(data){
        html+=data;
    });
    res.on('end',function(){
      //console.info(html);
      response.write(html);
      response.end();
      //response.end();
    });
  })
  .on('error', function(error) {
    let text =`{"error":true,
    "errorMessage":"${error.message}"
    }`
    response.write(text);
    response.end();
  });
}

exports.getTyData = getTyData;
