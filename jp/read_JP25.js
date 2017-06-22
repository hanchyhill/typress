let fs = require('fs');
fs.readFile('./WWJP25 RJTD 250000.txt', 'ascii', (err, text)=> {
  if (err) throw err;
  convertBulletin(text);  //筛选出低压区信息
    //console.log(textArray);
})

function convertBulletin(text){//筛选出低压区信息
  text = text.replace(/[\r\n]/g,' '); //去除多余空行
  textArray = text.split('.');
  let infoLPA = textArray.filter(checkLowPressureArea);//找到低压区字段数组
  //console.log(infoLPA);
  let infoArray = ({});
  if(infoLPA.length){
    infoArray.status = 1;
    try{
      infoArray = infoLPA.map(metaInfoLPA);
      console.log(infoArray);
    }
    catch(err){
      console.error(err);
      return;//错误处理，返回错误
    }
  }
  else{
    infoArray.status = 0;
    infoArray.error = true;
  }

  function checkLowPressureArea(item){
    return item.indexOf('LOW PRESSURE AREA') !== -1;
  }

  function metaInfoLPA(item){//解析低压区元数据
    let regArray = item.match(/(\d+)\s*?HPA.*?(\d+)N\s*?(\d+)E/); //匹配气压、北纬、东经
    if(!regArray) throw Error('在匹配低压区数据时发生错误，正则表达式无法找到适配的字段');
    let meta = {
      pressure:Number(regArray[1]),
      lat:Number(regArray[2]),
      lon:Number(regArray[3]),
    }
    //console.dir(meta);
    let dirIndex = dirList.findIndex(ele=>{//查找条目中的移动方向信息
      let dirReg = new RegExp(' '+ele.en+'( |$)');
      let isMatch = item.match(dirReg);
      //console.log(isMatch);
      return isMatch
    });
    //console.log(dirIndex);
    if(dirIndex!==-1){
      meta.dir = dirList[dirIndex].dir;
      if(dirIndex!==28){
        if(item.indexOf('SLOWLY')){
          meta.speedKTS = 2;
        }
        else{
          let knots = item.match(/(d+)\s*?(KNOTS|KT)/)[1];
          if(knots) meta.speedKTS = knots; 
        }
      }
    } 
    return meta;
  }
}

let dirList =[
      {"en":"NW","cn":"西北","dir":315},
      {"en":"WNW","cn":"西北西","dir":292.5},
      {"en":"WEST","cn":"偏西","dir":270},
      {"en":"NNW","cn":"北北西","dir":337.5},
      {"en":"NORTH","cn":"偏北","dir":360},
      {"en":"NNE","cn":"北北东","dir":22.5},
      {"en":"NE","cn":"东北","dir":45},
      {"en":"ENE","cn":"东北东","dir":67.5},
      {"en":"WSW","cn":"西南西","dir":247.5},
      {"en":"SW","cn":"西南","dir":225},
      {"en":"EAST","cn":"偏东","dir":90},
      {"en":"SOUTH","cn":"偏南","dir":180},
      {"en":"SE","cn":"东南","dir":135},
      {"en":"ESE","cn":"东南东","dir":112.5},
      {"en":"SSW","cn":"南南西","dir":202.5},
      {"en":"SSE","cn":"南南东","dir":157.5},
      {"en":"NORTHWEST","cn":"西北","dir":315},
      {"en":"WESTNORTHWEST","cn":"西北西","dir":292.5},
      {"en":"NORTHNORTHWEST","cn":"北北西","dir":337.5},
      {"en":"NORTHNORTHEAST","cn":"北北东","dir":22.5},
      {"en":"NORTHEAST","cn":"东北","dir":45},
      {"en":"EASTNORTHEAST","cn":"东北东","dir":67.5},
      {"en":"WESTSOUTHWEST","cn":"西南西","dir":247.5},
      {"en":"SOUTHWEST","cn":"西南","dir":225},
      {"en":"SOUTHEAST","cn":"东南","dir":135},
      {"en":"EASTSOUTHEAST","cn":"东南东","dir":112.5},
      {"en":"SOUTHSOUTHWEST","cn":"南南西","dir":202.5},
      {"en":"SOUTHSOUTHEAST","cn":"南南东","dir":157.5},
      {"en":"ALMOST STATIONARY","cn":"原地摆动","dir":999}     
    ]