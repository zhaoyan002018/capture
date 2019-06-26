<template>

  <div>

    <div class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <div class="input-group input-group-sm pull-right" style="max-width:50%;">
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
            class="form-control"
            v-model="query.filter"
            v-focus-input="focusInput"
            @blur="onOffFocus"
            @input="searchForFiles"
            :placeholder="$t('files.searchTip')"
          />
          <span class="input-group-append">
            <button type="button"
              @click="clear"
              :disabled="!query.filter"
              class="btn btn-outline-secondary btn-clear-input">
              <span class="fa fa-close">
              </span>
            </button>
          </span>
        </div>
        <moloch-paging v-if="files"
          :records-total="recordsTotal"
          :records-filtered="recordsFiltered"
          v-on:changePaging="changePaging"
          length-default=500 >
        </moloch-paging>
      </div>
    </div>

    <div class="files-content container-fluid">

      <moloch-loading v-if="loading && !error">
      </moloch-loading>

      <moloch-error v-if="error"
        :message="error">
      </moloch-error>

      <div v-if="!error"
        class="ml-2 mr-2">
        <moloch-tables
          id="fieldTable"
          :data="files"
          :loadData="loadData"
          :columns="columns"
          :no-results="true"
          :desc="query.desc"
          :sortField="query.sortField"
          table-animation="list"
          table-classes="table-sm"
          table-state-name="fieldsCols"
          table-widths-state-name="filesColWidths">
        </moloch-tables>
      </div>

    </div>

  </div> <!-- /files content -->

</template>

<script>
import MolochPaging from '../utils/Pagination';
import MolochError from '../utils/Error';
import MolochLoading from '../utils/Loading';
import MolochTables from '../utils/file_Tables';
import FocusInput from '../utils/FocusInput';
import { changeSize } from '@/api/validate';

let searchInputTimeout; // timeout to debounce the search input

export default {
  name: 'Files',
  components: {
    MolochPaging,
    MolochError,
    MolochLoading,
    MolochTables
  },
  directives: { FocusInput },
  data: function () {
    return {
      error: '',
      loading: true,
      files: null,
      recordsTotal: undefined,
      recordsFiltered: undefined,
      query: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null,
        sortField: 'num',
        desc: false
      },
      columns: [ // node stats table columns
        { id: 'fileNum', name: this.$t('files.fileNumber'), sort: 'num', dataField: 'num', help: '内部文件编号（节点内部是唯一的）', width: 140, default: true, show: 'num' },
        { id: 'node', name: this.$t('files.node'), sort: 'node', dataField: 'node', help: '所属分布式节点', width: 120, default: true, show: 'node' },
        { id: 'name', name: this.$t('files.name'), sort: 'name', dataField: 'name', help: '文件路径', width: 300, default: true, show: 'name' },
        { id: 'filesize', name: '文件大小', sort: 'filesize', dataField: 'filesize', help: '文件大小', width: 300, default: true, show: 'filesize', dataFunction: function (val) { return changeSize(val); } },
        { id: 'locked', name: this.$t('files.locked'), sort: 'locked', dataField: 'locked', dataFunction: (val) => { return val === 1 ? 'True' : 'False'; }, help: '如果锁定，则dps不会删除此pcap文件', width: 100, default: true, show: 'lock' },
        { id: 'firstDate', name: this.$t('files.firstDate'), sort: 'first', dataField: 'first', dataFunction: (val) => { return this.$options.filters.timezoneDateString(val, this.user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z'); }, help: 'pcap文件中首包时间戳', width: 220, default: true, show: 'time' }
        /* { id: 'fileSize', name: this.$t('files.fileSize'), sort: 'filesize', dataField: 'filesize', classes: 'text-right', help: '文件大小（当文件正在写操作时为空）', width: 100, default: true, dataFunction: (val) => { return this.$options.filters.commaString(val); } } , */
        /* { id: 'fullname', name: this.$t('files.download'), sort: 'fullname', dataField: 'fullname', help: '下载pcap', width: 200, default: true, dataFunction: (val) => { var link = '/download/' + val; return '<a href="www.baidu.com" target="_blank" class="nav-link">下载</a>'; } } */
      ]
    };
  },
  computed: {
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
    }
  },
  methods: {
    // 文件大小由字节转化成其他大小
    /* exposed page functions ------------------------------------ */
    changePaging (pagingValues) {
      this.query.length = pagingValues.length;
      this.query.start = pagingValues.start;
      this.loadData();
    },
    searchForFiles () {
      if (searchInputTimeout) { clearTimeout(searchInputTimeout); }
      // debounce the input so it only issues a request after keyups cease for 400ms
      searchInputTimeout = setTimeout(() => {
        searchInputTimeout = null;
        this.loadData();
      }, 400);
    },
    clear () {
      this.query.filter = undefined;
      this.loadData();
    },
    onOffFocus: function () {
      this.focusInput = false;
    },
    /* helper functions ---------------------------------------------------- */
    loadData: function (sortField, desc) {
      this.loading = true;
      if (desc !== undefined) { this.query.desc = desc; }
      if (sortField) { this.query.sortField = sortField; }
      this.$http.get('file/list', { params: this.query })
        .then((response) => {
          this.error = '';
          this.loading = false;
          this.files = response.data.data;
          this.recordsTotal = response.data.recordsTotal;
          this.recordsFiltered = response.data.recordsFiltered;
          this.changeLocked(this.files);
          this.changeTime(this.files);
        }, (error) => {
          this.loading = false;
          this.error = error.text || error;
        });
    },
    onError: function (message) {
      this.childError = message;
    },
    changeTime: function (arr) {
      for (let i of arr) {
        i.time = this.$options.filters.timezoneDateString(i.first, this.user.settings.timezone, 'YYYY/MM/DD HH:mm:ss z');
      }
    },
    changeLocked: function (arr) {
      for (let i of arr) {
        i.lock = i.locked === 1 ? 'True' : 'False';
      }
    }
  }
};
</script>

<style>
.search_model ul.pagination {
  margin-bottom: 0;
}
</style>

<style scoped>
/* search navbar */

/* page content */
.files-content {
  padding:48px 0 0;
}
</style>
