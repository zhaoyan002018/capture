<template>
  <div>
    <div class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <div class="input-group input-group-sm pull-right" style="max-width:50%;">
          <div class="input-group-prepend">
            <span class="input-group-text input-group-text-fw">
              <span v-if="!shiftKeyHold"
                    @click="searchForFiles"
                    class="fa fa-search fa-fw">
              </span>
              <span v-else
                    class="query-shortcut">
                Q
              </span>
            </span>
          </div>
          <input type="text"
                 class="form-control"
                 v-model="query.filter"
                 @input="searchForFiles"
                 v-focus-input="focusInput"
                 @blur="onOffFocus"
                 placeholder="请输入IP地址多个IP用分号隔开"
          />
          <span class="input-group-append">
            <button type="button"
                    @click="clear"
                    :disabled="!query.filter"
                    class="btn btn-outline-secondary btn-clear-input outline">
              <span class="fa fa-close">
              </span>
            </button>
          </span>
        </div>
        <moloch-paging v-if="showdata"
                       :records-total="recordsTotal"
                       :records-filtered="recordsFiltered"
                       v-on:changePaging="changePaging"
                       length-default=500 >
        </moloch-paging>
        <!--<div style="position: absolute;">-->
          <!--<el-date-picker-->
            <!--v-model="timeRange"-->
            <!--type="datetimerange"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期">-->
          <!--</el-date-picker>-->
        <!--</div>-->
      </div>
    </div>
    <div class="app-container">
      <div class="interfaceSet"> 攻击日志 </div>
      <div class="filter-container borders" style="float:left">
        <el-button :loading="listLoading" size="mini" class="green outline" type="primary" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
      </div>
      <template >
          <el-table
            :data="showdata"
            border
            stripe
            class="links-table"
            style="width: 100%">
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
            <el-table-column label="事件描述" align="center"  show-overflow-tooltip prop="event_des" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"></el-table-column>
            <el-table-column label="威胁级别" align="center" prop="threatLevel">
              <template slot-scope="scope">
                <el-tag class="tag_threatLevel" @click="changeThreatLevel(scope.row)" style="background-color: RGB(250,226,142)" v-if="scope.row.threatLevel === 1"> 轻危 </el-tag>
                <el-tag class="tag_threatLevel" @click="changeThreatLevel(scope.row)" style="background-color: #FF9933" v-else-if="scope.row.threatLevel === 2"> 中危 </el-tag>
                <el-tag class="tag_threatLevel" @click="changeThreatLevel(scope.row)" style="background-color: RGB(199,36,44)" v-else-if="scope.row.threatLevel === 3"> 高危 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标签">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.tag" type="info" class="tag_color" :key="item">{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="通信协议" show-overflow-tooltip prop="commProtocol"  align="center"></el-table-column>
            <el-table-column label="处理结果" prop="state" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state == 1" class="el-icon-error outline" style="color: #f00;cursor: pointer;" @click="Confirm(scope.row)">未处理</span>
                <span v-else class="el-icon-success" style="color: #009D1D">已处理</span>
              </template>
            </el-table-column>
          </el-table>
      </template>
      <moloch-loading v-if="listLoading && !error"></moloch-loading>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle" width="400px">
      <div class="form">
        <el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
          <el-form-item v-for="item in dialogText" :key="item.name" :label="item.name">
            <span v-if="item.type === 'txt'">{{temp[item.title] || item.default}}</span>
            <el-radio-group v-if="item.type === 'radio-button'" v-model="temp[item.title]">
              <el-radio-button v-for="(btn, index) in item.btnName" :key="btn" :label="(index + 1) || btn">{{btn}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="close()" >取消</el-button>
        <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="handleChange()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetcharticle, DisposeEvents, updateThreatLevel } from '@/api/article';
import MolochPaging from '../utils/Pagination';
import FocusInput from '../utils/FocusInput';
import { isContinue, notify } from '@/api/validate';
import MolochLoading from '../utils/Loading';

let searchInputTimeout; // timeout to debounce the search input

export default {
  components: {
    MolochPaging,
    MolochLoading
  },
  directives: { FocusInput },
  data () {
    return {
      timeRange: '',
      listLoading: false,
      error: '',
      dataList: [],
      victimized_ip_top5: [],
      thread_intelligence_hits: [],
      recordsTotal: undefined,
      recordsFiltered: undefined,
      showdata: [],
      query: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null
      },
      dialogTitle: '编辑事件等级',
      dialogText: [
        {name: '事件描述', title: 'event_des', type: 'txt'},
        {name: '事件等级', title: 'threatLevel', type: 'radio-button', btnName: ['低危', '中危', '高危']},
        {name: '作用范围', title: 'range', type: 'radio-button', btnName: ['全局', '本事件']}],
      temp: {
        range: 2 // 1-全局 2-本事件
      },
      dialogFormVisible: false
    };
  },
  created () {
    // this.getList();
  },
  computed: {
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    focusInput: {
      get: function () {
        return this.$store.state.focusSearch;
      },
      set: function (newValue) {
        this.$store.commit('setFocusSearch', newValue);
      }
    }
  },
  methods: {
    handleChange: function () {
      this.dialogFormVisible = false;
      let data = {};
      data.id = this.temp.id;
      data.threatLevel = this.temp.threatLevel;
      updateThreatLevel(data).then(res => {
        if (res.data.success) {
          this.getList();
          notify(this, '更改成功', 'success');
        } else {
          notify(this, res.data.message, 'error');
        }
      });
      this.temp = {
        range: 2
      };
    },
    close: function () {
      this.dialogFormVisible = false;
      this.temp = {
        range: 2
      };
    },
    changeThreatLevel (row) {
      if (!row.range) {
        row.range = this.temp.range;
      }
      this.temp = Object.assign({}, row);
      // console.log('temp', this.temp);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    getList () {
      this.listLoading = true;
      return fetcharticle(this.query, 'dashboard').then(response => {
        this.dataList = response.data.items; // 后端传过来的数据,是一个数组
        this.recordsTotal = response.data.total; // 数组长度
        this.recordsFiltered = response.data.recordsFiltered; // 记录过滤
        this.showdata = JSON.parse(JSON.stringify(this.dataList)); // 表格中显示的数据
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 2000);
      }).catch((error) => {
        this.$notify({
          message: error.text,
          type: 'error',
          duration: 2000
        });
      });
    },
    // 分页按钮所执行的事件函数
    changePaging (pagingValues) {
      this.query.length = pagingValues.length;
      this.query.start = pagingValues.start;
      this.getList();
    },
    // 搜索框 对应的失焦事件
    onOffFocus: function () {
      this.focusInput = false;
    },
    // 搜索框中输入内容是对应的事件,如果有延时，先清除再设置
    searchForFiles () {
      if (searchInputTimeout) { clearTimeout(searchInputTimeout); }
      // debounce the input so it only issues a request after keyups cease for 400ms
      searchInputTimeout = setTimeout(() => {
        searchInputTimeout = null;
        this.getList();
      }, 900);
    },
    // 搜索框 清空input内容对应的事件
    clear () {
      this.query.filter = undefined;
      this.getList();
    },
    // 点击未处理时执行，处理事件，在后端进行处理，目前效果：当点击时改变状态。通过state的值来判断是否已经处理
    DisposeEvent (data) {
      const ObjId = [];
      ObjId.push(data.id);
      DisposeEvents(ObjId).then((response) => {
        for (let i in ObjId) {
          for (let j in this.dataList) {
            if (ObjId[i] === this.dataList[j].id) {
              this.dataList.splice(j, 1, response.data.items);
            }
          }
        }
        this.showdata = JSON.parse(JSON.stringify(this.dataList));
        this.$notify({
          message: response.data.text,
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        this.$notify({
          message: error.text,
          type: 'error',
          duration: 2000
        });
      });
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.DisposeEvent, row, '是否继续处理该攻击事件');
    }
  }
};
</script>

<style scoped>
  .links-table{
    position: relative;
    top: 49px;
  }
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
  white-space: pre-line;
}
.demo-table-expand .row {
  width: 100%;
}
</style>
