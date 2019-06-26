<template>

  <div class="stats-content">

    <!-- stats sub navbar -->
    <form class="stats-form">
      <div class="form-inline mr-1 ml-1 mt-1 mb-1">

        <!-- graph type select -->
        <div class="input-group input-group-sm"
          v-if="tabIndex === 0">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            :title="$t('stats.graphTypeTitleTip')">
            <span class="input-group-text">
              {{$t('stats.graphTypeTitle')}}
            </span>
          </div>
          <select class="form-control input-sm"
            v-model="statsType"
            v-on:change="statsTypeChange">
            <option value="deltaPacketsPerSec">{{$t('stats.graphTypeSelectOpts.deltaPacketsPerSec')}}</option>
            <option value="deltaBytesPerSec">{{$t('stats.graphTypeSelectOpts.deltaBytesPerSec')}}</option>
            <option value="deltaBitsPerSec">{{$t('stats.graphTypeSelectOpts.deltaBitsPerSec')}}</option>
            <option value="deltaSessionsPerSec">{{$t('stats.graphTypeSelectOpts.deltaSessionsPerSec')}}</option>
            <option value="deltaDroppedPerSec">{{$t('stats.graphTypeSelectOpts.deltaDroppedPerSec')}}</option>
            <option value="monitoring">{{$t('stats.graphTypeSelectOpts.monitoring')}}</option>
            <option value="tcpSessions">{{$t('stats.graphTypeSelectOpts.tcpSessions')}}</option>
            <option value="udpSessions">{{$t('stats.graphTypeSelectOpts.udpSessions')}}</option>
            <option value="icmpSessions">{{$t('stats.graphTypeSelectOpts.icmpSessions')}}</option>
            <option value="sctpSessions">{{$t('stats.graphTypeSelectOpts.sctpSessions')}}</option>
            <option value="espSessions">{{$t('stats.graphTypeSelectOpts.espSessions')}}</option>
            <option value="usedSpaceM">{{$t('stats.graphTypeSelectOpts.usedSpaceM')}}</option>
            <option value="freeSpaceM">{{$t('stats.graphTypeSelectOpts.freeSpaceM')}}</option>
            <option value="freeSpaceP">{{$t('stats.graphTypeSelectOpts.freeSpaceP')}}</option>
            <option value="memory">{{$t('stats.graphTypeSelectOpts.memory')}}</option>
            <option value="memoryP">{{$t('stats.graphTypeSelectOpts.memoryP')}}</option>
            <option value="cpu">{{$t('stats.graphTypeSelectOpts.cpu')}}</option>
            <option value="diskQueue">{{$t('stats.graphTypeSelectOpts.diskQueue')}}</option>
            <option value="esQueue">{{$t('stats.graphTypeSelectOpts.esQueue')}}</option>
            <option value="deltaESDroppedPerSec">{{$t('stats.graphTypeSelectOpts.deltaESDroppedPerSec')}}</option>
            <option value="esHealthMS">{{$t('stats.graphTypeSelectOpts.esHealthMS')}}</option>
            <option value="packetQueue">{{$t('stats.graphTypeSelectOpts.packetQueue')}}</option>
            <option value="closeQueue">{{$t('stats.graphTypeSelectOpts.closeQueue')}}</option>
            <option value="needSave">{{$t('stats.graphTypeSelectOpts.needSave')}}</option>
            <option value="frags">{{$t('stats.graphTypeSelectOpts.frags')}}</option>
            <option value="deltaFragsDroppedPerSec">{{$t('stats.graphTypeSelectOpts.deltaFragsDroppedPerSec')}}</option>
            <option value="deltaOverloadDroppedPerSec">{{$t('stats.graphTypeSelectOpts.deltaOverloadDroppedPerSec')}}</option>
            <option value="deltaTotalDroppedPerSec">{{$t('stats.graphTypeSelectOpts.deltaTotalDroppedPerSec')}}</option>
            <option value="deltaSessionBytesPerSec">{{$t('stats.graphTypeSelectOpts.deltaSessionBytesPerSec')}}</option>
            <option value="sessionSizePerSec">{{$t('stats.graphTypeSelectOpts.sessionSizePerSec')}}</option>
            <option value="deltaWrittenBytesPerSec">Written Bytes/Sec</option>
            <option value="deltaUnwrittenBytesPerSec">Unwritten Bytes/Sec</option>
          </select>
        </div> <!-- /graph type select -->

        <!-- graph interval select -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex === 0">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            :title="$t('stats.graphIntervalTip')">
            <span class="input-group-text">
              {{$t('stats.graphInterval')}}
            </span>
          </div>
          <select class="form-control input-sm"
            v-model="graphInterval"
            v-on:change="graphIntervalChange">
            <option value="5">{{$t('common.seconds')}}</option>
            <option value="60">Minutes</option>
            <option value="600">10 Minutes</option>
          </select>
        </div> <!-- /graph interval select -->

        <!-- graph hide select -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex === 0 || tabIndex === 1">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            :title="$t('stats.hideTip')">
           <span class="input-group-text">
             {{$t('stats.hide')}}
           </span>
         </div>
          <select class="form-control input-sm"
            v-model="graphHide"
            v-on:change="graphHideChange">
            <option value="none">{{$t('stats.none')}}</option>
            <option value="old">{{$t('stats.outOfDate')}}</option>
            <option value="nosession">{{$t('stats.noSessions')}}</option>
            <option value="both">{{$t('stats.both')}}</option>
          </select>
        </div> <!-- /graph hide select -->

        <!-- graph sort select -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex === 0">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            :title="$t('stats.sort')">
           <span class="input-group-text">
             {{$t('stats.sort')}}
           </span>
         </div>
          <select class="form-control input-sm"
            v-model="graphSort">
            <option value="asc">{{$t('stats.ascending')}}</option>
            <option value="desc">{{$t('stats.descending')}}</option>
          </select>
        </div> <!-- /graph hide select -->

        <!-- table data interval select -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex !== 0">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            :title="$t('stats.refreshDataTip')">
            <span class="input-group-text">
              {{$t('stats.refreshData')}}
            </span>
          </div>
          <select class="form-control input-sm"
            v-model="dataInterval"
            v-on:change="dataIntervalChange" >
            <option value="5000">5 {{$t('common.seconds')}}</option>
            <option value="15000">15 {{$t('common.seconds')}}</option>
            <option value="30000">30 {{$t('common.seconds')}}</option>
            <option value="60000">1 {{$t('common.minute')}}</option>
            <option value="600000">10 {{$t('common.minutes')}}</option>
            <option value="0">{{$t('common.none')}}</option>
          </select>
        </div> <!-- /table data interval select -->

        <!-- recovery show select -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex === 6">
          <div class="input-group-prepend help-cursor"
            v-b-tooltip.hover
            title="Hide rows">
           <span class="input-group-text">
             Show
           </span>
         </div>
          <select class="form-control input-sm"
            v-model="recoveryShow"
            v-on:change="recoveryShowChange">
            <option value="all">All</option>
            <option value="notdone">Not Done</option>
          </select>
        </div> <!-- /graph hide select -->

        <!-- refresh button -->
        <div class="input-group input-group-sm ml-1"
          v-if="tabIndex !== 0">
          <button type="button"
            class="btn btn-theme-tertiary btn-sm refresh-btn"
            @click="loadData">
            <span v-if="!shiftKeyHold">
              Refresh
            </span>
            <span v-else
              class="enter-icon">
              <span class="fa fa-long-arrow-left fa-lg">
              </span>
              <div class="enter-arm">
              </div>
            </span>
          </button>
        </div> <!-- /refresh button -->

        <!-- confirm button -->
        <transition name="buttons">
          <button v-if="confirmMessage"
            type="button"
            class="btn btn-sm btn-danger ml-2"
            @click="confirmed">
            <span class="fa fa-check">
            </span>&nbsp;
            {{ confirmMessage }}
          </button>
        </transition> <!-- /confirm button -->

        <!-- cancel confirm button -->
        <transition name="buttons">
          <button v-if="confirmMessage"
            type="button"
            class="btn btn-sm btn-warning ml-2"
            @click="cancelConfirm">
            <span class="fa fa-ban">
            </span>&nbsp;
            Cancel
          </button>
        </transition> <!-- /cancel confirm button -->

        <!-- error (from child component) -->
        <div v-if="childError"
          role="alert"
          class="alert alert-sm alert-danger alert-dismissible fade show ml-2">
          {{ childError }}
          <button type="button"
            class="close"
            @click="childError = ''">
            <span>&times;</span>
          </button>
        </div> <!-- /error (from child component) -->

      </div>
    </form> <!-- /stats sub navbar -->

    <!-- stats content -->
    <div class="stats-tabs">
      <div class="input-group input-group-sm pull-right mr-1 pt-1">
        <div class="input-group-prepend">
          <span class="input-group-text input-group-text-fw">
            <span v-if="loadingData"
              class="fa fa-spinner fa-spin text-theme-accent">
            </span>
            <span v-else-if="!shiftKeyHold"
              class="fa fa-search fa-fw">
            </span>
            <span v-else-if="shiftKeyHold"
              class="query-shortcut">
              Q
            </span>
          </span>
        </div>
        <input type="text"
          class="form-control"
          v-model="searchTerm"
          v-focus-input="focusInput"
          @blur="onOffFocus"
          @input="debounceSearchInput"
          @keyup.enter="debounceSearchInput"
          placeholder="请输入搜索关键词"
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
      <b-tabs v-model="tabIndex">
        <b-tab :title="$t('stats.captureGraph')"
          @click="tabIndexChange">
          <capture-graphs v-if="user && tabIndex === 0"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :graph-type="statsType"
            :graph-interval="graphInterval"
            :graph-hide="graphHide"
            :graph-sort="graphSort"
            :user="user">
          </capture-graphs>
        </b-tab>
        <b-tab :title="$t('stats.captureStats')"
          @click="tabIndexChange">
          <capture-stats v-if="user && tabIndex === 1"
            :graph-hide="graphHide"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :data-interval="dataInterval"
            :user="user">
          </capture-stats>
        </b-tab>
        <b-tab :title="$t('stats.esNode')"
          @click="tabIndexChange">
          <es-nodes v-if="user && tabIndex === 2"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :data-interval="dataInterval">
          </es-nodes>
        </b-tab>
        <b-tab :title="$t('stats.esIndices')"
          @click="tabIndexChange"
          v-if="!multiviewer">
          <es-indices v-if="user && tabIndex === 3"
            :refreshData="refreshData"
            :data-interval="dataInterval"
            @errored="onError"
            @confirm="confirm"
            :searchTerm="searchTerm"
            :issueConfirmation="issueConfirmation"
            :user="user">
          </es-indices>
        </b-tab>
        <b-tab :title="$t('stats.esTasks')"
          @click="tabIndexChange"
          v-if="!multiviewer">
          <es-tasks v-if="user && tabIndex === 4"
            :data-interval="dataInterval"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :user="user">
          </es-tasks>
        </b-tab>
        <b-tab :title="$t('stats.esShards')"
          @click="tabIndexChange"
          v-if="!multiviewer">
          <es-shards v-if="user && tabIndex === 5"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :data-interval="dataInterval">
          </es-shards>
        </b-tab>
        <b-tab title="ES Recovery"
          @click="tabIndexChange"
          v-if="!multiviewer">
          <es-recovery v-if="user && tabIndex === 6"
            :recovery-show="recoveryShow"
            :data-interval="dataInterval"
            :refreshData="refreshData"
            :searchTerm="searchTerm"
            :user="user">
          </es-recovery>
        </b-tab>
      </b-tabs>
    </div> <!-- /stats content -->

  </div>

