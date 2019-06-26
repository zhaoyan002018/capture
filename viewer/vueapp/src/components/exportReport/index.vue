<template>
  <div>
    <div>
      <template>
        <div class="stage">
          <ul class="books-list">
            <li class="oneLi fragility_btn" @mouseenter="btnShow('fragility_btn')" @mouseleave="btnClose('fragility_btn')">
              <img src="@/assets/bgCover.png" alt="">
              <p style="position: absolute;z-index: 5;
                  top: 119px;
                  font-size: 17px;
                  left: 17px;">
                脆弱性感知报告</p>
              <div class="hideBtn" v-show="watchAndExport">
                <span style="float: left;margin-left: 18px;cursor: pointer" @click="showDetail('fragility')">查看</span>
                <span style="float: right;margin-right: 15px;cursor: pointer" @click="exportReports()">导出</span>
              </div>
            </li>
            <li class="oneLi internetBehavior" @mouseenter="btnShow('internetBehavior')" @mouseleave="btnClose('internetBehavior')">
              <img src="@/assets/bgCover.png" alt="">
              <p style="position: absolute;z-index: 5;top: 119px;font-size: 17px;left: 17px;">
                网络行为审计</p>
              <div class="hideBtn" v-show="watchAndExport">
                <span style="float: left;margin-left: 18px;cursor: pointer" @click="showDetail('internetBehavior')">查看</span>
                <span style="float: right;margin-right: 15px;cursor: pointer" @click="exportReports()">导出</span>
              </div>
            </li>
            <li style="background: #CCCCCC"></li>
          </ul>
          <div class="desk"></div>
          <div class="desk-shadow"></div>
        </div>

      </template>
      <el-dialog :visible.sync="dialogFormVisible" title="导出PDF" width="600px" @close="resetTemp()">
        <div class="form">
          <el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">

            <el-form-item label="时间范围">
                <!--<el-select v-model="temp.timeRange" placeholder="请选择">-->
                  <!--<el-option v-for="item in timeRanges" :key="item.label" :label="item.label" :value="item.value"></el-option>-->
                <!--</el-select>-->
              <el-radio-group v-model="temp.timeRange">
                <el-radio v-for="item in timeRanges" :key="item.label" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报表名称">
              <el-radio v-model="radio" label="1">默认</el-radio>
              <el-radio v-model="radio" label="2">自定义</el-radio>
              <div v-show="radio === '2'">
                <el-input v-model="temp.name"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="dialogFormVisible = false" >取消</el-button>
          <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="expReport()">确定</el-button>
        </div>
      </el-dialog>
      <!--loading overlay -->
    </div>
  </div>
</template>

<script>
// import { fetcharticle, updatearticle, deleteacticle, createArticle, editUpdatearticle } from '@/api/article';
// import MolochPaging from '@/components/utils/Pagination';

export default {
  data () {
    return {
      radio: '1',
      watchAndExport: false,
      temp: {
        timeRange: 7
      },
      dialogFormVisible: false,
      timeRanges: [{
        value: 7,
        label: '最近一周'
      }, {
        value: 30,
        label: '最近一个月'
      }, {
        value: 90,
        label: '最近三个月'
      }]
    };
  },
  created () {
  },
  methods: {
    showDetail (dom) {
      switch (dom) {
        case 'fragility': window.open('report/fragilityReport/fragilityReport.html'); break;
        case 'internetBehavior': window.open(); break;
      }
    },
    btnShow (dom) {
      $('.' + dom).eq(0).find('.hideBtn').show();
    },
    btnClose (dom) {
      $('.' + dom).eq(0).find('.hideBtn').hide();
    },
    expReport () {
      this.dialogFormVisible = false;
    },
    exportReports () {
      this.dialogFormVisible = true;
    },
    resetTemp () {
      this.radio = '1';
      this.temp = {
        timeRange: 7
      };
    }
  }
};
</script>
<style scoped>
  .action span{
    margin-left:20px;
  }
  ul{
    list-style:none;
  }
  .stage{
    position:relative;
    margin:100px;
  }
  .desk{
    background:#eae1dc;
    width:500px;
    height:20px;
    position:absolute;
    bottom:-35px;
    border-bottom:2px solid #f5ebe9;
    z-index:-1;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .desk:after{
    content: "";
    background: #F2EDEA;
    width: 574px;
    position: absolute;
    height: 65px;
    -webkit-transform: perspective(300px) rotateX(50deg) translateX(-42px) translateY(-90px);
    transform: perspective(300px) rotateX(50deg) translateX(-42px) translateY(-90px);
  }
  .desk-shadow{
    position: absolute;
    bottom: -100px;
    z-index: -2;
    background: none;
    width: 510px;
    height: 65px;
    box-shadow: 0 56px 63px rgba(0,0,0,0.3);
    -webkit-transform: perspective(300px) rotateX(33deg) translateX(3px) translateY(-90px);
    transform: perspective(300px) rotateX(33deg) translateX(3px) translateY(-90px);
  }
  .books-list li{
    position:relative;
    display:inline-block;
    margin-left:12px;
    width:155px;
    height:215px;
    z-index:2;
    overflow-y:hidden;
    overflow-x:visible;
    color: #fff;
  }
  .books-list li img{
    width:100%;
    height: 100%;
  }
  .books-list li:after{
    content: "";
    position: absolute;
    overflow: hidden;
    right: 28px;
    bottom: 0px;
    width: 25px;
    height: 129px;
    background: rgba(0,0,0,0.4);
    box-shadow: 0 0 5px rgba(0,0,0,0.4);
    -webkit-transform: perspective(300px) rotateX(29deg) rotateY(-61deg) rotateZ(-11deg) translateX(8px) translateY(8px);
    transform: perspective(300px) rotateX(29deg) rotateY(-61deg) rotateZ(-11deg) translateX(8px) translateY(8px);
    z-index: -1;
  }
  .links-table{
    position: relative;
    top: 49px;
  }
  .hideBtn{
    position: absolute;
    z-index: 5;
    font-size:17px;
    bottom: 10px;
    width: 100%;
  }
  .oneLi{
    background: #F6F6F6;
    border: 1px solid #CCCCCC
  }
</style>
