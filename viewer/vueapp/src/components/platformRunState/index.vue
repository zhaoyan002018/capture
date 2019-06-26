<template>
  <div id="platRunState" class="app-container" style="height: 100%;">
    <div class="state">
      <div>
        <el-button class="refresh outline" type="primary" size="mini" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
      </div>
      <div>
        <el-row class="state_row" v-if="cpuData.rows.length" @mouseenter="clearInterval(timer)" @mouseleave="getList()">
          <el-col :span="7" class="state_col_4">
            <div style="width: 100%; height: 100%;position: relative;text-align: center;">
              <div class="state_title" style="top: 63% !important;"><span>CPU</span></div>
              <div>
                <!--color="rgb(19, 206, 102)"-->
                <el-progress type="circle" :color="cpu_color" :width="200" :percentage="cpu_data" style="margin: 0 auto;"></el-progress>
                <div class="runStateMore">
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="17" style="height: 100%;">
            <ve-line style="height: 100%;" :data="cpuData" :settings="secondSettings" :extend="cpuExtend"></ve-line>
          </el-col>
        </el-row>
        <el-row class="state_row" v-if="memoryData.rows.length" @mouseenter="clearInterval(timer)" @mouseleave="getList()">
          <el-col :span="7"  class="state_col_4">
            <div style="width: 100%; height: 100%;position: relative;text-align: center;">
              <div class="state_title"><span>内存</span></div>
              <div>
                <el-progress type="circle" :color="memory_color" :width="200" :percentage="memory_data" style="margin: 0 auto;"></el-progress>
                <div class="runStateMore">
                  <span>已使用:</span><span>{{memory.used}}</span><br />
                  <span>总容量:</span><span>{{memory.total}}</span><br />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="17" style="height: 100%;">
            <!--echarts-->
            <!--<div id="CPU" style="background: #000;width: 100%;height: 100%;"></div>-->
            <ve-line style="height: 100%;" :data="memoryData" :settings="secondSettings" :extend="memoryExtend"></ve-line>
            <!--<div id="melory" :option="memory_option" style="width:100%;height:400px;"></div>-->
          </el-col>
        </el-row>
        <el-row class="state_row" v-if="distData.rows.length" @mouseenter="clearInterval(timer)" @mouseleave="getList()">
          <el-col :span="7" class="state_col_4">
            <div style="width: 100%; height: 100%;position: relative;text-align: center;">
              <div class="state_title"><span>磁盘</span></div>
              <div>
                <el-progress type="circle" :color="dist_color" :width="200" :percentage="dist_data" style="margin: 0 auto;"></el-progress>
                <div class="runStateMore">
                  <span>使用中:</span><span>{{dist.inuse}}</span><br />
                  <span>总容量:</span><span>{{dist.total}}</span><br />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="17" style="height: 100%;">
            <ve-line style="height: 100%;" :data="distData" :extend="distExtend"></ve-line>
          </el-col>
        </el-row>
      </div>
    </div>
 </div>
</template>

<script>
import { getarticle } from '@/api/article';
import { changeSize } from '@/api/validate';
// import echarts from 'echarts';

