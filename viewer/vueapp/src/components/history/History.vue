<template>

  <div class="history-page">

    <!-- search navbar -->
    <form class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <span class="fa fa-lg fa-question-circle text-theme-primary help-cursor mt-2 pull-right"
          :title="$t('history.tip')"
          v-b-tooltip.hover>
        </span>
        <button type="button"
          class="btn btn-sm btn-theme-tertiary pull-right ml-1 search-btn"
          @click="loadData">
          <span v-if="!shiftKeyHold">
            Search
          </span>
          <span v-else
            class="enter-icon">
            <span class="fa fa-long-arrow-left fa-lg">
            </span>
            <div class="enter-arm">
            </div>
          </span>
        </button>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text input-group-text-fw">
              <span v-if="!shiftKeyHold"
                class="fa fa-search fa-fw">
              </span>
              <span v-else
                class="query-shortcut">
                Q
              </span>
            </span>
          </div>
          <input type="text"
            @keyup.enter="loadData"
            @input="debounceSearch"
            class="form-control"
            v-model="searchTerm"
            v-focus-input="focusInput"
            @blur="onOffFocus"
            :placeholder="$t('common.searchTip',{name : $t('common.history')})"
          />
          <span class="input-group-append">
            <button type="button"
              @click="clear"
              :disabled="!searchTerm"
              class="btn btn-outline-secondary btn-clear-input">
              <span class="fa fa-close">
              </span>
            </button>
          </span>
        </div>
        <div class="form-inline mt-1">
          <moloch-time :timezone="user.settings.timezone"
            @timeChange="loadData"
            :hide-bounding="true"
            :hide-interval="true">
          </moloch-time>
        </div>
      </div>
    </form> <!-- /search navbar -->

    <!-- paging navbar -->
    <form class="history-paging">
      <div class="form-inline">
        <moloch-paging v-if="history"
          class="mt-1 ml-1"
          :records-total="history.recordsTotal"
          :records-filtered="history.recordsFiltered"
          @changePaging="changePaging"
          length-default=100>
        </moloch-paging>
        <moloch-toast
          class="ml-2 mb-3 mt-1"
          :message="msg"
          :type="msgType"
          :done="messageDone">
        </moloch-toast>
      </div>
    </form> <!-- /paging navbar -->
    <div class="filter-container borders" style="position: relative;top: 122px;left: 4px;cursor: pointer;z-index: 1;float: left">
      <el-button :loading="loading" size="mini" class="outline" type="primary" icon="el-icon-refresh" native-type="reset" @click="loadData()"> 刷新 </el-button>
    </div>
    <div style="height: 40px;position: absolute;top: 125px;right: 0;width: 536px;">
      <span>用户ID :</span>
      <input type="text"
             v-has-permission="columns[2].permission"
             v-model="filters[columns[2].sort]"
             :placeholder="$t('byPhrase',[columns[2].name])"
             @keyup="debounceSearch"
             @click.stop
      />
      <span style="margin-left: 5%;">API :</span>
      <input type="text"
             v-has-permission="columns[4].permission"
             v-model="filters[columns[4].sort]"
             :placeholder="$t('byPhrase',[columns[4].name])"
             style="margin-right: 5px;"
             @keyup="debounceSearch"
             @click.stop/>
    </div>
    <div style="padding: 0 5px">
      <el-table :data="data" border stripe tooltip-effect="dark" style="position: relative;top: 125px;margin-bottom: 26px;"
                @sort-change="sortChange" :row-key="getRowKeys" ref="historyTable">
        <el-table-column type="index">
          <template slot-scope="scope">
            <toggle-btn class="mt-1"
                        :opened="scope.row.expanded"
                        @toggle="handleConnectionSearch(scope.row, scope.row.state)">
            </toggle-btn>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable :visible-arrow="false">
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="columns[0].help" placement="top">
              <span>时间</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope" style="white-space: nowrap;">
            {{ scope.row.timestamp | timezoneDateString(user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z') }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="columns[1].help" placement="top">
              <span>时间范围</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.range">——</span>
            <span v-else>{{ scope.row.range * 1000 | readableTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="columns[2].help" placement="top">
              <span>用户ID</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope" v-has-permission="'createEnabled'">
            {{ scope.row.userId }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="columns[3].help" placement="top">
              <span>响应时间</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.queryTime }}ms
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable>
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="columns[4].help" placement="top">
              <span>Api</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.api }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip sortable>
          <template slot="header" slot-scope="scope" >
            <el-tooltip :content="columns[7].help" placement="top">
              <span>当前IP</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.clientip">——</span>
            <span v-else> {{scope.row.clientip}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip align="center">
          <template slot="header" slot-scope="scope">
            <el-tooltip :content="`仅显示存在${columns[5].name}字段的条目`" placement="top">
              <el-checkbox v-model="columns[5].exists"  @change="loadData"></el-checkbox>
            </el-tooltip>
            <el-tooltip :content="columns[5].help" placement="top">
              <span>操作</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.expression }}
          </template>
        </el-table-column>
        <el-table-column sortable show-overflow-tooltip align="center">
          <template slot="header" slot-scope="scope">
            <el-tooltip  :content="`仅显示存在${columns[6].name}字段的条目`" placement="top">
              <el-checkbox v-model="columns[6].exists"  @change="loadData"></el-checkbox>
            </el-tooltip>
            <el-tooltip :content="columns[6].help" placement="top">
              <span>视图</span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
          <span v-if="scope.row.view">
            <strong>
              {{ scope.row.view.name }}
            </strong>
            {{ scope.row.view.expression }}
          </span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button v-has-permission="'createEnabled,removeEnabled'" @click="Confirm(scope.row)" size="mini">
              <span class="fa fa-trash-o"></span>
            </el-button>
            <el-tooltip :content="$t('history.openPageTip',[scope.row.uiPage])" placement="top">
              <!--直接使用 router-link 需要另外的刷新操作，这个bug需要调整-->
              <a v-if="scope.row.uiPage" :href="`${scope.row.api}?${scope.row.query}`" style="width: 25px;height: 22px;display: inline-block;
              color: #fff;background-color: #17a2b8;border-color: #17a2b8;padding-left: 6px;">
                <span class="fa fa-folder-open"></span>
              </a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column type="expand" :width="1">
          <template slot-scope="scope" v-if="expandedLogs[scope.row.id]">
            <div :colspan="colSpan">
              <!-- /forced expression -->
              <div v-has-permission="'createEnabled'" v-if="scope.row.forcedExpression !== undefined">
                <el-row>
                  <el-col :span="2">Forced Expression</el-col>
                  <el-col :span="10">{{ scope.row.forcedExpression }}</el-col>
                </el-row>
              </div><!-- /forced expression -->
              <!-- count info -->
              <div v-if="scope.row.recordsReturned !== undefined">
                <h5>{{$t('counts')}}</h5>
                <h5>&nbsp;</h5>
                <el-row v-if="scope.row.recordsReturned !== undefined">
                  <el-col :span="2">{{$t('flashbackPhrase',[$t('records'),$t('returned')])}}</el-col>
                  <el-col :span="10">{{ scope.row.recordsReturned }}</el-col>
                </el-row>
                <el-row v-if="scope.row.recordsFiltered !== undefined">
                  <el-col :span="2">{{$t('flashbackPhrase',[$t('records'),$t('filtered')])}}</el-col>
                  <el-col :span="10">{{ scope.row.recordsFiltered }}</el-col>
                </el-row>
                <el-row v-if="scope.row.recordsTotal !== undefined">
                  <el-col :span="2">{{$t('flashbackPhrase',[$t('records'),$t('total_zj')])}}</el-col>
                  <el-col :span="10">{{ scope.row.recordsTotal }}</el-col>
                </el-row>
              </div><!-- /count info -->
              <!-- req body -->
              <div v-if="scope.row.body">
                <h5>{{$t('requestBody')}}</h5>
                <h5>&nbsp;</h5>
                <el-row v-for="(value, key) in scope.row.body" :key="key">
                  <el-col :span="2">{{ key }}</el-col>
                  <el-col :span="10">{{ value }}</el-col>
                </el-row>
              </div><!-- /req body -->
              <!-- query params -->
              <div v-if="scope.row.query">
                <h5>{{$t('queryParameters')}}
                  <sup>
                  <span class="fa fa-info-circle text-theme-primary">
                  </span>
                  </sup>
                </h5>
                <h5>&nbsp;</h5>
                <el-row v-for="(value, key) in scope.row.queryObj"
                        :key="key">
                  <el-col :span="2">{{ key }}</el-col>
                  <el-col :span="10">
                    {{ value }}&nbsp;
                    <span v-if="key === 'view' && scope.row.view && scope.row.view.expression">
                    ({{ scope.row.view.expression }})
                  </span>
                  </el-col>
                </el-row>
                <div>
                  <em>
                    <strong>
                    <span class="fa fa-info-circle text-theme-primary">
                    </span>&nbsp;
                      {{$t('parsedFrom')}}:
                    </strong>
                    <span style="word-break:break-all;">
                      {{ scope.row.api }}?{{ scope.row.query }}
                  </span>
                  </em>
                </div>
              </div><!-- query params -->
              <!-- no info -->
              <div v-if="!scope.row.query && !scope.row.body && scope.row.recordsReturned === undefined"
                   class="mb-w">
                <span class="fa fa-frown-o fa-lg">
                </span>&nbsp;
                <em>{{$t('noInfoShow')}}</em>
              </div> <!-- no info -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <!--loading overlay -->
    <moloch-loading
      v-if="loading && !error">
    </moloch-loading> <!-- /loading overlay -->

    <!-- hack to make vue watch expanded logs -->
    <div style="display:none;">
      {{ expandedLogs }}
    </div>

  </div>

</template>

<script>
import MolochPaging from '../utils/Pagination';
import MolochError from '../utils/Error';
import MolochLoading from '../utils/Loading';
import ToggleBtn from '../utils/ToggleBtn';
import MolochTime from '../search/Time';
import FocusInput from '../utils/FocusInput';
import MolochToast from '../utils/Toast';
import { isContinue } from '@/api/validate';

let searchInputTimeout; // timeout to debounce the search input

export default {
  name: 'History',
  components: {
    MolochPaging,
    MolochError,
    MolochLoading,
    MolochTime,
    ToggleBtn,
    MolochToast
  },
  directives: { FocusInput },
  data: function () {
    return {
      error: '',
      loading: true,
      history: {},
      expandedLogs: { change: false },
      showColFilters: false,
      colSpan: 7,
      filters: {},
      sortField: 'timestamp',
      searchTerm: '',
      desc: true,
      msg: '',
      msgType: undefined,
      columns: [
        { name: this.$t('history.time'), sort: 'timestamp', nowrap: true, width: 10, help: this.$t('history.timeHelper') },
        { name: this.$t('history.timeRange'), sort: 'range', nowrap: true, width: 11, classes: 'text-right', help: this.$t('history.timeRangeHelper') },
        { name: this.$t('history.userId'), sort: 'userId', nowrap: true, width: 8, filter: true, permission: 'createEnabled', help: this.$t('history.userIdHelper') },
        { name: this.$t('history.queryTime'), sort: 'queryTime', nowrap: true, width: 8, classes: 'text-right', help: this.$t('history.queryTimeHelper') },
        { name: this.$t('history.api'), sort: 'api', nowrap: true, width: 13, filter: true, help: this.$t('history.apiHelper') },
        { name: '操作', sort: 'expression', nowrap: true, width: 27, exists: false, help: this.$t('history.expressionHelper') },
        { name: this.$t('history.viewName'), sort: 'view.name', nowrap: true, width: 23, exists: false, help: this.$t('history.viewNameHelper') },
        { name: '当前IP', sort: 'clientip', nowrap: true, width: 23, help: '当前IP' }
      ],
      data: null,
      toggleRowOpen: [],
      dialogFormVisible: false,
      temp: {
        userId: null,
        api: null
      }
    };
  },
  computed: {
    query: function () {
      return { // query defaults
        length: parseInt(this.$route.query.length) || 50,
        start: 0,
        date: this.$store.state.timeRange,
        startTime: this.$store.state.time.startTime,
        stopTime: this.$store.state.time.stopTime
      };
    },
    user: function () {
      return this.$store.state.user;
    },
    focusInput: {
      get: function () {
        return this.$store.state.focusSearch;
      },
      set: function (newValue) {
        this.$store.commit('setFocusSearch', newValue);
      }
    },
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    issueSearch: function () {
      return this.$store.state.issueSearch;
    }
  },
  watch: {
    issueSearch: function (newVal, oldVal) {
      if (newVal) { this.loadData(); }
    }
  },
  created: function () {
    // if the user is an admin, show them all the columns
    if (this.user.createEnabled) { this.colSpan = 8; }
    // query for the user requested or the current user
    this.filters.userId = this.$route.query.userId || this.user.userId;

    setTimeout(() => {
      // wait query to be computed
      this.loadData();
    });
  },
  methods: {
    Confirm (row) {
      let that = this;
      isContinue(that, this.deleteLog, row, '此操作将永久删除此记录，是否继续');
    },
    /* exposed page functions ------------------------------------ */
    debounceSearch: function () {
      if (searchInputTimeout) { clearTimeout(searchInputTimeout); }
      // debounce the input so it only issues a request after keyups cease for 400ms
      searchInputTimeout = setTimeout(() => {
        searchInputTimeout = null;
        this.loadData();
      }, 400);
    },
    clear () {
      this.searchTerm = undefined;
      this.loadData();
    },
    onOffFocus: function () {
      this.focusInput = false;
    },
    sortChange: function (column, prop, order) {
      if (order === 'descending') {
        this.query.desc = true;
      }
      this.columnClick(column.prop);
    },
    columnClick: function (name) {
      this.sortField = name;
      this.desc = !this.desc;
      this.loadData();
    },
    toggleLogDetail: function (log) {
      log.expanded = !log.expanded;

      this.expandedLogs.change = !this.expandedLogs.change;
      this.expandedLogs[log.id] = !this.expandedLogs[log.id];

      if (log.query && log.expanded && !log.queryObj) {
        log.queryObj = {};

        let a = (log.query[0] === '?' ? log.query.substr(1) : log.query).split('&');
        for (let i = 0, len = a.length; i < len; i++) {
          let b = a[i].split('=');
          let value = b[1] || '';
          if (b[0] === 'expression') { value = value.replace(/\+/g, ' '); }
          log.queryObj[decodeURIComponent(b[0])] = decodeURIComponent(value);
        }
      }
    },
    deleteLog: function (log, index) {
      this.$http.delete(`history/list/${log.id}`, { params: { index: log.index } })
        .then((response) => {
          this.msg = response.data.text || 'Successfully deleted history item';
          this.msgType = 'success';
          this.history.data.splice(index, 1);
        })
        .catch((error) => {
          this.msg = error.text || 'Error deleting history item';
          this.msgType = 'danger';
        });
    },
    /* remove the message when user is done with it or duration ends */
    messageDone: function () {
      this.msg = '';
      this.msgType = undefined;
    },
    /* helper functions ------------------------------------------ */
    loadData: function () {
      this.loading = true;

      let exists = [];
      for (let i = 0, len = this.columns.length; i < len; ++i) {
        let col = this.columns[i];
        if (col.exists) { exists.push(col.sort); }
      }
      if (exists.length) {
        this.query.exists = exists.join();
      } else {
        this.query.exists = undefined;
      }

      if (this.filters && Object.keys(this.filters).length) {
        for (let key in this.filters) {
          if (this.filters.hasOwnProperty(key)) {
            this.query[key] = this.filters[key];
          }
        }
      }

      this.query.desc = this.desc;
      this.query.sortField = this.sortField;
      this.query.searchTerm = this.searchTerm;

      this.$http.get('history/list', { params: this.query })
        .then((response) => {
          this.error = '';
          this.loading = false;
          this.history = response.data;
          this.data = this.history.data;
        }, (error) => {
          this.loading = false;
          this.error = error;
        });
    },
    /* event functions ------------------------------------------- */
    changePaging: function (pagingValues) {
      this.query.length = pagingValues.length;
      this.query.start = pagingValues.start;

      this.loadData();
    },
    handleConnectionSearch (row, state) {
      this.toggleLogDetail(row);
      if (state === undefined) {
        row.state = true;
      } else {
        row.state = !row.state;
      }
      this.$refs.historyTable.toggleRowExpansion(row, row.state); // 点击button展开
    },
    getRowKeys (row) {
      return row.id;
    }
  }
};
</script>

<style scoped>
/* navbar styles ------------------- */

.history-page form .time-range-control {
  -webkit-appearance: none;
}
/* navbar with pagination */
.history-page form.history-paging {
  z-index: 4;
  position: fixed;
  top: 110px;
  width:100%;
  height: 40px;
  background-color: var(--color-quaternary-lightest);

  -webkit-box-shadow: 0 0 16px -2px black;
     -moz-box-shadow: 0 0 16px -2px black;
          box-shadow: 0 0 16px -2px black;
}

.input-group {
  flex-wrap: none;
  width: auto;
}

/* table styles -------------------- */
.history-page table {
  margin-top: 160px;
  table-layout: fixed;
}
.history-page table tbody tr td.no-wrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* super tiny input boxes for column filters */
.history-page table thead tr th input.input-filter {
  height: 24px;
  padding: 2px 5px;
  font-size: 12px;
  margin-bottom: 2px;
  margin-top: 2px;
}
.history-page table thead tr th div.header-div {
  display: inline-block;
}
.history-page table thead tr th div.header-div input.checkbox {
  margin-bottom: -2px;
}
/* shrink the toggle button */
.history-page table tbody tr td a.btn-toggle {
  padding: 1px 5px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
  margin-top: -2px !important;
}
</style>
