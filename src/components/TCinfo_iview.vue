<template>
  <div class="list">
    <el-button size="mini" type="info" icon="close" title="删除" v-on:click="$emit('remove')">
    </el-button>

    <el-row class="list01">
      <el-col :span="5" class="time">
        当地时间
        <el-date-picker
         :style="{width:'120px'}"       
         size="small"
         v-model="selectDate"
         align="right"
         type="date"
         format="dd日"
         placeholder="选择日">
       </el-date-picker>
         <el-time-select
         size="small"
         :style="{width:'150px'}"
         v-model="selectHour"
         :picker-options="{
          start: '02:00',
          step: '03:00',
          end: '23:00' 
         }"
         placeholder="选择时间">
         </el-time-select>
      </el-col>
      <el-col :span="4">
        <span>
          TC级别
        </span>
        <el-select v-bind:title="rankEN" v-model="rankEN" placeholder="请选择" size="small"
        allow-create filterable>
          <el-option v-for="(rank,index) in rankList" :label="rank.cn" :value="rank.en"
          :key="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2" class="short_input">
        <el-input placeholder="ID" v-bind:title="rid" v-model="ID" size="small">
          <template slot="prepend">
            编号
          </template>
        </el-input>
      </el-col>
      <el-col :span="3" class="both_append">
        <span v-on:click="trigerSlider('pressure')">
          
          <el-input placeholder="pressure" v-model.number="pressure" size="small">
            <template slot="prepend">
              中心气压
            </template>
            <template slot="append">
              hPa
            </template>
          </el-input>
        </span>
      </el-col>
    
    </el-row>
    <el-row class="list02">
      <el-col :span="6">
        位置
        <el-select v-bind:title="rankEN" v-model="locationCN" placeholder="请选择"
        size="small" allow-create filterable>
          <el-option v-for="(loc,index) in region" :label="loc.cn" :value="loc.cn"
          :key="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col  :span="3" class="both_append">
      <span v-on:click="trigerSlider('lon')">
         
        <el-input placeholder="lat" v-model.number="lon" size="small">
          <template slot="prepend">
            经度
          </template>
          <template slot="append">
            E
          </template>
        </el-input>
      </span>
    </el-col>
    <el-col :span="3" class="both_append">
      <span v-on:click="trigerSlider('lat')">
        
          <el-input placeholder="lat" v-model="lat" size="small">
            <template slot="prepend">
            纬度
            </template>
            <template slot="append">
            N
            </template>
          </el-input>
        </span>
      </el-col>
      <!--<el-col :span="9">
        location
        <el-select v-bind:title="rankEN" v-model="locationEN" placeholder="请选择"
        size="small" allow-create filterable>
          <el-option v-for="(loc,index) in region" :label="loc.en" :value="loc.en"
          :key="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="9">-->
      <el-col :span="3" style="margin-left:15px;">
        查看警报  
        <el-switch
        v-model="detail"
        on-color="#13ce66"
        size="small">
        </el-switch>
      </el-col>
       
      
    </el-row>
    <el-row class="list03">
      <el-col :span="4">
        强度趋势
        <el-select v-bind:title="rankEN" v-model="trend" placeholder="请选择" size="small"
        allow-create filterable>
          <el-option v-for="(item,index) in trendList" :label="item.cn" :value="item.cn"
          :key="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        移向
        <el-select v-bind:title="rankEN" v-model="moveDir" placeholder="请选择" size="small"
        allow-create filterable>
          <el-option v-for="(item,index) in dirList" :label="item.cn" :value="item.cn"
          :key="index">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="both_append">
        <Tooltip :content="calKTS+' KTS'">
        <span v-on:click="trigerSlider('speedKMH')">
        <Slider v-model.number="speedKMH" :min="0" :max="50" v-if="showSlider.speedKMH"></Slider>
        <el-input placeholder="speed" v-model.number="speedKMH" size="small">
          <template slot="prepend">
            移速
          </template>
          <template slot="append">
            km/h
          </template>
        </el-input>
        </span>
        </Tooltip>
    </el-col>
    <el-col :span="3" class="both_append">
      <Tooltip :content="calKMH+' km/h'">
      <span v-on:click="trigerSlider('speedKTS')">
        
        <el-input placeholder="speed" v-model="speedKTS" size="small">
          <template slot="prepend">
            speed
          </template>
          <template slot="append">
            KTS
          </template>
        </el-input>
        </span>
        </Tooltip>
      </el-col>
      <el-col :span="2">
        <el-input  v-model="cName" size="small">
          <template slot="prepend">命名</template>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-input  v-model="eName" size="small">
          <template slot="prepend">Name</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row class="messageBox"><!-- 描述框 -->
      <el-input ref="textEN" :autosize="{ minRows: 2, maxRows: 4}"
      type="textarea" placeholder="请输入内容" name="messageEN"
      v-model="depictEN" >
      </el-input>
      <el-button type="primary" size="small" class="text-item" 
      title="copy"  @click="copyText('textEN')">copy</el-button><!-- 复制按钮 -->
    </el-row>
    <el-row class="messageBox">
      <el-input ref="textCN" type="textarea" autosize placeholder="请输入内容" name="messageCN"
      v-model="depictCN">
      </el-input>
      <el-button type="primary" size="small" class="text-item" 
      title="copy"  @click="copyText('textCN')">copy</el-button>
    </el-row>
  </div>