export default {
  name: 'platRunState',

  data: function () {
    this.secondSettings = {
      area: true
    };
    this.memoryExtend = {
      xAxis: {
        type: 'time',
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        position: 'left',
        name: '内存使用率(%)',
        min: 0,
        max: 100,
        interval: 20
      },
      smooth: false
    };
    this.distExtend = {
      xAxis: {
        type: 'time',
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        position: 'left',
        name: 'KB/S'
      },
      smooth: false
    };
    this.cpuExtend = {
      xAxis: {
        type: 'time',
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        position: 'left',
        name: '利用率(%)',
        min: 0,
        max: 100,
        interval: 20
      },
      smooth: false
    };
    return {
      cpu: {},
      timer: '',
      cpu_color: '',
      cpu_data: 0,
      cpuData: {
        columns: ['time', 'ratio'],
        rows: []
      },
      memory: {},
      memory_color: '',
      memory_data: 0,
      memoryData: {
        columns: ['time', 'ratio'],
        rows: []
      },
      dist: {},
      dist_color: '',
      dist_data: 0,
      distData: {
        columns: ['time', 'read', 'write'],
        rows: []
      },
      error: '',
      recordsTotal: undefined,
      recordsFiltered: undefined,
      data: null,
      percentage: {},
      open: true
    };
  },
  computed: {

  },
  mounted: function () {
    // this.getList();
    // if (this.timer) {
    //   clearInterval(this.timer);
    // } else {
    //   this.timer = setInterval(() => {
    //     // console.log(3);
    //     this.getList();
    //   }, 1000);
    // }
  },
  watch: {

  },
  methods: {
    getList: function () {
      getarticle({ open: this.open }).then((res) => {
        this.cpu = res.data.cpu;
        this.cpuData.rows = this.changeData(this.cpuData.columns, this.cpu.time, this.cpu.ratio);
        this.cpu_data = this.cpu.ratio[this.cpu.ratio.length - 1];
        this.changeColor(this.cpu_data, 'cpu_color');
        this.dist = res.data.dist;
        this.dist_data = parseInt(this.dist.inuse / this.dist.total);
        this.changeColor(this.dist_data, 'dist_color');
        this.distData.rows = this.changeData(this.distData.columns, this.dist.time, this.dist.read, this.dist.write);
        this.memory = res.data.memory;
        this.memory_data = this.memory.ratio[this.memory.ratio.length - 1];
        this.changeColor(this.memory_data, 'memory_color');
        this.memoryData.rows = this.changeData(this.memoryData.columns, this.cpu.time, this.memory.ratio);
        this.dist.inuse = changeSize(this.dist.inuse);
        this.dist.total = changeSize(this.dist.total);
        this.memory.used = changeSize(this.memory.used);
        this.memory.total = changeSize(this.memory.total);
      });
    },
    // 是数据转化成v-charts的row所用的类型
    changeData (column) {
      let row = [];
      if (arguments.length > 1) {
        for (let i = 0; i < arguments[1].length; i++) {
          let obj = {};
          obj[column[0]] = new Date(parseInt(arguments[1][i]) * 1000).toLocaleString().replace(/[\u4e00-\u9fa5]+/g, '');
          for (let j = 2; j < arguments.length; j++) {
            obj[column[j - 1]] = arguments[j][i];
          }
          row.push(obj);
        }
      }
      return row;
    },
    changeColor (newVal, dom) {
      if (newVal < 50 && newVal > 0) {
        this[dom] = 'rgb(19, 206, 102)';
      } else if (newVal < 85) {
        this[dom] = 'yellow';
      } else {
        this[dom] = '#f00';
      }
    },
    changePaging (pagingValues) {
      this.listQuery.length = pagingValues.length;
      this.listQuery.start = pagingValues.start;
      this.getList();
    }
  },
  beforeDestroy () {
    getarticle({ open: false });
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
  .runState {
    display: inline-block;
    width: 24%;
    text-align: center;
    position: relative;
  }
  .namePos{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -39%);
    font-size: 18px;
  }
  .stateTable{
    margin-top: 60px;
  }
  .refresh{
    /*color:#0f0 !important;*/
    font-weight:900;
    font-size: 16px;
    position: absolute;
    left: 20px;
    top: 0px;
    z-index: 4
  }
  .runStateMore{
    /*text-align: left;*/
    /*position:relative;*/
    /*width: 40%;*/
    /*left: 50%;*/
    /*transform: translate(-30%)*/
    text-align: center;
  }
  .state{
    position: relative;
    /*background: #f5f5f5;*/
    padding: 36px 0;
    /*top: 36px;*/
    height: 100%;
  }
  .state_row{
    min-height: 400px;
    background-color: #fcfcfc;
    padding-top: 10px;
  }
  .state_col_4{
    height: 100%;
    padding-top: 3%;
  }
  .state_title{
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .process{
    padding-left: 18px;
    background: #f0f0f0;
    line-height: 2;
    margin-bottom: 0;
    font-weight: 400;
  }
</style>
