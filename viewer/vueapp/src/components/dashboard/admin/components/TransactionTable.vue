<template>
<div>
  <div>
    <div>
      <span style="float:left;margin-left:5px;line-height: 48px;">攻击事件</span>
      <span style="float:right;line-height: 48px;margin-left: 5px;" v-if="showdata.length">
        <a href="/eventconfigure/attackEvents">更多&gt;</a>
      </span>
    </div>
    <el-table
      :data="showdata"
      border
      style="width: 100%;">
      <el-table-column type="expand" width="52">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="攻击归属地" prop="att_addr">
              <template solt-scope="scope">
                <span>{{props.row.att_addr}}</span>
              </template>
            </el-form-item>
            <el-form-item label="攻击次数" prop="att_times">
              <template solt-scope="scope">
                <span>{{props.row.att_times}}</span>
              </template>
            </el-form-item>
            <el-form-item label="攻击IP标签">
              <template solt-scope="scope">
                <el-tag type="info" class="tag_color">{{ props.row.attIpLabel}}</el-tag>
              </template>
            </el-form-item>
            <el-form-item label="受害IP标签">
              <template solt-scope="scope">
                <el-tag type="info" class="tag_color">{{ props.row.victIpLabel}}</el-tag>
              </template>
            </el-form-item>
            <el-form-item label="原理" style="width: 100%;">
              <template slot-scope="scope">
                <span> {{props.row.principle}}</span>
              </template>
            </el-form-item>
            <el-form-item label="危害" style="width: 100%;">
              <template slot-scope="scope">
                <span>{{props.row.damage}}</span>
              </template>
            </el-form-item>
            <el-form-item label="处理建议" style="width: 100%;">
              <template slot-scope="scope">
                <p>{{props.row.suggest}}</p>
              </template>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" width="106" align="center"></el-table-column>
      <el-table-column label="发现时间" show-overflow-tooltip prop="findTime" align="center">
        <template slot-scope="scope">
          <span>{{new Date(parseInt(scope.row.findTime) *1000).toLocaleString().replace(/[\u4e00-\u9fa5]+/g, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="攻击IP" show-overflow-tooltip prop="attackIp"  align="center"></el-table-column>
      <el-table-column label="受害IP" show-overflow-tooltip prop="victIp"  align="center"></el-table-column>
      <el-table-column label="事件描述" show-overflow-tooltip prop="event_des" align="center" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></el-table-column>
      <el-table-column label="威胁级别" align="center" prop="threatLevel">
        <template slot-scope="scope">
          <el-tag class="tag_threatLevel" style="background-color: RGB(250,226,142);cursor: context-menu;" v-if="scope.row.threatLevel === 1" > 轻危 </el-tag>
          <el-tag class="tag_threatLevel" style="background-color: #FF9933;cursor: context-menu;" v-else-if="scope.row.threatLevel === 2" > 中危 </el-tag>
          <el-tag class="tag_threatLevel" style="background-color: RGB(199,36,44);cursor: context-menu;" v-else-if="scope.row.threatLevel === 3" > 高危 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center">
        <template slot-scope="scope">
          <!--<span></span>-->
          <el-tag v-for="item in scope.row.tag" type="info" class="tag_color" :key="item">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通信协议" show-overflow-tooltip prop="commProtocol"  align="center"></el-table-column>
      <el-table-column label="处理结果"  prop="state" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1" class="el-icon-error outline" style="color: #f00;cursor: pointer;" @click="Confirm(scope.row)">未处理</span>
          <span v-else class="el-icon-success" style="color: #009D1D">已处理</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-if="victimized_ip_top5.length" style="display:inline-block;width:45%;height:336px;position:relative;left: 0;top: 3%;">
    <div class="victimhostTop5" id="victimhosttop5" style="width:100%; height:100%;"></div>
  </div>
  <div v-if="victimized_ip_top5.length" style="display:inline-block;width:45%;position:relative;left: 10%;height: 336px;top: 2%;">
    <div class="threatHit" id="threatHit" style="width:100%; height:100%;"></div>
  </div>
</div>
</template>

<script>
import { fetcharticle, DisposeEvents } from '@/api/article';
import echarts from 'echarts';
import { isContinue, notify } from '@/api/validate';

export default {
  data () {
    return {
      dataList: [],
      victimized_ip_top5: [],
      thread_intelligence_hits: [],
      showdata: [],
      listQuery: {
        dashboard: true
      },
      chart: null
    };
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      return fetcharticle(this.listQuery, 'dashboard').then(response => {
        // this.dataList = response.data.items;
        // this.showdata = this.sort(this.dataList, 'id');
        // this.victimized_ip_top5 = this.sort(this.dataList, 'threatTimes');
        // this.initChart('victimhosttop5', this.victimized_ip_top5, 'bar', '受害主机 Top5');
        // this.initChart('threatHit', this.victimized_ip_top5, 'bar', '威胁情报命中 Top5');
      });
    },
    sort (list, title) {
      let objlist = JSON.parse(JSON.stringify(list));
      let result = [];
      for (let i = 0; i < objlist.length; i++) {
        for (let j = i + 1; j < objlist.length; j++) {
          if (objlist[i][title] < objlist[j][title]) {
            objlist[j] = [objlist[i], objlist[i] = objlist[j]][0];
          }
        }
      }
      for (let i = 0; i < 5; i++) {
        result[i] = objlist[i];
        result[i]['id'] = i + 1;
      }
      return result;
    },
    // 绘制图表 标签id；图表数据，图标类型，图标标题 <受害主机 TOP5>
    initChart (objId, objData, objType, objTitle) {
      this.chart = echarts.init(document.getElementById(objId)); // echarts.init()
      // y轴数据
      const yData = (function () {
        const data = [];
        for (let i = 0; i < 5; i++) {
          data.unshift(objData[i].victIp);
        }
        return data;
      }());
      // x轴数据
      const xValue = (function () {
        const value = [];
        for (let i = 0; i < 5; i++) {
          value.unshift(objData[i].threatTimes);
        }
        return value;
      }());
      // setOption
      this.chart.setOption({
        background: '#344b58',
        title: {
          text: objTitle,
          left: 'center',
          textStyle: {
            color: '#000',
            fontSize: '20'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          show: false,
          left: '1%',
          right: '5%',
          top: '10%',
          containLabel: true
        },
        xAxis: [{
          show: false,
          type: 'value'
        }],
        yAxis: [{
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: yData
        }],
        series: [{
          name: 'victimTimes',
          type: objType,
          barMaxWidth: 20,
          data: xValue
        }]
      });
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.DisposeEvent, row, '是否继续处理该攻击事件');
    },
    DisposeEvent (data) {
      const ObjId = [];
      ObjId.push(data.id);
      DisposeEvents(ObjId).then((response) => {
        if (response.data.success) {
          this.getList();
          notify(this, response.data.message, 'success');
        } else {
          notify(this, response.data.message, 'error');
        }
      }).catch((error) => {
        this.$notify({
          message: error.text,
          type: 'error',
          duration: 2000
        });
      });
    }
  }
};
</script>
<style lang="scss">
@import './TodoList/index.scss';
</style>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.tag_color{
  color:#2BA2F0;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
#victimhosttop5,#threatHit{
  width: 100%;
  height: 100%;
  position: relative;
  top: 10px;
  background: #fefefe;
}
</style>