</template>

<script>
import EsShards from './EsShards';
import EsNodes from './EsNodes';
import EsTasks from './EsTasks';
import EsRecovery from './EsRecovery';
import EsIndices from './EsIndices';
import CaptureGraphs from './CaptureGraphs';
import CaptureStats from './CaptureStats';
import FocusInput from '../utils/FocusInput';

let searchInputTimeout;

export default {
  name: 'Stats',
  components: {
    CaptureGraphs, CaptureStats, EsShards, EsNodes, EsIndices, EsTasks, EsRecovery
  },
  directives: { FocusInput },
  data: function () {
    return {
      tabIndex: parseInt(this.$route.query.statsTab, 10) || 0,
      statsType: this.$route.query.type || 'deltaPacketsPerSec',
      graphInterval: this.$route.query.gtime || '5',
      graphHide: this.$route.query.hide || 'none',
      graphSort: this.$route.query.sort || 'asc',
      recoveryShow: this.$route.query.recoveryShow || 'notdone',
      dataInterval: this.$route.query.refreshInterval || '5000',
      refreshData: false,
      childError: '',
      multiviewer: this.$constants.DPS_MULTIVIEWER,
      confirmMessage: '',
      itemToConfirm: undefined,
      issueConfirmation: undefined,
      searchTerm: undefined
    };
  },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
    issueSearch: function () {
      return this.$store.state.issueSearch;
    },
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
    },
    loadingData: function () {
      return this.$store.state.loadingData;
    }
  },
  watch: {
    // watch for the route to change, then update the view
    '$route': 'updateParams',
    issueSearch: function (newVal, oldVal) {
      if (newVal) { this.loadData(); }
    }
  },
  methods: {
    statsTypeChange: function () {
      this.$router.push({ query: { ...this.$route.query, type: this.statsType } });
    },
    graphIntervalChange: function () {
      this.$router.push({ query: { ...this.$route.query, gtime: this.graphInterval } });
    },
    graphHideChange: function () {
      this.$router.push({ query: { ...this.$route.query, hide: this.graphHide } });
    },
    recoveryShowChange: function () {
      this.$router.push({ query: { ...this.$route.query, hide: this.recoveryShow } });
    },
    dataIntervalChange: function () {
      this.$router.push({ query: { ...this.$route.query, refreshInterval: this.dataInterval } });
    },
    tabIndexChange: function () {
      this.$router.push({ query: { ...this.$route.query, statsTab: this.tabIndex } });
    },
    updateParams: function () {
      let queryParams = this.$route.query;

      if (queryParams.statsTab) {
        this.tabIndex = parseInt(queryParams.statsTab, 10);
      }
      if (queryParams.type) {
        this.statsType = queryParams.type;
      }
      if (queryParams.graphInterval) {
        this.graphInterval = queryParams.gtime;
      }
      if (queryParams.graphHide) {
        this.graphHide = queryParams.graphHide;
      }
      if (queryParams.recoveryShow) {
        this.recoveryShow = queryParams.recoveryShow;
      }
      if (queryParams.graphSort) {
        this.graphSort = queryParams.graphSort;
      }
      if (queryParams.refreshInterval) {
        this.dataInterval = queryParams.refreshInterval;
      }
    },
    clear: function () {
      this.searchTerm = undefined;
      this.loadData();
    },
    onOffFocus: function () {
      this.focusInput = false;
    },
    debounceSearchInput () {
      if (searchInputTimeout) { clearTimeout(searchInputTimeout); }
      // debounce the input so it only issues a request after keyups cease for 400ms
      searchInputTimeout = setTimeout(() => {
        searchInputTimeout = null;
        this.loadData();
      }, 400);
    },
    loadData: function () {
      this.refreshData = true;
      setTimeout(() => { this.refreshData = false; });
    },
    onError: function (message) {
      this.childError = message;
    },
    confirm: function (message, itemToConfirm) {
      this.confirmMessage = message;
      this.itemToConfirm = itemToConfirm;
    },
    cancelConfirm: function () {
      this.issueConfirmation = undefined;
      this.itemToConfirm = undefined;
      this.confirmMessage = '';
    },
    confirmed: function () {
      this.issueConfirmation = this.itemToConfirm;
      setTimeout(() => {
        this.issueConfirmation = undefined;
        this.itemToConfirm = undefined;
        this.confirmMessage = '';
      });
    }
  }
};
</script>

