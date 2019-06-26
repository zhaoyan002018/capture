<template>

  <div class="sessions-page">

    <!-- search navbar -->
    <moloch-search
      :fields="headers"
      :open-sessions="stickySessions"
      :num-visible-sessions="query.length"
      :num-matching-sessions="sessions.recordsFiltered"
      :start="query.start"
      :timezone="user.settings.timezone"
      @changeSearch="loadData">
    </moloch-search> <!-- /search navbar -->

     <!--paging navbar-->
    <form class="sessions-paging">
      <div class="form-inline">
        <moloch-paging
          class="mt-1 ml-1"
          :records-total="sessions.recordsFiltered"
          :records-filtered="sessions.recordsFiltered"
          @changePaging="changePaging">
        </moloch-paging>
      </div>
    </form> <!-- /paging navbar -->

    <div class="sessions-content">

      <!-- session visualizations -->
      <moloch-visualizations
        v-if="graphData"
        :graph-data="graphData"
        :map-data="mapData"
        :primary="true"
        :timezone="user.settings.timezone">
      </moloch-visualizations> <!-- /session visualizations -->

      <el-radio-group v-model="radio" size="small">
        <el-radio-button label="1">按IP</el-radio-button>
        <el-radio-button label="2">按端口</el-radio-button>
        <el-radio-button label="3">按协议</el-radio-button>
      </el-radio-group>
      <el-table :data="totalData"
                stripe
                v-if="!loading"
                @sort-change="sortChange"
                border>
        <el-table-column v-for="item in column" :key="item.name"
                         sortable
                         :prop="item.name"
                         :label="item.name" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.type === 'byte'">{{changeData(scope.row[item.title])}}</span>
            <span v-else-if="item.type === 'proto'">{{changeProto(scope.row[item.title])}}</span>
            <span v-else>{{scope.row[item.title]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- loading overlay -->
      <moloch-loading
        v-if="loading && !error">
      </moloch-loading> <!-- /loading overlay -->

      <!-- page error -->
      <moloch-error
        v-if="error"
        :message="error"
        class="mt-5 mb-5">
      </moloch-error> <!-- /page error -->

      <!-- no results -->
      <moloch-no-results
        v-if="!error && !loading && !sessions.data.length"
        class="mt-5 mb-5"
        :records-total="sessions.recordsFiltered"
        :view="query.view">
      </moloch-no-results> <!-- /no results -->

    </div>

  </div>

</template>

<script>
import MolochSearch from '../search/Search';
import SessionsService from '@/components/sessions/SessionsService';
import customCols from '@/components/sessions/customCols.json';
import MolochPaging from '../utils/Pagination';
import MolochError from '../utils/Error';
import MolochLoading from '../utils/Loading';
import MolochNoResults from '../utils/NoResults';
import MolochVisualizations from '../visualizations/Visualizations';
import MolochStickySessions from '@/components/sessions/StickySessions';
import { changeSize } from '../../api/validate';

import '../../../../public/colResizable.js';

let timeout;

let draggableColumns;

// let resizeTimeout;
let windowResizeEvent;

export default {
  name: 'DataStatistics',
  components: {
    MolochSearch,
    MolochPaging,
    MolochError,
    MolochLoading,
    MolochNoResults,
    MolochVisualizations,
    MolochStickySessions
  },
  data: function () {
    return {
      loading: true,
      error: '',
      sessions: {}, // page data
      stickySessions: [],
      colWidths: {},
      colConfigs: [],
      colConfigError: '',
      colConfigSuccess: '',
      headers: [],
      graphData: undefined,
      mapData: undefined,
      colQuery: '', // query for columns to toggle visibility
      newColConfigName: '', // name of new custom column config
      viewChanged: false,
      infoFields: customCols.info.children,
      colVisMenuOpen: false,
      infoFieldVisMenuOpen: false,
      columns: [{ name: '源IP', title: 'srcIp' }, { name: '目的IP', title: 'dstIp' }, { name: '源端口', title: 'srcPort' }, { name: '目的端口', title: 'dstPort' },
        { name: '总会话数', title: 'count' }, { name: '总上行数据包数', title: 'srcPackets' }, { name: '总下行数据包数', title: 'dstPackets' },
        { name: '总上行流量', title: 'srcBytes', type: 'byte' }, { name: '总下行流量', title: 'dstBytes', type: 'byte' }],
      totalData: [],
      radio: 2,
      column: null,
      data: []
    };
  },
  created: function () {
    this.loadData();
    this.column = Array.from(this.columns);
    // watch for window resizing and update the info column width
    // this is only registered when the user has not set widths for any
    // columns && the info column is visible
    // windowResizeEvent = () => {
    //   if (resizeTimeout) { clearTimeout(resizeTimeout); }
    //   resizeTimeout = setTimeout(() => {
    //     this.mapHeadersToFields();
    //   }, 300);
    // };
    //
    // window.addEventListener('resize', windowResizeEvent, { passive: true });
  },
  computed: {
    query: function () {
      return { // query defaults
        length: parseInt(this.$route.query.length || 50), // page length
        start: 0, // first item index
        facets: 1,
        sort: { firstPacket: 'desc' },
        date: this.$store.state.timeRange,
        startTime: this.$store.state.time.startTime,
        stopTime: this.$store.state.time.stopTime,
        bounding: this.$route.query.bounding || 'last',
        interval: this.$route.query.interval || 'auto',
        view: this.$route.query.view || undefined,
        expression: this.$store.state.expression || undefined
      };
    },
    user: function () {
      return this.$store.state.user;
    },
    filteredFields: function () {
      let filteredGroupedFields = {};

      for (let group in this.groupedFields) {
        filteredGroupedFields[group] = this.$options.filters.searchFields(
          this.colQuery,
          this.groupedFields[group]
        );
      }

      return filteredGroupedFields;
    },
    views: function () {
      return this.$store.state.views;
    }
  },
  watch: {
    'query.view': function (newView, oldView) {
      this.viewChanged = true;
    },
    radio: function (newVal) {
      this.loading = true;
      switch (newVal) {
        case '1':
          this.column = Array.from(this.columns);
          this.column.splice(2, 2);
          this.query.dataTerm = 'ip';
          this.loadData();
          break;
        case '2':
          this.query.dataTerm = '';
          this.loadData();
          this.column = Array.from(this.columns);
          break;
        case '3':
          this.query.dataTerm = 'proto';
          this.loadData();
          this.column = Array.from(this.columns);
          this.column.splice(2, 2, { name: '协议', title: 'ipProtocol', type: 'proto' });
          break;
      }
      this.loading = false;
    }
  },
  methods: {
    changeProto (value) {
      return this.$options.filters.protocol(value);
    },
    compare (pro) {
      return function (obj1, obj2) {
        let val1 = obj1[pro];
        let val2 = obj2[pro];
        if (val1 < val2) { // 正序
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    changeData (value) {
      let data = value ? changeSize(value) : 0;
      return data;
    },
    sortChange (data) {
      let that = this;
      let { prop } = data;
      if (prop) {
        let obj = this.column.find(function (obj) {
          return obj.name === prop;
        });
        this.totalData.sort(that.compare(obj.title));
        // let sortData = JSON.parse(JSON.stringify(this.data));
        // sortData.sort(that.compare(obj.title));
        // this.changeData({start: 0, length: this.query.length});
      }
    },
    getData: function (data, label) {
      let total = [];
      let TotalData = JSON.parse(JSON.stringify(data));
      TotalData.forEach((item) => {
        if (total.length) {
          let state = true;
          try {
            total.forEach((tot) => {
              if (tot.srcIp === item.srcIp && tot.dstIp === item.dstIp) {
                tot.srcBytes += item.srcBytes;
                tot.dstBytes += item.dstBytes;
                tot.srcPackets += item.srcPackets;
                tot.dstPackets += item.dstPackets;
                if (label === 2) {
                  if (tot.srcPort === item.srcPort && tot.dstPort === item.dstPort) {
                    state = false;
                    tot.session += 1;
                    throw new Error('sotpForEach');
                  } else {
                    state = true;
                    return false;
                  }
                } else if (label === 3) {
                  if (tot.ipProtocol === item.ipProtocol) {
                    state = false;
                    tot.session += 1;
                    throw new Error('sotpForEach');
                  } else {
                    state = true;
                    return false;
                  }
                }
                state = false;
                tot.session += 1;
                throw new Error('sotpForEach');
              } else {
                state = true;
                return false;
              }
            });
          } catch (e) {
            if (e.message !== 'sotpForEach') throw e;
          }
          if (state) {
            item.session = 1;
            total.push(item);
          }
        } else {
          item.session = 1;
          total.push(item);
        }
      });
      this.totalData.length = 0;
      this.totalData = [...total];
    },
    /**
     * Makes a request to the Session Service to get the list of sessions
     * that match the query parameters
     * @param {bool} updateTable Whether the table needs updating
     */
    loadData: function (updateTable) {
      this.loading = true;
      this.error = '';

      this.query.fields = ['ipProtocol', 'firstPacket', 'lastPacket', 'srcIp', 'srcGEO', 'srcPort', 'dstIp', 'dstGEO', 'dstPort', 'totPackets',
        'totDataBytes', 'totBytes', 'http.uri', 'email.src', 'email.dst', 'email.subject', 'email.filename', 'dns.host',
        'cert.alt', 'irc.channel', 'srcBytes', 'dstBytes', 'srcPackets', 'dstPackets']; // minimum required field
      // console.log('this.query', this.query);
      SessionsService.get(this.query, '/dataStatistics')
      // this.axios.get('/dataStatistics', this,query)
        .then((response) => {
          this.stickySessions = []; // clear sticky sessions
          this.error = '';
          this.sessions = response.data;
          this.data = response.data.data;
          this.changePaging({start: 0, length: this.query.length});
          // this.totalData = JSON.parse(JSON.stringify(this.data));
          this.mapData = response.data.map;
          this.graphData = response.data.graph;
          // this.getData(this.data);
          this.loading = false;
        })
        .catch((error) => {
          this.sessions.data = undefined;
          this.error = error.text || error;
          this.loading = false;
        });
    },
    /* event handlers ------------------------------------------------------ */
    /**
     * Fired when paging changes (from utils/Pagination)
     * Update start and length, then get data
     */
    changePaging: function (args) {
      let {start, length} = args;
      // this.query.start = args.start;
      // this.query.length = args.length;
      // this.loadData();
      let data = JSON.parse(JSON.stringify(this.data));
      this.totalData = data.slice(start, length + start);
    }
  },
  beforeDestroy: function () {
    // tableDestroyed = true;
    // holdingClick = false;
    // componentInitialized = false;
    // colResizeInitialized = false;
    // colDragDropInitialized = false;

    if (timeout) { clearTimeout(timeout); }

    $('#sessionsTable').colResizable({ disable: true });

    if (draggableColumns) { draggableColumns.destroy(); }

    window.removeEventListener('resize', windowResizeEvent);
  }
};
</script>

<style>
  .col-config-menu .dropdown-menu {
    min-width: 250px;
    max-width: 350px;
  }
  .col-config-menu > button.btn {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;;
  }
  .col-vis-menu > button.btn {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;;
  }
  .col-vis-menu .dropdown-menu {
    max-height: 300px;
    overflow: auto;
  }

  .info-vis-menu .dropdown-menu {
    width: 360px;
  }

  /* small dropdown buttons in column headers */
  .moloch-col-header .btn-group button.btn {
    padding: 0 6px;
  }
  .moloch-col-header .dropdown-menu {
    max-height: 250px;
    overflow: auto;
  }

  .moloch-col-header .btn-group:not(.info-vis-menu) {
    visibility: hidden;
    margin-left: -25px;
  }
</style>

<style scoped>
  /* sessions page, navbar, and content styles - */
  .sessions-page {

  }

  form.sessions-paging {
    z-index: 4;
    position: fixed;
    top: 110px;
    left: 36px;
    right: 0;
    height: 40px;
    background-color: var(--color-quaternary-lightest);

    -webkit-box-shadow: 0 0 16px -2px black;
    -moz-box-shadow: 0 0 16px -2px black;
    box-shadow: 0 0 16px -2px black;
  }

  .sessions-content {
    padding-top: 115px;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  /* sessions table -------------------------- */
  table.sessions-table {
    table-layout: fixed;
    border-top: var(--color-gray-light) solid 1px;
    margin-bottom: 20px;
    border-spacing: 0;
    border-collapse: collapse;
  }

  table.sessions-table thead tr th {
    vertical-align: top;
    border-bottom: 2px solid var(--color-gray);
    border-right: 1px dotted var(--color-gray);
  }
  table.sessions-table thead tr th:last-child:not(.info-col-header) {
    padding-right: 35px;
  }
  table.sessions-table thead tr th:first-child {
    border-right: none;
  }

  table.sessions-table thead tr th:first-child{
    padding: 0;
    vertical-align: middle;
  }

  table.sessions-table tbody tr:not(.session-detail-row):hover {
    background-color: var(--color-tertiary-lightest);
  }

  table.sessions-table tbody tr:not(.session-detail-row):hover td.active {
    background-color: var(--color-tertiary-light);
  }

  table.sessions-table tbody tr.session-detail-row {
    background-color: var(--color-quaternary-lightest) !important;
  }

  table.sessions-table tbody tr td {
    padding: 0 2px;
    line-height: 1.42857143;
    vertical-align: top;
  }

  /*!* table.sessions-table column reorder *!*/
  .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th {
    overflow: visible !important; /* show overflow for clickable fields */
  }

  /* table column headers -------------------- */
  .moloch-col-header {
    font-size: .9rem;
  }

  .moloch-col-header.active {
    color: var(--color-foreground-accent);
  }

  .moloch-col-header:hover .btn-group {
    visibility: visible;
  }

  .moloch-col-header .header-text {
    display: inline-block;
    width: calc(100% - 24px);
  }

  .moloch-col-header .header-sort {
    display: inline-block;
    width: 8px;
    vertical-align: top;
  }

  .info-col-header .btn-group:not(.info-vis-menu) {
    margin-right: 4px;
  }
  .info-vis-menu {
    margin-right: 10px;
  }
  .moloch-col-header:not(:last-child) .info-vis-menu {
    margin-right: 5px;
  }

  /* column visibility menu -------------------- */
  .col-vis-menu .dropdown-header {
    padding: .25rem .5rem 0;
  }
  .col-vis-menu .dropdown-header.group-header {
    text-transform: uppercase;
    margin-top: 8px;
    padding: .2rem;
    font-size: 120%;
    font-weight: bold;
  }

  /* custom column configurations menu --------- */
  .col-config-menu .dropdown-header {
    padding: .25rem .5rem 0;
  }

  /* table fit button -------------------------- */
  button.fit-btn {
    position: absolute;
    top: 290px;
    left: 10px;
  }

  /* animate sticky sessions enter/leave */
  .sticky-sessions {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .leave-enter-active, .leave-leave-active {
    transition: all 0.5s ease;
  }
  .leave-enter, .leave-leave-to {
    z-index: 4;
  }
  .leave-leave-to {
    transform: translateY(1000px);
    opacity: 0;
  }
</style>
