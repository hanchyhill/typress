<template>
<div id="app">
  <el-row :gutter="10">
    <el-col :span="1"><div class="grid-content"></div></el-col>
    <el-col :span="23">
  <el-row>
    <el-col :span="23"><div class="grid-content bg-purple">

      <el-table
      @row-click = "addNewItem"
      :data="remoteList"
      stripe
      max-height="300"
      :default-sort = "{prop: 'UTC', order: 'descending'}"
      style="width: 100%"
      id = "tc_list_table">
     <el-table-column
        prop="UTC"
        label="UTC"
        sortable
        >
      </el-table-column>
      <el-table-column
        prop="UTC8"
        label="UTC+8"
        >
      </el-table-column>
     <el-table-column
      prop="lat"
      label="lat"
      >
     </el-table-column>
     <el-table-column
        prop="lon"
        label="lon"
        >
      </el-table-column>
      <el-table-column
        prop="pressure"
        label="pressure"
        >
      </el-table-column>
      <el-table-column
        prop="rankEN"
        label="scale"
        >
      </el-table-column>
      <el-table-column
        prop="ID"
        label="ID"
        sortable
        >
      </el-table-column>
      <el-table-column
        prop="moveDir"
        label="移向"
        >
      </el-table-column>
      <el-table-column
        prop="direction"
        label="DIR"
        >
      </el-table-column>
      <el-table-column
        prop="TSCNAME"
        label="TSCNAME"
        >
      </el-table-column>
      <el-table-column
        prop="TSENAME"
        label="TSENAME"
        >
      </el-table-column>
      <el-table-column
        prop="time"
        label="time"
        >
      </el-table-column>
    </el-table>

    </div></el-col>
  </el-row>

<el-row>
  <el-col :span="23">
    <div class="tool_bar grid-content">
    <el-button type="primary" title="新建描述" icon="plus" v-on:click="addNewItem('')" size="small">add</el-button>
      选择查询日期范围<span class = "time_input">
      <Date-picker @on-change="changeSearchTime" type="daterange" :options="searchTime" :value="searchRange"
      placement="bottom-end" placeholder="选择日期" style="width: 400px"></Date-picker>
      </span>
    <el-button type="primary" title="search" icon="search" v-on:click="getData" size="small">查询</el-button>
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
                (Array(2).join('0') + iniTime.getDate()).slice(-2) + 
                (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2);
    let sTime = iniTime2.getFullYear().toString() +  
                (Array(2).join('0') + iniTime2.getDate()).slice(-2) + 
                (Array(2).join('0') + (iniTime2.getMonth()+1)).slice(-2);
    return {
    //TClist : TClist
    TClist : []
    ,TCRankList:TCRankList
    ,region:regionList
    ,trendList : trendList
    ,moveDirList:moveDirList
    ,remoteList:[]
    ,TCinfo : []
    ,searchRange:[iniTime2, iniTime]
    ,startTime:sTime
    ,endTime:eTime
    ,fitTime:this.fitDate()
    ,searchTime: {
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
      }
	  }
  }
  ,created:function(){
      this.getBasicInfo();
  }
  ,computed:{
/*    startTime: function(){
      let s = this.searchRange[0]; 
      if(s){
        s = s.slice(0,4) + s.slice(5,7) + s.slice(8,10)
      }
      return s;
    }
    ,endTime:function(){
      let s = this.searchRange[1]; 
      if(s){
        s = s.slice(0,4) + s.slice(5,7) + s.slice(8,10)
      }
      return s;
    }*/
  }
  ,methods: {
    getBasicInfo:function(){
      var _this = this;
      
///////////测试用////
      //this.getTestData();
//////////////测试用结束///////////
//业务用可链接数据库后启用//      this.getData();
      this.getData();
    },
    fitDate:function(){
      let fitTime = new Date();
      let fitHour = 2<fitTime.getHours()<14? 2:14;
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

    }
////////////////////////////////
    ,getData:function(){
      var params = 'startTime=' + this.startTime + '&' +
                   'endTime=' + this.endTime;
      
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
          if(res.data.ROWCOUNT == "0") {
            this.$notify({
              title: 'Empty data',
              message: '此时段未找到热带气旋信息',
              type: 'warning',
              duration:'3500',
            });
            return;
          }
          this.remoteList = converData(res.data.DATA);
          //console.log(_this.removeList);
          params = params + '&interface=getInfo';
          let url =  '/fetch/getData?' + params;
          axios.get(url)
            .then( res => {
              //console.log(res);
              //_this.remoteList = 
              this.fitTyphoon(res.data.DATA);
              this.$message({
                message: '查询完成',
                type: 'success',
                duration: 1000
              });
              this.corTime();
            })

            .catch(error => {
              console.log(error);
              this.$message.error('查询出错，F12查看详情');
            });
        })
         .catch(rror => {
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
    }

    ,fitTyphoon:function(tyInfo){
      var tyList = this.remoteList;
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
    ,corTime:function(){
      let list = this.remoteList;
      
      list.forEach(item=>{
        if(item.time == this.time){
          this.TClist.unshift(item);
        }
      })
    }

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

#tc_list_table .el-table__body-wrapper tr:hover{
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
    &:last-child {
      margin-bottom: 0;
    }
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
