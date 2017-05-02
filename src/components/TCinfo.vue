<template>
<div class="list">
  <a title="删除" class="button" v-on:click="$emit('remove')">✖</a>
  <div class="list01">
  <span>当地时间<input v-model="date">日
  <input v-model="hour">时</span>
  <span>TC级别<select v-bind:title="rankEN" v-model="rankEN">
  <option v-for="rank in rankList" v-bind:value="rank.en">{{rank.cn}}</option>
  </select></span>
  <span>编号<input v-bind:title="rid" v-model="ID"></span>
  <span>中心气压<input v-model="pressure">hPa</span>
  </div>
  <div class="list02">
  <span>纬度<input v-model="lat">N</span>
  <span>经度<input v-model="lon">E</span>
  <span>位置<select v-model="locationCN">
  <option v-for="loc in region" v-bind:value="loc.cn">{{loc.cn}}</option>
  </select></span>
  <span>location<select v-model="locationEN">
  <option v-for="loc in region" v-bind:value="loc.en">{{loc.en}}</option>
  </select></span></div>
  <div class="list03">
  <span>强度趋势<select v-model="trend">
  <option v-for="item in trendList" v-bind:value="item.cn">{{item.cn}}</option>
  </select></span>
  <span>移向<select v-model="moveDir">
  <option v-for="item in dirList" v-bind:value="item.cn">{{item.cn}}</option>
  </select></span>
  <span>移速<input v-model="speedKMH">公里/小时</span>
  <span>speed<input v-model="speedKTS">KTS</span>
  </div>
  <div class="messageBox">
  <textarea name="messageEN" v-model="depictEN"></textarea>
  </div>
  <div class="messageBox">
  <textarea name="messageCN" v-model="depictCN"></textarea>
  </div>
  </div>
</template>

<script>
import { TClist,moveDirList,regionList,TCRankList,trendList,geoInfo,
pointInPoly,convertGeoInfo,converDir,converData,fitTyphoon } from '../util.js';

export default {
  name: 'tc-info',

  props:{'tcItem':Object
    ,'rankList':Array
    ,'region':Array
    ,'trendList':Array
    ,'dirList':Array
  },

  data:function(){
    //console.log(regionList);
    var inside = false;
    var location = null;
    var _this = this;
    for(let i=0;i<geoInfo.length;i++){
      inside = pointInPoly([this.tcItem.lon,this.tcItem.lat],geoInfo[i].cd);
      if(inside){
        location = geoInfo[i].region;
          //console.log(location);
          break;
        } 
      }

      var locEN = null;
      if(inside){
        regionList.forEach(function(item){
        if(location == item.cn){
          locEN = item.en;
        } 
      });
      }
      
      
    return {
      date:this.tcItem.date?this.tcItem.date:""
      ,hour:this.tcItem.hour?this.tcItem.hour:""
      ,rankEN:this.tcItem.rankEN?this.tcItem.rankEN:""
      ,ID:this.tcItem.ID?this.tcItem.ID:""
      ,pressure:this.tcItem.pressure?this.tcItem.pressure:""
      ,lat:this.tcItem.lat?this.tcItem.lat:""
      ,lon:this.tcItem.lon?this.tcItem.lon:""
      ,locationCN:location?location:""
      ,locationEN:locEN?locEN:""
      ,trend:this.tcItem.trend?this.tcItem.trend:""
      ,moveDir:this.tcItem.moveDir?this.tcItem.moveDir:""
      ,speedKMH:this.tcItem.speedKMH?this.tcItem.speedKMH:""
      ,speedKTS:this.tcItem.speedKTS?this.tcItem.speedKTS:""
      ,rid:this.tcItem.rid?this.tcItem.rid:0.1
      //,oldCN:""
    }
  }
  ,computed:{
    rankCN:function(){
      let _rankEN = this.rankEN;
      let rank = 'error';
      this.rankList.forEach(
        function(item){
          if(_rankEN == item.en ){
            rank = item.cn;
          } 
        }
      )     
      if(rank !='error') return rank;
    }
    ,moveDirEN:function(){
      let _dir = this.moveDir;
      let dirEN = 'error';
      this.dirList.forEach(
        function(item){
          if(_dir == item.cn ){
            dirEN = item.en;
          } 
        }
      )
      if(dirEN !='error') return dirEN;
    }

    ,depictEN:function(){
      let text = (this.date?'AT '+ this.date +'/':'') 
      + (this.hour?(this.hour + ':00' +' L.T.'):'')
      + (this.rankEN?' THE '+ this.rankEN:'')
      + (this.ID? '('+this.ID+')':'')
    	+ (this.pressure?' ' + this.pressure + 'hPa':'')
      + (this.locationEN?' OVER '+'THE ' + this.locationEN:'')
      + (this.lat?' WAS LOCATED NEAR ' + this.lat + 'N ':'')
      + (this.lon?this.lon +'E. ':'')
    	+ (this.moveDirEN?'THE MOVEMENT IS ' + this.moveDirEN :'')
      + (this.speedKTS?' ' + this.speedKTS +'KTS.':'');
      return text;
    }

    ,depictCN:function(){
      let text = (this.date?this.date +'日' :'')
      + (this.hour?this.hour + '时(北京时)，' :'')
      + (this.rankCN?this.rankCN:'')
      + (this.ID? '（编号：'+this.ID+'）':'')
    	+ (this.lat?'位于北纬' + this.lat + '度':'')
      + (this.lon?'，东经' + this.lon +'度':'')
      + (this.pressure?'，中心气压' + this.pressure + '百帕，':'')
    	+ (this.locationCN?'也就是在' + this.locationCN:'')
    	+ (this.moveDir?'，向' + this.moveDir + '方向移动':'')
      + (this.speedKMH?'，移速' + this.speedKMH +'公里/小时。':'');
      return text;
    }

  }

  ,watch:{//改成computed属性更好？
    locationEN:function(){
      //console.log("locationEN");
      let loc = 'error';
      let _EN = this.locationEN;
      this.region.forEach(function(item){
        if(_EN == item.en) loc = item.cn;
      });
      if(loc != 'error') this.locationCN = loc;
      
    }

    ,locationCN:function(){
      let loc = 'error';
      let _CN = this.locationCN;
      this.region.forEach(function(item){
        if(_CN == item.cn){
          loc = item.en;
        } 
      });
      if(loc != 'error') this.locationEN = loc;
    }

    
    ,lat:function(){
      this.pnpoly([this.lon,this.lat]);      
    }
    ,lon:function(){
      this.pnpoly([this.lon,this.lat]);
      
    }
  }
  ,methods:{
    pnpoly:function(point){
      let inside = false;
      let location = "";
      var _this = this;
      for(let i=0;i<geoInfo.length;i++){
        
        inside = pointInPoly(point,geoInfo[i].cd);
        if(inside){
          location = geoInfo[i].region;
          //console.log(location);
          break;
        } 
      }
      if(inside) this.locationCN = location;      
    }
    ,changeLocation:function(){
      let loc = null;
      let _CN = this.locationCN;
      this.region.forEach(function(item){
        if(_CN == item.cn){
          loc = item.en;
        } 
      });
      if(loc != null) this.locationEN = loc;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #42b983;
}
</style>
