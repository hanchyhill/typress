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
    
    dataURL = 'http://172.22.1.175/di/http.action?userId=idc&pwd=idcpwd&interfaceId=getRACTyphoonInfo&dataFormat=json';
    console.log(dataURL);
  }
  else if(interface == "getObs"){
    
    dataURL = 'http://172.22.1.175/di/http.action?userId=idc&pwd=idcpwd&interfaceId=getRACTyphoonObsTimeRange&dataFormat=json&s_ymdhms='+
                sTime + '000000&e_ymdhms=' + eTime + '000000&fcid=BCGZ';
    console.log(dataURL);
  }
  else{
    response.write("");
    response.end();
    return;
  }
  
/*  response.write("test");
  response.end();
  return;
  console.log(dataURL);*/
  
  http.get(dataURL,function(req,res){  
    var html='';  
    req.on('data',function(data){  
        html+=data;  
    });
    req.on('end',function(){  
      //console.info(html);  
      response.write(html);
      response.end();
      //response.end();
    }); 
  }); 
  
}

exports.getTyData = getTyData;