<style>
table .btn-group.row-actions-btn > .btn-sm {
  padding: 1px 4px;
  font-size: 13px;
  line-height: 1.2;
}

/* fix the nav tabs to the top and scroll the content */
.stats-tabs .nav-tabs {
  position: fixed;
  width:100%;
  z-index: 4;
  padding-top: 10px;
  background-color: var(--color-background, #FFFFFF);
}
.stats-tabs .tab-content {
  padding-top: 50px;
}
</style>

<style scoped>

/* apply theme colors to subnavbar */
form.stats-form {
  position: fixed;
  width:100%;
  z-index : 5;
  background-color: var(--color-quaternary-lightest);

  -webkit-box-shadow: var(--px-none) var(--px-none) var(--px-xxlg) -8px #333;
     -moz-box-shadow: var(--px-none) var(--px-none) var(--px-xxlg) -8px #333;
          box-shadow: var(--px-none) var(--px-none) var(--px-xxlg) -8px #333;
}

/* remove browser styles on select box (mostly for border-radius) */
select {
  -webkit-appearance: none;
}

.stats-tabs {
  padding-top: 35px;
}
.stats-tabs .input-group {
  max-width: 333px;
  position: fixed;
  right: 0;
  z-index: 5;
  margin-top: 10px;
}

/* confirm button animations */
.buttons-enter-active {
  animation: bounce-in .5s;
}
.buttons-leave-active {
  transition: all .3s ease;
}
.buttons-enter, .buttons-leave-to {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
