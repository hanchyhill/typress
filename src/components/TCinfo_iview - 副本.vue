<template>
    <div class="list">
        <input v-model.number="testValue" @click="popInput(testValue,$event)">
        <input-pop class="input_pop" v-if="popShow" :value="popValue" 
        @changeInput="changeInput" :target="targetPop"
        ></input-pop>
        <el-button size="mini" type="info" icon="close" title="删除" v-on:click="$emit('remove')">
        </el-button>
        <el-row class="list01">
            <el-col :span="5" class="time">
                当地时间
                <el-input v-model="date" placeholder="day" size="small">
                    <template slot="append">
                        日
                    </template>
                </el-input>
                <el-input v-model="hour" placeholder="hour" size="small">
                    <template slot="append">
                        时
                    </template>
                </el-input>
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
                <el-input placeholder="pressure" v-model="pressure" size="small">
                    <template slot="prepend">
                        中心气压
                    </template>
                    <template slot="append">
                        hPa
                    </template>
                </el-input>
            </el-col>
      <el-col  :span="3" class="both_append">
                <el-input placeholder="lat" v-model="lon" size="small">
                    <template slot="prepend">
                        经度
                    </template>
                    <template slot="append">
                        E
                    </template>
                </el-input>
            </el-col>
      <el-col :span="3" class="both_append">
                <el-input placeholder="lat" v-model="lat" size="small">
                    <template slot="prepend">
                        纬度
                    </template>
                    <template slot="append">
                        N
                    </template>
                </el-input>
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
            <el-col :span="9">
                location
                <el-select v-bind:title="rankEN" v-model="locationEN" placeholder="请选择"
                size="small" allow-create filterable>
                    <el-option v-for="(loc,index) in region" :label="loc.en" :value="loc.en"
                    :key="index">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="list03">
            <el-col :span="5">
                强度趋势
                <el-select v-bind:title="rankEN" v-model="trend" placeholder="请选择" size="small"
                allow-create filterable>
                    <el-option v-for="(item,index) in trendList" :label="item.cn" :value="item.cn"
                    :key="index">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                移向
                <el-select v-bind:title="rankEN" v-model="moveDir" placeholder="请选择" size="small"
                allow-create filterable>
                    <el-option v-for="(item,index) in dirList" :label="item.cn" :value="item.cn"
                    :key="index">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" class="both_append">
                <el-input placeholder="speed" v-model="speedKMH" size="small">
                    <template slot="prepend">
                        移速
                    </template>
                    <template slot="append">
                        km/h
                    </template>
                </el-input>
      </el-col>
      <el-col :span="3" class="both_append">
                <el-input placeholder="speed" v-model="speedKTS" size="small">
                    <template slot="prepend">
                        speed
                    </template>
                    <template slot="append">
                        KTS
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="messageBox">
            <el-input type="textarea" autosize placeholder="请输入内容" name="messageEN"
            v-model="depictEN">
            </el-input>
        </el-row>
        <el-row class="messageBox">
            <el-input type="textarea" autosize placeholder="请输入内容" name="messageCN"
            v-model="depictCN">
            </el-input>
        </el-row>
    </div>
</template>
<script>
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
    import inputPop from './inputPop.vue';

    export default {
        name:
        'tc-info',
        components:{inputPop},

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

            return {
                date: this.tcItem.date ? this.tcItem.date: "",
                hour: this.tcItem.hour ? this.tcItem.hour: "",
                rankEN: this.tcItem.rankEN ? this.tcItem.rankEN: "",
                ID: this.tcItem.ID ? this.tcItem.ID: "",
                pressure: this.tcItem.pressure ? this.tcItem.pressure: "",
                lat: this.tcItem.lat ? this.tcItem.lat: "",
                lon: this.tcItem.lon ? this.tcItem.lon: "",
                locationCN: location ? location: "",
                locationEN: locEN ? locEN: "",
                trend: this.tcItem.trend ? this.tcItem.trend: "",
                moveDir: this.tcItem.moveDir ? this.tcItem.moveDir: "",
                speedKMH: this.tcItem.speedKMH ? this.tcItem.speedKMH: "",
                speedKTS: this.tcItem.speedKTS ? this.tcItem.speedKTS: "",
                rid: this.tcItem.rid ? this.tcItem.rid: 0.1
                ,testValue : 11
                ,popValue : 0
                ,popShow : false
                ,popX:0
                ,popY:0
                ,targetPop:{}
                //,stylePop:{left: '0px',                          right: '0px'}
                //,oldCN:""
            }
        },
        computed: {
            rankCN: function() {
                let _rankEN = this.rankEN;
                let rank = 'error';
                this.rankList.forEach(function(item) {
                    if (_rankEN == item.en) {
                        rank = item.cn;
                    }
                })
                if (rank != 'error') return rank;
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
                let text = (this.date ? 'AT ' + this.date + '/': '') + (this.hour ? (this.hour + ':00' + ' L.T.') : '') + (this.rankEN ? ' THE ' + this.rankEN: '') + (this.ID ? '(' + this.ID + ')': '') + (this.pressure ? ' ' + this.pressure + 'hPa': '') + (this.locationEN ? ' OVER ' + 'THE ' + this.locationEN: '') + (this.lat ? ' WAS LOCATED NEAR ' + this.lat + 'N ': '') + (this.lon ? this.lon + 'E. ': '') + (this.moveDirEN ? 'THE MOVEMENT IS ' + this.moveDirEN: '') + (this.speedKTS ? ' ' + this.speedKTS + 'KTS.': '');
                return text;
            }

            ,
            depictCN: function() {
                let text = (this.date ? this.date + '日': '') + (this.hour ? this.hour + '时(北京时)，': '') + (this.rankCN ? this.rankCN: '') + (this.ID ? '（编号：' + this.ID + '）': '') + (this.lat ? '位于北纬' + this.lat + '度': '') + (this.lon ? '，东经' + this.lon + '度': '') + (this.pressure ? '，中心气压' + this.pressure + '百帕，': '') + (this.locationCN ? '也就是在' + this.locationCN: '') + (this.moveDir ? '，向' + this.moveDir + '方向移动': '') + (this.speedKMH ? '，移速' + this.speedKMH + '公里/小时。': '');
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
          popInput:function(value,event){
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
          ,pnpoly: function(point) {
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
            },
            changeLocation: function() {
                let loc = null;
                let _CN = this.locationCN;
                this.region.forEach(function(item) {
                    if (_CN == item.cn) {
                        loc = item.en;
                    }
                });
                if (loc != null) this.locationEN = loc;
            }
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
/*@-moz-document url-prefix() { .el-select{
  top:11px; }
.el-select{
  top:11px;
}*/

/*.short_input .el-input-group{
  width:12% !important;
}

.both_append .el-input-group{
  width:80% !important;
}

.messageBox  .el-textarea{
    width:100% !important;
}

.el-col span{
  vertical-align:10px !important;
}*/
</style>
