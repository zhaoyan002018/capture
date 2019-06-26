<template>
  <div class="server_info">
    <span class="title">{{title}}</span>
    <div class="info-content">
      <div v-for="item in columns" :key="item.name">
        <div v-if="!item.title" class="subTitle">{{ item.name }}</div>
        <el-row v-else class="col">
          <el-col :span="8" class="col_title">{{ item.name }}</el-col>
          <el-col :span="16" class="col_body">
            <span v-if="item.fun">{{ item.fun(data[item.title]) }}</span>
            <span v-else>{{ data[item.title] }}</span>
            <!--<el-button v-if="item.subType" size="mini" type="info" style="position: absolute;top: 3px;margin-left: 20px;" @click="doActivation">{{ item.subName }}</el-button>-->
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { changeSize, isContinue } from '../../api/validate';

export default {
  data () {
    return {
      title: '服务器信息',
      columns: [
        { name: '基本信息' },
        { name: '服务器名称', title: 'name' },
        { name: '服务器版本', title: 'edition' },
        { name: '服务器型号', title: 'model' },
        { name: '授权信息' },
        { name: '服务器授权', title: 'enabled' },
        { name: '服务器序列号', title: 'serialNum', subType: 'button', subName: '重新激活' },
        { name: '授权用户', title: 'authorizedUser' },
        { name: '最大存储空间', title: 'storageSpace', fun: function (val) { return changeSize(val); } },
        { name: '最大分析流量', title: 'analyticalTraffic', fun: function (val) { return changeSize(val, 'bps'); } },
        { name: '最大网络接口数', title: 'networkInterface' },
        { name: '最大网络链路数', title: 'networkLink' }
      ]
    };
  },
  mounted () {
    this.zebraLine();
  },
  computed: {
    data: function () {
      /* eslint-disable no-undef */
      return serverInfoData;
    }
  },
  methods: {
    zebraLine: function () {
      if ($('.col').length) {
        $('.col').each((index, ele) => {
          index % 2 === 0
            ? $(ele).css({ 'background': '#fefefe', 'padding': '0' })
            : $(ele).css({ 'background': '#eef1f8', 'padding': '0' });
        });
      }
    },
    doActivation: function () {
      let msg = '是否要重新激活';
      isContinue(this, this.activate, '', msg);
    },
    activate: function () {
    }
  }
};
</script>

<style scoped>
  .title{
    position: relative;
    padding: 5px;
    top: 14px;
    left: 29px;
    font-size: 19px;
    font-weight: 600;
  }
  .info-content{
    padding: 0 33px;
    margin-top: 50px
  }
  .subTitle{
    padding: 5px;
    border: 1px dotted #ccc;
    font-size: 19px;
    font-style: italic;
    font-weight: 600;
    background: #4081c5;
    color: #ffffff;
  }
  .col_title{
    padding: 5px 0 5px 20px;
    border: 1px solid #CCCCCC;
    font-size: 16px;
    border-top: transparent;
    border-right: transparent;
  }
  .col_body{
    padding: 5px 0 5px 20px;
    border: 1px solid #CCCCCC;
    border-top: transparent;
  }
</style>
