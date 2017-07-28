var TClist = require('./resource/TCList.json').result.TClist;
var tyInfo = require('./resource/typhoonInfo.json');
var moveDirList = tyInfo.result.moveDirList;
//console.log(moveDirList);
var regionList = tyInfo.result.region;
var TCRankList = tyInfo.result.TCRankList;
var region = tyInfo.result.region;   
var trendList = tyInfo.result.trendList;

function pointInPoly(point, polygon) {
	var x = point[0], y = point[1];

	var inside = false;
	for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		var xi = polygon[i][0], yi = polygon[i][1];
		var xj = polygon[j][0], yj = polygon[j][1];

		var intersect = ((yi > y) !== (yj > y)) &&
			(x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) {
			inside = !inside;
		}
	}
	return inside;
}



function convertGeoInfo(geoJSON){
  var geoList = [];
  geoJSON.forEach(function(item,index){
    let geoItem = {};
    geoItem.region = item.properties.region;
    geoItem.cd = item.geometry.coordinates[0];
    geoList.push(geoItem);
  })
  return geoList;
}

function converDir(dir){
  var dirCN = ''
  if(dir!=NaN){
    if(dir<=11.25) return '偏北';
    for(let i=0;i<moveDirList.length;i++){
      if(Math.abs(dir - moveDirList[i].dir)<=11.25){
        dirCN = moveDirList[i].cn;
        break;
      }
    }
    return dirCN;
    
  }
  else{
    return dirCN;
  }
}


function converData(list){
  var finalList = [];
  list.forEach(function(item,index){
    let UTCtime = item.DDATETIME.replace(' ','T')+"00Z";
    finalList[index] = {
      "ID":item.TCID,
      "rankEN":item.TCRANK,
      "lat":Number(item.LATITUDE),
      "lon":Number(item.LONGITUDE),
      "pressure":item.PRESSURE,
      "rankEN":item.TCRANK,
      "uyear":item.DDATETIME.slice(0,4),
      "umonth":item.DDATETIME.slice(5,7),
      "uday":item.DDATETIME.slice(8,10),
      "uhour":item.DDATETIME.slice(11,13),
      "speedKMH":item.SPEED?Number(item.SPEED):null,
      "moveDir":item.DIRECTION.length?converDir(Number(item.DIRECTION)):"",
      "direction":item.DIRECTION,
      "TSID":item.TSID,
      "timeUTC":UTCtime,
    };
    let localTime = new Date(Number(finalList[index].uyear), Number(finalList[index].umonth) - 1,
     Number(finalList[index].uday), Number(finalList[index].uhour) + 8);
    finalList[index].time = localTime.getTime();
    finalList[index].month = localTime.getMonth()+1;
    finalList[index].date = (Array(2).join('0') + localTime.getDate()).slice(-2);
    finalList[index].hour = (Array(2).join('0') + localTime.getHours()).slice(-2);
    finalList[index].speedKTS = finalList[index].speedKMH?Math.round(finalList[index].speedKMH/1.852):null;
    finalList[index].UTC = item.DDATETIME.slice(2,13);
    finalList[index].UTC8 = finalList[index].month +
                             '-' + finalList[index].date + ' ' + finalList[index].hour+'时';

  });

  return finalList;

}

function fitTyphoon(tyList,tyInfo){
  tyList.forEach(function(itemL,indexL){
    tyInfo.forEach(function(itemI,indexI){
      if(itemL.TSID == itemI.TSID){
        itemL.TSCNAME = itemI.TSCNAME;
        itemL.TSENAME = itemI.TSENAME;
      }
    })
  })
}

var geoInfo = convertGeoInfo(require('./resource/map.geo.json').features);

export { TClist
,moveDirList
,regionList
,TCRankList
,trendList
,geoInfo
,pointInPoly
,convertGeoInfo
,converDir
,converData
,fitTyphoon };

