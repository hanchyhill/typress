<template>
<div id="app">
  <Modal v-model="showTDWarning" width="25%">
        <p slot="header" style="color:#f60;text-align:center;font-size:20px;">
            <Icon type="information-circled"></Icon>
            <span>责任区内包含TD</span>
        </p>
        <div style="text-align:center;font-size:15px;" >
            <p>在责任区内写未发布的TD可能会引起误会</p>
            <p>是否需要修改为低压区</p>
        </div>
        <div slot="footer" style="text-align:center;">
            <Button type="success" size="large" style="width:200px;" @click="change2low(true)">修改</Button>
            <Button type="error" size="small" @click="change2low(false)">不修改</Button>
        </div>
    </Modal>
  <el-row :gutter="10">
    <el-col :span="1"><div class="grid-content"></div></el-col>
    <el-col :span="23">
  <el-row>
    <el-col :span="23">
      <el-tabs v-model="activeName" type="card" >
        <el-tab-pane label="广州报文" name="GZ"></el-tab-pane>
        <el-tab-pane label="低压区/TD" name="LPA" v-if="jpLPA.length!=0"></el-tab-pane>
        <el-tab-pane label="北京报文" name="BJ"></el-tab-pane>
      </el-tabs>
      <div class="grid-content bg-purple">
      <el-table v-show="activeName=='GZ'"  @row-click = "addNewItem" :data="remoteList"
      stripe  max-height="300" :default-sort = "{prop: 'UTC', order: 'descending'}"
      style="width: 100%" class = "tc_list_table">
      <el-table-column prop="UTC" label="UTC" sortable></el-table-column>
      <el-table-column prop="UTC8" label="UTC+8"></el-table-column>
      <el-table-column prop="lat" label="lat"></el-table-column>
      <el-table-column prop="lon" label="lon"></el-table-column>
      <el-table-column prop="pressure" label="pressure"></el-table-column>
      <el-table-column prop="rankEN" label="scale"></el-table-column>
      <el-table-column prop="ID" label="ID" sortable></el-table-column>
      <el-table-column prop="moveDir" label="移向"></el-table-column>
      <!--<el-table-column prop="direction" label="DIR"></el-table-column>-->
      <el-table-column prop="speedKMH" label="移速km/h"></el-table-column>
      <el-table-column prop="TSCNAME" label="TSCNAME"></el-table-column>
      <el-table-column prop="TSENAME" label="TSENAME"></el-table-column>
      <!--<el-table-column prop="time" label="time"></el-table-column>-->
    </el-table>
    <!--结束广州报文-->
    <el-table v-show="activeName=='BJ'"  @row-click = "addNewItem" :data="bjList"
      stripe  max-height="300" :default-sort = "{prop: 'UTC', order: 'descending'}"
      style="width: 100%" class = "tc_list_table">
      <el-table-column prop="UTC" label="UTC" sortable></el-table-column>
      <el-table-column prop="UTC8" label="UTC+8"></el-table-column>
      <el-table-column prop="lat" label="lat"></el-table-column>
      <el-table-column prop="lon" label="lon"></el-table-column>
      <el-table-column prop="pressure" label="pressure"></el-table-column>
      <el-table-column prop="rankEN" label="scale"></el-table-column>
      <el-table-column prop="ID" label="ID" sortable></el-table-column>
      <el-table-column prop="moveDir" label="移向"></el-table-column>
      <el-table-column prop="speedKMH" label="移速km/h"></el-table-column>
      <el-table-column prop="TSCNAME" label="TSCNAME"></el-table-column>
      <el-table-column prop="TSENAME" label="TSENAME"></el-table-column>
    </el-table>
    <!--结束北京报文-->
    <el-table v-show="activeName=='LPA'" @row-click = "JPaddItem" :data="jpLPA"
      stripe max-height="300" style="width: 100%" class = "tc_list_table">
      <el-table-column prop="timeText" label="世界时"></el-table-column>
      <el-table-column prop="hour" label="小时"></el-table-column>
      <el-table-column prop="lat" label="lat"></el-table-column>
      <el-table-column prop="lon" label="lon"></el-table-column>
      <el-table-column prop="pressure" label="pressure"></el-table-column>
      <el-table-column prop="rankEN" label="scale"></el-table-column>
      <el-table-column prop="moveDir" label="移向"></el-table-column>
      <el-table-column prop="speedKTS" label="节"></el-table-column>
    </el-table>
    <!--结束日本低压区-->
    </div></el-col>
  </el-row>

