var http=require('http');


function getTyData(response,sTime,eTime,interface){

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
    
    dataURL = 'http://172.22.1.175/di/http.action?userId=sqxt&pwd=shengqxt123&interfaceId=getRACTyphoonInfo&dataFormat=json';
    //dataURL = 'http://172.22.1.175/kk';
    //console.log(dataURL);
  }
  else if(interface == "getObs"){
    
    dataURL = 'http://172.22.1.175/di/http.action?userId=sqxt&pwd=shengqxt123&interfaceId=getRACTyphoonObsTimeRange&dataFormat=json&s_ymdhms='+
                sTime + '000000&e_ymdhms=' + eTime + '235900&fcid=BCGZ';
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
