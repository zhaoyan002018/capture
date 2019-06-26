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
      </div>
    </div>
    <dps-table
      v-if="!listLoading"
      :title="title"
      :data="dataList"
      :btn="btn"
      :columns="columns"
      :getList="getList"
      :handleCreate="handleCreate"
      :handleUpdate="handleUpdate"
      :dialogTitle="dialogTitle"
      :dialogText="dialogText"
      :temp="temp"
      :Dialog="true"
      :treeData="treeData"
      :dialogTitleTree="dialogTitleTree"
      :Dialog_tree="true"
    ></dps-table>
    <!-- loading overlay -->
    <moloch-loading
      v-if="listLoading && !error">
    </moloch-loading> <!-- /loading overlay -->
  </div>
</template>

<script>
import { fetcharticle, createArticle, updatearticle } from '@/api/article';
import MolochPaging from '../utils/Pagination';
import FocusInput from '../utils/FocusInput';
import DpsTable from '@/components/dpsTable/index';
import { notify } from '@/api/validate';
import MolochLoading from '../utils/Loading';
let searchInputTimeout; // timeout to debounce the search input

export default {
  components: {
    MolochPaging,
    MolochLoading,
    DpsTable
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
      title: '事件级别配置',
      btn: {
        isRefresh: true,
        isHandleCreate: true
      },
      columns: [
        { name: '序号', title: 'id', width: 94, sortable: false },
        { name: '开始时间', title: 'startTime', label: 'time' },
        { name: '结束时间', title: 'endTime', label: 'time' },
        { name: '用户', title: 'user' },
        { name: '源IP', title: 'srcIp' },
        { name: '目的IP', title: 'dstIp' },
        { name: '事件', title: 'strategy' },
        /* eslint-disable no-undef */
        { name: '事件级别',
          title: 'level',
          label: 'level',
          type: 'boolean',
          customize: false,
          Customize: this.threatLevelCunsomize,
          subName: ['低危', '中危', '高危'],
          color: ['rgb(250,226,142)', 'rgb(250,195,0)', 'rgb(199,36,44)'],
          judge: [1, 2, 3],
          subType: 'number'}
      ],
      dialogTitle: '编辑事件等级',
      dialogText: [{name: '源IP', title: 'srcIp', type: 'input'},
        {name: '目的IP', title: 'dstIp', type: 'input'},
        {name: '策略', title: 'strategy', type: 'input+btn', showAllLevels: false, subTitle: 'checkEvent'}, // cascader级联选择器,这个不是用的
        {name: '事件等级', title: 'level', type: 'radio-button', btnName: ['低危', '中危', '高危']},
        {name: '', title: 'enabled', subTitle: '记录日志', type: 'checkbox'}],
      temp: {
        enabled: true
      },
      treeData: [{
        id: 0,
        label: '全部',
        children: [{
          id: 1,
          label: 'HTTP审计',
          children: [{
            id: 1.1,
            label: '弱密码'
          }, {
            id: 1.2,
            label: '网页浏览'
          }, {
            id: 1.3,
            label: '文件下载'
          }, {
            id: 1.4,
            label: 'HTTP敏感信息'
          }]
        }, {
          id: 2,
          label: '邮件审计',
          children: [{
            id: 2.1,
            label: '邮件中有敏感字'
          }, {
            id: 2.2,
            label: '附件中有敏感字'
          }, {
            id: 2.3,
            label: '发送邮件'
          }, {
            id: 2.4,
            label: '接收邮件'
          }, {
            id: 2.5,
            label: '删除邮件'
          }]
        }]}
      ],
      dialogTitleTree: '选择规则'
    };
  },
  created () {
    this.getList();
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
    handleCreate (data) {
      data.checkEvent = data.treeData;
      createArticle(data, 'editEventLevel').then(res => {
        let type = null;
        if (res.data.success) {
          type = 'success';
          this.getList();
        } else {
          type = 'error';
        }
        notify(this, res.data.message, type);
      });
    },
    handleUpdate (data) {
      data.checkEvent = data.treeData;
      updatearticle(data, 'editEventLevel').then(res => {
        let type = null;
        if (res.data.success) {
          type = 'success';
          this.getList();
        } else {
          type = 'error';
        }
        notify(this, res.data.message, type);
      });
    },
    threatLevelCunsomize (row, column) {
      let result = null;
      let color = ['rgb(250,226,142)', 'rgb(250,195,0)', 'rgb(199,36,44)'];
      column.judge.forEach(function (item, index) {
        if (item === row[column.title]) {
          result = `<el-tag class="tag_threatLevel"
                    style="background-color:` + color[index] + `">` + column.subName[index] + `</el-tag>`;
        }
      });
      return result;
    },
    getList () {
      this.listLoading = true;
      return fetcharticle(this.query, 'editEventLevel').then(response => {
        this.dataList = response.data.items; // 后端传过来的数据,是一个数组
        this.recordsTotal = response.data.total; // 数组长度
        this.recordsFiltered = response.data.total;
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
    }
  }
};
</script>

<style scoped>
</style>