<el-row>
  <el-col :span="23">
    <div class="tool_bar grid-content">
      <el-button type="primary" title="新建描述" icon="plus" v-on:click="addNewItem('')" size="small">添加词条</el-button>
      <el-select v-model="insSelected" placeholder="机构" size="small"
      allow-create filterable style="width: 100px">
        <el-option v-for="(item,index) in insList" :label="item.cn" :value="item.value"
        :key="index">
        </el-option>
      </el-select>
      选择查询日期范围
      <span class = "time_input">
      <Date-picker @on-change="changeSearchTime" type="daterange" :options="searchTime" :value="searchRange"
      placement="bottom-end" placeholder="选择日期" style="width: 200px"></Date-picker>
      </span>
      <el-button type="success" title="search" icon="search" v-on:click="getData(insSelected)" size="small">查询</el-button>

    <el-button type="success" title="搜索日本报文" icon="search" v-on:click="getBulletin" size="small">低压区/TD (WWJP25)</el-button>
    <el-button type="primary" title="上传至服务器" v-on:click="ftpUpload" size="small">上传FTP<i class="el-icon-upload el-icon--right"></i></el-button>
    <span class = "time_input">
      <Date-picker v-model="ftpDate"
      type="date"
      placeholder="选择日期" style="width: 150px"></Date-picker>
    </span>
    <el-select v-model="ftpHour" placeholder="请选择" size="small" style="width: 100px">
      <el-option label="08时" value="0800"></el-option>
      <el-option label="20时" value="2000"></el-option>
    </el-select>
    </div>
  </el-col>
</el-row>

  <el-row  v-for="(TC,index) in TClist" :key="TC.rid">
    <el-col :span="23" class="info_list grid-content bg-purple-light">
    <tc-info :tc-item="TC" :rank-list="TCRankList" :region="region" :trend-list="trendList"
    :dir-list="moveDirList" v-on:remove="TClist.splice(index, 1)" ></tc-info>
    </el-col>
  </el-row>

  </el-col>
  </el-row>
</div>
</template>

<script>
import axios from 'axios';
import TcInfo from './components/TCinfo_iview.vue';
import Vue from 'vue';
import dayjs from 'dayjs';
import { TClist,moveDirList,regionList,TCRankList,trendList,geoInfo,
pointInPoly,convertGeoInfo,converDir,converData,fitTyphoon } from './util.js';