</template>
<script>
  import _ from 'lodash';
  import {
    TClist,
    moveDirList,
    regionList,
    TCRankList,
    trendList,
    geoInfo,
    pointInPoly,
    convertGeoInfo,
    converDir,
    converData,
    fitTyphoon
  }
  from '../util.js';
  //import inputPop from './inputPop.vue';

  export default {
    name:
    'tc-info',
    //components:{inputPop},

    props: {
      'tcItem': Object,
      'rankList': Array,
      'region': Array,
      'trendList': Array,
      'dirList': Array
    },

    data: function() {
      //console.log(regionList);
      var inside = false;
      var location = null;
      var _this = this;
      for (let i = 0; i < geoInfo.length; i++) {
        inside = pointInPoly([this.tcItem.lon, this.tcItem.lat], geoInfo[i].cd);
        if (inside) {
          location = geoInfo[i].region;
          //console.log(location);
          break;
        }
      }

      var locEN = null;
      if (inside) {
        regionList.forEach(function(item) {
          if (location == item.cn) {
            locEN = item.en;
          }
        });
      }
      let nowTime = new Date();
      return {
        //date: this.tcItem.date ? this.tcItem.date: "",
        //hour: this.tcItem.hour ? this.tcItem.hour: "",
        rankEN: this.tcItem.rankEN ? this.tcItem.rankEN: "",
        ID: this.tcItem.ID ? this.tcItem.ID.replace(/\*+/,''): "",//剔除****的ID号
        pressure: this.tcItem.pressure ? Number(this.tcItem.pressure): "",
        lat: this.tcItem.lat ? this.tcItem.lat: "",
        lon: this.tcItem.lon ? this.tcItem.lon: "",
        locationCN: location ? location: "",
        locationEN: locEN ? locEN: "",
        trend: this.tcItem.trend ? this.tcItem.trend: "",
        moveDir: this.tcItem.moveDir ? this.tcItem.moveDir: "",
        speedKMH: this.tcItem.speedKMH ? this.tcItem.speedKMH: "",
        speedKTS: this.tcItem.speedKTS ? this.tcItem.speedKTS: "",
        rid: this.tcItem.rid ? this.tcItem.rid: Math.random()*10,
        cName: this.tcItem.TSCNAME ? this.tcItem.TSCNAME: "",
        eName: this.tcItem.TSENAME ? this.tcItem.TSENAME: "",
        showSlider:{
          lat:false,
          lon:false,
          speedKTS:false,
          speedKMH:false,
          pressure:false
        }
        ,selectHour:this.tcItem.hour ? this.tcItem.hour +':00': ""
        ,test:new Date(2016, 9, 10, 18, 40)
        ,selectDate:this.tcItem.timeUTC ? this.tcItem.timeUTC: nowTime.toISOString(),
        detail:false,
        //,stylePop:{left: '0px',              right: '0px'}
        //,oldCN:""
      }
    },
    computed: {
      date:function(){
        if(this.selectDate){
          let time = new Date(this.selectDate)
          return (Array(2).join('0') + time.getDate()).slice(-2);
        }
        
      }
      ,hour:function(){
        if(this.selectHour){
          return this.selectHour.slice(0,2);
        }
        
      }
      ,calKTS:function(){
        return (this.speedKMH/1.852).toFixed(2);
      }
      ,calKMH:function(){
        return (this.speedKTS*1.852).toFixed(2);
      }
      ,rankCN: function() {
        let _rankEN = this.rankEN;
        let rank = 'error';
        this.rankList.forEach(function(item) {
          if (_rankEN == item.en) {
            rank = item.cn;
          }
        })
        if (rank != 'error') return rank;
      }
      ,trendEN: function() {
        let _trendCN = this.trend;
        let trendEN = 'error';
        this.trendList.forEach(function(item) {
          if (_trendCN == item.cn) {
            trendEN = item.en;
          }
        })
        if (trendEN != 'error') return trendEN;
      },
      moveDirEN: function() {
        let _dir = this.moveDir;
        let dirEN = 'error';
        this.dirList.forEach(function(item) {
          if (_dir == item.cn) {
            dirEN = item.en;
          }
        })
        if (dirEN != 'error') return dirEN;
      }
      ,
      depictEN: function() {
        let moveDepict = '';
        if(this.moveDirEN){
          if(this.moveDirEN == 'ALMOST STATIONARY'){
            moveDepict = 'ALMOST STATIONARY.';
          }
          else{
            moveDepict = 'THE MOVEMENT IS TOWARDS ' + this.moveDirEN  + 
                   (this.speedKTS ? ' ' + this.speedKTS + 'KTS.': '');
          }
        }
        else{
          moveDepict = '';
        }

        let text = (this.date ? 'AT ' + this.date + '/': '') + (this.hour ? (this.hour + ':00' + ' L.T.') : '') + (this.rankEN ? ' THE ' + this.rankEN: '') + 
                   (this.ID ? ' ' + this.ID + ' ': '') + (this.eName ? '(' + this.ID + ' ' + this.eName.toUpperCase() +')': '') + 
                   (this.pressure ? ' ' + this.pressure + 'HPA': '') + 
                   (this.locationEN ? ' OVER ' + this.locationEN: '') + 
                   (this.lat ? ' WAS LOCATED NEAR ' + this.lat + 'N ': '') + 
                   (this.lon ? this.lon + 'E. ': '') + (this.trendEN ? this.trendEN + '. ': '') + moveDepict;
        //if(text) text += '.';
        text += (this.detail? ' PLEASE REFER TO TC WARNING FOR DETAIL.' : '');
        return text;
      }
      ,
      depictCN: function() {
        let moveDepict = '';
        if(this.moveDir){
          if(this.moveDir == '原地摆动'){
            moveDepict = '，原地摆动。';
          }
          else{
            moveDepict = '，向' + this.moveDir + '方向移动，' + (this.speedKMH ? '移速' + this.speedKMH + '公里/小时。': '');
          }
        }
        else{
          moveDepict = '';
        }

        let text = (this.date ? this.date + '日': '') + (this.hour ? this.hour + '时(北京时)，': '') +  
        (this.ID ? ' ' + this.ID + '(' + this.ID + ')号': '') + (this.rankCN ? this.rankCN: '') + 
        (this.cName ? this.cName + '，': '') + 
        (this.lat ? '位于北纬' + this.lat + '度': '') + (this.lon ? '，东经' + this.lon + '度': '') + 
        (this.pressure ? '，中心气压' + this.pressure + '百帕，': '') + (this.locationCN ? '也就是在' + this.locationCN: '') + 
        (this.trend ? '，' + this.trend:'') + 
        moveDepict;
        //if(text) text += '。';
        text += (this.detail? '请查看热带气旋警报。' : '');
        return text;
      }
    },
    watch: { //改成computed属性更好？
      locationEN: function() {
        //console.log("locationEN");
        let loc = 'error';
        let _EN = this.locationEN;
        this.region.forEach(function(item) {
          if (_EN == item.en) loc = item.cn;
        });
        if (loc != 'error') this.locationCN = loc;
      },
      locationCN: function() {
        let loc = 'error';
        let _CN = this.locationCN;
        this.region.forEach(function(item) {
          if (_CN == item.cn) {
            loc = item.en;
          }
        });
        if (loc != 'error') this.locationEN = loc;
      },
      lat: function() {
        this.pnpoly([this.lon, this.lat]);
      },
      lon: function() {
        this.pnpoly([this.lon, this.lat]);
      }
    },
    methods: {
      trigerSlider:function(loc){
        //console.log(loc);
        this.showSlider[loc] = !this.showSlider[loc];
      }
      ,popInput:function(value,event){
      //console.log(event);
      this.popShow = !this.popShow;
      if(this.popShow){
        this.popValue = value;
        //this.stylePop.left = event.pageX.toString()+'px';
        //this.stylePop.top = (event.pageY-20).toString()+'px';
        this.targetPop = event.target;
      }
      
      }
      ,changeInput:function(value){
      //console.log(value);
      this.targetPop.value = value;
      }
      ,pnpoly: _.debounce(function(point) {
        let inside = false;
        let location = "";
        var _this = this;
        for (let i = 0; i < geoInfo.length; i++) {

          inside = pointInPoly(point, geoInfo[i].cd);
          if (inside) {
            location = geoInfo[i].region;
            break;
          }
        }
        if (inside) this.locationCN = location;
      },1000),
      changeLocation: function() {
        let loc = null;
        let _CN = this.locationCN;
        this.region.forEach(function(item) {
          if (_CN == item.cn) {
            loc = item.en;
          }
        });
        if (loc != null) this.locationEN = loc;
      },
      copyText:function(node){
        let textElem = this.$refs[node].$el.querySelector('textarea');
        if(!textElem) return;
        textElem.focus();
        textElem.select();
        try{
          if(document.execCommand('copy', false, null)){
            this.$notify({
              title: '复制成功',
              message: textElem.value,
              type: 'success',
              duration:'2000',
            });
            textElem.blur();
          } else{
            this.$notify({
              title: '复制失败',
              message: '您的浏览器不支持document.execCommand方法',
              type: 'error',
              duration:'2000',
            });
          }
        } catch(err){
            //fail info
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.time .el-input-group{
  width:35% !important;
}

.list02 .el-select{
  min-width: 80%;
  }

.input_pop{
  position:absolute;
  left:-20px;
  top:-30px;
  z-index:100;
  width:16%;
}


.ivu-slider{
    position: relative;
    bottom: 30px;
    margin-top:10px;
  }

.text-item{
  padding: 2px 2px 4px 2px;
  top: 1px;
  right: 1px;
  position: absolute;
}

</style>
