var axios = require('axios');
const cheerio = require('cheerio');
/*
let fs = require('fs');
fs.readFile('./WWJP25 RJTD 250000.txt', 'ascii', (err, text)=> {
  if (err) throw err;
  convertBulletin(text);  //筛选出低压区信息
    //console.log(textArray);
})*/

function getBulletin(url){
  return new Promise((resolve,reject)=>{

    axios.get(url)
    .then(res=>{
      //console.log(res.data);
      const $ = cheerio.load(res.data);
      const bulletinRaw = $('.textframe').html().replace(/<br>/g,'\n').replace('<pre>','').replace('</pre','')
      let dataLPA = convertBulletin(bulletinRaw);
      // let dataLPA = convertBulletin(res.data);
      resolve(dataLPA);
    })
    .catch(error=>{
      //console.log(error.message);
      reject(error);
    })
  })
}

function convertBulletin(text){//筛选出低压区信息
  let textArray = text.split('.\n');// 句号分段语句
  textArray = textArray.map(text=>text.replace(/[\r\n]/g,' ')); //去除多余空行
  //console.log(textArray);
  let timeText = textArray[0].match(/\d{6}/)[0];//抓取小时
  let hour = undefined;
  if(timeText){
    hour = Number(timeText.slice(2,4)) + 8;
    hour = hour>23?hour-24:hour;
  }
  let infoLPA = textArray.filter(checkLowPressureArea);//找到低压区字段数组
  //console.log(infoLPA);
  let infoArray = ({});
  if(infoLPA.length){
    infoArray.status = 1;//状态1，有LPA内容
    try{
      infoArray.data = infoLPA.map(metaInfoLPA);
      //console.log(infoArray);
    }
    catch(err){
      //console.error(err);
      infoArray.errorMessage = err.message;
      infoArray.error = true;
      //return;//错误处理，返回错误
      return infoArray;
    }
  }
  else{
    infoArray.status = 0;//状态2，无LPA内容
    infoArray.info = 'empty, can not find low pressure area';
    infoArray.error = false;
  }

  return infoArray;
  function checkLowPressureArea(item){
    return item.indexOf('LOW PRESSURE AREA') !== -1 || item.indexOf('TROPICAL DEPRESSION') !== -1;
  }

  function metaInfoLPA(item){//解析低压区元数据
    //console.log(item);
    let regArray = item.match(/(\d+(\.\d+)?)\s*?HPA.*?(\d+(\.\d+)?)N\s*?(\d+(\.\d+)?)E/); //匹配气压、北纬、东经
    //console.log(regArray);
    if(!regArray) throw Error('在匹配低压区数据时发生错误，正则表达式无法找到适配的字段');
    let rank = '';
    if(item.indexOf('LOW PRESSURE AREA')!==-1){
      rank = 'LOW PRESSURE AREA';
    }else if(item.indexOf('TROPICAL DEPRESSION')!==-1){
      rank = 'TD';
    }else{

    }

    let meta = {
      pressure:Number(regArray[1]),
      lat:Number(regArray[3]),
      lon:Number(regArray[5]),
      rankEN:rank,
      hour:hour?(Array(2).join('0') + hour).slice(-2):'',
      timeText:timeText,
    }
    //console.dir(meta);
    let dirIndex = dirList.findIndex(ele=>{//查找条目中的移动方向信息
      let dirReg = new RegExp('\\b'+ele.en+'\\b(?!.* OF)');//匹配单词，但不匹配如SOUTH OF， EAST OF这样的单词，这样的是地理位置而不是方向
      let isMatch = item.match(dirReg);
      //console.log(isMatch);
      return isMatch
    });
    //console.log(dirIndex);
    if(dirIndex!==-1){
      meta.dir = dirList[dirIndex].dir;
      meta.moveDir = dirList[dirIndex].cn;
      if(meta.dir!==999){//原地摆动
        if(item.indexOf('SLOWLY')!==-1){

          meta.speedKTS = 2;
          meta.speedKMH = 4;
        }
        else{
          let knots = item.match(/(\d+)\s*?(KNOTS|KT)/)[1];
          //console.log(knots);
          if(knots){
            meta.speedKTS = Number(knots);
            meta.speedKMH = Math.round(meta.speedKTS*1.852);
          }
        }
      }
    }
    return meta;
  }
}

let dirList =[
  {"en":"ALMOST STATIONARY","cn":"原地摆动","dir":999},
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
  {"en":"EAST","cn":"偏东","dir":90},
  {"en":"SOUTH","cn":"偏南","dir":180},
  {"en":"SE","cn":"东南","dir":135},
  {"en":"ESE","cn":"东南东","dir":112.5},
  {"en":"SOUTHEAST","cn":"东南","dir":135},
  {"en":"EASTSOUTHEAST","cn":"东南东","dir":112.5},
  {"en":"SOUTHSOUTHWEST","cn":"南南西","dir":202.5},
  {"en":"SOUTHSOUTHEAST","cn":"南南东","dir":157.5}
];

async function getData(url){

  let data = await getBulletin(url);
  return data;
}


//getData('http://tgftp.nws.noaa.gov/data/raw/ww/wwjp25.rjtd..txt')
//.then(data=>console.log(data))
//.catch(error=>console.log(error));
exports.getJpBulletin = getData;