export default {
  name: 'app',
  components:{TcInfo}
	,data:function(){

    let iniTime = new Date();
    var iniTime2 = new Date();
    iniTime2.setTime(iniTime2.getTime() - 3600 * 1000 * 24);
    let eTime = iniTime.getFullYear().toString() +
                (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) +
                (Array(2).join('0') + iniTime.getDate()).slice(-2);
    let sTime = iniTime2.getFullYear().toString() +
                (Array(2).join('0') + (iniTime2.getMonth()+1)).slice(-2) +
                (Array(2).join('0') + iniTime2.getDate()).slice(-2);
    return {
    //TClist : TClist
    TClist : [],
    TCRankList:TCRankList,
    region:regionList,
    trendList : trendList,
    moveDirList:moveDirList,
    remoteList:[], //数据库返回数据
    bjList:[], //BJ数据
    jpLPA:[], //日本低压区数据
    TCinfo : [],
    searchRange:[iniTime2, iniTime],
    startTime:sTime,
    endTime:eTime,
    fitTime:this.fitDate(),
    activeName:'GZ',
    insSelected:'BCGZ',
    ftpDate:new Date(),
    ftpHour:(new Date()).getHours()>14? '2000':'0800',
    insList:[
      {value:'BCGZ',cn:'广州',},
      {value:'BABJ',cn:'北京',}
    ],
    searchTime: {
       shortcuts: [
         {
           text: '最近1周',
             value () {
               const end = new Date();
               const start = new Date();
               start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
               return [start, end];
             }
          },
          {
            text: '1个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '3个月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      showTDWarning:false,
      itemWarning:{},
	  }
  }
  ,created:function(){
      this.getBulletin();// 获取日本报文
      this.getBasicInfo();
  }
  ,computed:{
  }
  ,methods: {
    getBasicInfo:function(){
      // var _this = this;

///////////测试用////
      //this.getTestData();
//////////////测试用结束///////////
//业务用可链接数据库后启用//      this.getData();
      this.getData('BCGZ');
      this.getData('BABJ');
    },
    fitDate:function(){
      let fitTime = new Date();
      let fitHour = 2<fitTime.getHours()&&fitTime.getHours()<14? 2:14;
      fitTime.setHours(fitHour,0,0,0);
      return fitTime.getTime();
    }
    ,changeSearchTime:function(time){
      //console.log(time);
      this.startTime =  (function(){
        let s = time[0];
        if(s){
          s = s.slice(0,4) + s.slice(5,7) + s.slice(8,10)
        }
          return s;
        })()
        this.endTime =  (function(){
        let s = time[1];
        if(s){
          s = s.slice(0,4) + s.slice(5,7) + s.slice(8,10)
        }
          return s;
        })()
    }
    ,addNewItem:function(row){
      var rid = Math.random()*10;
      if(typeof row == "object"){
        row.rid = rid;
        this.TClist.unshift(row);
      }
      else{
        let TC = {};
        TC.rid = rid;
        this.TClist.unshift(TC);
      }
    },
    JPaddItem:function(row){
      // console.log(row);
      if(row.lat>0&&row.lat<50&&row.lon>105&&row.lon<150.1&&row.rankEN=='TD'){
        this.itemWarning = Object.assign({},row);
        this.showTDWarning = true;
        this.$notify({
          title: '责任区内包含TD',
          message: '请检查是否需要把强度修改为低压区',
          type: 'error',
          duration:'6000',
        });
      }else{
        this.addNewItem(row);
      }
    },
    change2low(change=true){
      if(change){
        this.itemWarning.rankEN='LOW PRESSURE AREA';
      }else{
        '';
      }
      this.addNewItem(this.itemWarning);
      this.showTDWarning = !this.showTDWarning;
    }
////////////////查询广州报文////////////////
    ,getData:function(ins='BCGZ'){
      // console.log(ins);
      var params = 'startTime=' + this.startTime + '&' +
                   'endTime=' + this.endTime + '&' +
                   'ins=' + ins;

      var fullURL = '/fetch/getData?' + params + '&interface=getObs';
      var  _this = this;
      this.$message({
          message: '正在查询数据库',
          type: 'info',
          duration: 1000
        });
      axios.get(fullURL)
        .then( res => {
          //console.log(res);

          if(res.data.error) {
            this.$notify({
              title: 'Empty data',
              message: '连接信息中心服务器错误，按F12查看详情',
              type: 'warning',
              duration:'3500',
            });
            console.log(res.data.errorMessage);
            return;
          }

          if(res.data.ROWCOUNT == "0") {
            this.$notify({
              title: 'Empty data',
              message: '此时段未找到热带气旋信息',
              type: 'warning',
              duration:'3500',
            });
            return;
          }
          if(ins=='BCGZ'){
            this.remoteList = converData(res.data.DATA);
            this.remoteList.forEach(item=>{
              if(item.lon<140&&item.lon>105&&item.lat<25&&item.lat>0){
                Vue.set(item,'TCwarning',true);
              }
            })
          }else{
            this.bjList = converData(res.data.DATA);
          }

          //console.log(_this.removeList);
          params = params + '&interface=getInfo';
          let url =  '/fetch/getData?' + params;
          axios.get(url)
            .then( res => {
              //console.log(res);
              //_this.remoteList =
              if(res.data.error) {
                this.$notify({
                  title: 'Empty data',
                  message: '连接信息中心服务器错误，按F12查看详情',
                  type: 'warning',
                  duration:'3500',
                });
                console.log(res.data.errorMessage);
                return;
              }

              this.fitTyphoon(res.data.DATA,ins);
              this.$message({
                message: '查询完成',
                type: 'success',
                duration: 1000
              });
              ins=='BCGZ'?this.corTime():'';
              setTimeout(()=>this.activeName = 'GZ',500);
            })
            .catch(error => {
              console.log(error);
              this.$message.error('查询出错，F12查看详情');
            });
        })
         .catch(error => {
            console.log(error);
            this.$message.error('查询出错，F12查看详情');
         });
    }
    ,getTestData:function(){
      let url = 'api/testData';
      axios.get(url)
        .then(res => {
          this.remoteList = converData(res.data.DATA);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getBulletin:function(){
      let fullURL = '/fetch/getData?' +  '&interface=bulletin';
      this.$message({message: '正在查询最新日本报文',type: 'info',duration: 1000});
      axios.get(fullURL)
      .then(res=>{
        if(res.data.error) {
          this.$notify({
            title: 'Empty data',
            message: '连接NOAA服务器错误，按F12查看详情',
            type: 'warning',
            duration:'3500',
          });
          console.log(res.data.errorMessage);
          return;
        }
        if(res.data.status){
          // console.log(res.data);
          this.jpLPA = res.data.data;
          this.$message({message: '发现低压区/TD信息',type: 'info',duration: 1000});
          setTimeout(()=>this.activeName = 'LPA',500)
          //this.activeName = 'LPA';
        }
        else{
          this.$notify({title: 'Empty data', message: '无低压区、TD信息', type: 'warning', duration:'2000',});
        }
        //console.log(res.data);
      })
      .catch(error => {
            console.log(error);
            this.$message.error('查询日本报文出错，F12查看详情');
      });
    },
    fitTyphoon:function(tyInfo,ins='BCGZ'){
      let tyList = [];
      if(ins=='BCGZ'){
        tyList = this.remoteList;
      }else{
        tyList = this.bjList;
      }
      tyList.forEach(function(itemL){
        tyInfo.forEach(function(itemI){
          if(itemL.TSID == itemI.TSID){
            Vue.set(itemL,"TSCNAME",itemI.TSCNAME);
            Vue.set(itemL,"TSENAME",itemI.TSENAME);
            Vue.set(itemL,"ID",itemI.INTLID);
            }
          })
        })
    }
    ,corTime:function(){//自动装载对应时间的报文到描述列表
      let list = this.remoteList;
      //console.log(this.fitTime);
      list.forEach(item=>{
        //console.log(item.time);
        if(item.time == this.fitTime){
          this.TClist.unshift(item);
        }
      })
    },
    ftpUpload(){
      this.$message({message: '正在上传至服务器',type: 'info',duration: 1000});
      let date='2019040107',enDes='',cnDes='';
      date = dayjs(this.ftpDate).format('YYYYMMDD') + this.ftpHour;
      const enBoxList = document.querySelectorAll('.en-message textarea');
      for(let area of enBoxList){
        enDes += area.value + '\n';
      }
      const cnBoxList = document.querySelectorAll('.cn-message textarea');
      for(let area of cnBoxList){
        cnDes += area.value + '\n';
      }
      console.log(enDes);
      console.log(cnDes);
      const ftpURL = `/fetch/putData?date=2019040107&enDes=${enDes}&cnDes=${cnDes}`;
      axios.post('/fetch/putData',{
        date,
        enDes,
        cnDes,
      })
        .then(res=>{
          if(res.data.success){
            this.$notify({
              title: '上传FTP',
              message: '台风描述已上传完成',
              type: 'success',
              duration:'1000',
            });
          }else{
            throw res.data;
          }
        })
        .catch(err=>{
          this.$notify({
            title: '上传台风描述错误',
            message: err.message,
            type: 'error',
            duration:'6000',
          });
          console.error(err);
        })
    },
  }
}
</script>

<style>

/*#app{position: relative;float: left;left: 25%;}
.location{width:300px}*/


/*.info_list{
  margin:15px 5px 5px 5px;
  padding:10px;
  background-color:#F0F0F0;
}*/
.ivu-slider-button-wrap{
  top: -7px !important;
}

.info_list{
  padding:10px;
}

.tool_bar {
  padding:5px;
}

.button{
  border:1px solid black;
  cursor:pointer;
}

.tc_list_table .el-table__body-wrapper tr:hover{
  cursor:pointer;
  color:red;
}

.time_input{
  display:inline-block;
}

.time_input .el-input-group{
  width:20% !important;
}

  .el-row {
    margin-bottom: 8px;

  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  div{
  vertical-align: middle;
  }

 .ivu-slider-wrap{
    margin-bottom: -20px !important;
  }
</style>
