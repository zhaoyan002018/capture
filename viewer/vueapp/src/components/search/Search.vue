<template>

  <form>
    <div class="mr-1 ml-1 mt-1 mb-1">

      <!-- actions dropdown menu -->
      <b-dropdown v-if="!hideActions"
        right
        size="sm"
        class="pull-right ml-1 action-menu-dropdown"
        boundary="body"
        variant="theme-primary">
        <b-dropdown-item @click="exportPCAP"
          v-has-permission="'!disablePcapDownload'">
          <span class="fa fa-fw fa-file-o"></span>&nbsp;
          {{$t('common.export')}} PCAP
        </b-dropdown-item>
        <b-dropdown-item @click="exportCSV">
          <span class="fa fa-fw fa-file-excel-o"></span>&nbsp;
          {{$t('common.export')}} CSV
        </b-dropdown-item>
        <b-dropdown-item @click="addTags">
          <span class="fa fa-fw fa-tags"></span>&nbsp;
          {{$t('common.add')}} Tags
        </b-dropdown-item>
        <b-dropdown-item @click="removeTags"
          v-has-permission="'removeEnabled'">
          <span class="fa fa-fw fa-trash-o"></span>&nbsp;
          {{$t('common.remove')}} Tags
        </b-dropdown-item>
        <b-dropdown-item @click="scrubPCAP"
          v-has-permission="'removeEnabled'">
          <span class="fa fa-fw fa-trash-o"></span>&nbsp;
          {{$t('search.scrub')}}
        </b-dropdown-item>
        <b-dropdown-item @click="deleteSession"
          v-has-permission="'removeEnabled'">
          <span class="fa fa-fw fa-trash-o"></span>&nbsp;
          {{$t('common.delete')}} SPI & PCAP
        </b-dropdown-item>
        <b-dropdown-item v-for="(cluster, key) in molochClusters"
          :key="key"
          @click="sendSession(key)">
          <span class="fa fa-fw fa-paper-plane-o"></span>&nbsp;
          {{$t('search.sendSessionTo',[cluster.name])}}
        </b-dropdown-item>
        <b-dropdown-item @click="viewIntersection">
          <span class="fa fa-fw fa-venn">
            <span class="fa fa-circle-o">
            </span>
            <span class="fa fa-circle-o">
            </span>
          </span>&nbsp;
          {{$t('common.export')}} Intersection
        </b-dropdown-item>
      </b-dropdown> <!-- /actions dropdown menu -->

      <!-- views dropdown menu -->
      <b-dropdown right
        size="sm"
        class="pull-right ml-1 view-menu-dropdown"
        no-caret
        toggle-class="rounded"
        variant="theme-secondary">
        <template slot="button-content">
          <div v-if="view && views && views[view]"
            v-b-tooltip.hover.left
            :title="views[view].expression">
            <span class="fa fa-eye"></span>
            <span v-if="view">{{ view }}</span>
          <span class="sr-only">{{$t('common.view')}}</span>
          </div>
          <div v-else>
            <span class="fa fa-eye"></span>
            <span class="sr-only">Views</span>
          </div>
        </template>
        <b-dropdown-item @click="createView">
          <span class="fa fa-plus-circle"></span>&nbsp;
          {{$t('search.newView')}}
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="setView(undefined)"
          :class="{'active':!view}">
          {{$t('common.none')}}
        </b-dropdown-item>
        <b-dropdown-item v-for="(value, key) in views"
          :key="key"
          :class="{'active':view === key}"
          @click.self="setView(key)"
          v-b-tooltip.hover.left
          :title="value.expression">
          <span v-if="value.shared"
            class="fa fa-share-square">
          </span>
          {{ key }}&nbsp;
          <span v-if="value.sessionsColConfig"
            class="fa fa-columns cursor-help"
            v-b-tooltip.hover
            title="This view has a sessions table column configuration and sort order associated with it. Applying this view will also update the sessions table.">
          </span>
        </b-dropdown-item>
      </b-dropdown> <!-- /views dropdown menu -->

      <!-- search button -->
      <a class="btn btn-theme-tertiary pull-right search-btn"
         style="margin-left: 0.25rem !important;padding: 0.25rem 0.5rem;font-size: 0.875rem;
                line-height: 1.5;border-radius: 0.2rem;"
        @click="applyParams"
        tabindex="2">
        <span v-if="!shiftKeyHold">
          {{$t('common.search')}}
        </span>
        <span v-else
          class="enter-icon">
          <span class="fa fa-long-arrow-left fa-lg">
          </span>
          <div class="enter-arm">
          </div>
        </span>
      </a> <!-- /search button -->

      <!-- search box typeahead -->
      <expression-typeahead
        @applyExpression="applyParams"
        @changeExpression="changeExpression">
      </expression-typeahead> <!-- /search box typeahead -->

      <!-- time inputs -->
      <moloch-time :timezone="timezone"
        @timeChange="timeChange"
        :hide-interval="hideInterval"
        :updateTime="updateTime">
      </moloch-time> <!-- /time inputs -->

      <!-- form message -->
      <div class="small mt-1">
        <moloch-toast :message="message"
          :type="messageType"
          :done="messageDone">
        </moloch-toast>
      </div> <!-- /form message -->

      <div v-if="actionForm">
        <hr class="action-form-separator">
        <div class="row">
          <div v-if="showApplyButtons"
            class="col-md-3">
            <b-form-group>
              <b-form-radio-group
                size="sm"
                buttons
                v-model="actionFormItemRadio">
                <b-radio value="open"
                  v-b-tooltip.hover
                  :title="$t('search.openItemsTip',[openSessions.length])"
                  class="btn-radio">
                  {{$t('search.openItems')}}
                </b-radio>
                <b-radio value="visible"
                  v-b-tooltip.hover
                  :title="$t('search.visibleItemsTip',[Math.min(numVisibleSessions, numMatchingSessions)])"
                  class="btn-radio">
                  {{$t('search.visibleItems')}}
                </b-radio>
                <b-radio value="matching"
                  v-b-tooltip.hover
                  :title="$t('search.matchingItemsTip',[numMatchingSessions])"
                  class="btn-radio">
                  {{$t('search.matchingItems')}}
                </b-radio>
              </b-form-radio-group>
            </b-form-group>
          </div>
          <!-- actions menu forms -->
          <div :class="{'col-md-9':showApplyButtons,'col-md-12':!showApplyButtons}">
            <moloch-create-view v-if="actionForm === 'create:view'"
              :done="actionFormDone"
              @newView="newView">
            </moloch-create-view>
            <moloch-tag-sessions v-else-if="actionForm === 'add:tags' || actionForm === 'remove:tags'"
              :add="actionForm === 'add:tags'"
              :start="start"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-tag-sessions>
            <moloch-delete-sessions v-else-if="actionForm === 'delete:session'"
              :start="start"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-delete-sessions>
            <moloch-scrub-pcap v-else-if="actionForm === 'scrub:pcap'"
              :start="start"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-scrub-pcap>
            <moloch-send-sessions v-else-if="actionForm === 'send:session'"
              :start="start"
              :cluster="cluster"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-send-sessions>
            <moloch-export-pcap v-else-if="actionForm === 'export:pcap'"
              :start="start"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-export-pcap>
            <moloch-export-csv v-else-if="actionForm === 'export:csv'"
              :start="start"
              :fields="fields"
              :done="actionFormDone"
              :sessions="openSessions"
              :num-visible="numVisibleSessions"
              :num-matching="numMatchingSessions"
              :apply-to="actionFormItemRadio">
            </moloch-export-csv>
            <moloch-intersection v-else-if="actionForm === 'view:intersection'"
              :done="actionFormDone"
              :fields="fields">
            </moloch-intersection>
          </div> <!-- /actions menu forms -->
        </div>
      </div>

    </div>
  </form>

</template>

<script>
import UserService from '../users/UserService';
import ConfigService from '../utils/ConfigService';
import ExpressionTypeahead from './ExpressionTypeahead';
import MolochTime from './Time';
import MolochToast from '../utils/Toast';
import MolochCreateView from '../sessions/CreateView';
import MolochTagSessions from '../sessions/Tags';
import MolochDeleteSessions from '../sessions/Delete';
import MolochScrubPcap from '../sessions/Scrub';
import MolochSendSessions from '../sessions/Send';
import MolochExportPcap from '../sessions/ExportPcap';
import MolochExportCsv from '../sessions/ExportCsv';
import MolochIntersection from '../sessions/Intersection';

export default {
  name: 'MolochSearch',
  components: {
    ExpressionTypeahead,
    MolochTime,
    MolochToast,
    MolochCreateView,
    MolochTagSessions,
    MolochDeleteSessions,
    MolochScrubPcap,
    MolochSendSessions,
    MolochExportPcap,
    MolochExportCsv,
    MolochIntersection
  },
  props: [
    'openSessions',
    'numVisibleSessions',
    'numMatchingSessions',
    'start',
    'timezone',
    'fields',
    'hideActions',
    'hideInterval'
  ],
  data: function () {
    return {
      molochClusters: {},
      actionFormItemRadio: 'visible',
      actionFormItemRadioOptions: [
        { text: 'Open Item', value: 'open' },
        { text: 'Visible Items', value: 'visible' },
        { text: 'Matching Items', value: 'matching' }
      ],
      actionForm: undefined,
      showApplyButtons: false,
      cluster: {},
      view: this.$route.query.view,
      message: undefined,
      messageType: undefined,
      updateTime: false
    };
  },
  computed: {
    expression: {
      get: function () {
        return this.$store.state.expression;
      },
      set: function (newValue) {
        this.$store.commit('setExpression', newValue);
      }
    },
    issueSearch: function () {
      return this.$store.state.issueSearch;
    },
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    views: {
      get: function () {
        return this.$store.state.views;
      },
      set: function (newValue) {
        this.$store.commit('setViews', newValue);
      }
    },
    user: function () {
      return this.$store.state.user;
    }
  },
  watch: {
    // watch route update of view param
    '$route.query.view': function (newVal, oldVal) {
      this.view = newVal;
      sessionStorage['moloch-view'] = newVal;

      this.$emit('changeSearch', {
        expression: this.expression,
        view: this.view
      });
    },
    issueSearch: function (newVal, oldVal) {
      if (newVal) { this.applyParams(); }
    }
  },
  created: function () {
    this.getViews();
    this.getMolochClusters();
  },
  methods: {
    /* exposed page functions ------------------------------------ */
    messageDone: function () {
      this.message = undefined;
      this.messageType = undefined;
    },
    applyExpression: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          expression: this.expression
        },
        params: { nav: true }
      });
    },
    changeExpression: function () {
      this.timeUpdate();
    },
    applyParams: function () {
      this.applyExpression();
      this.timeUpdate();
    },
    exportPCAP: function () {
      this.actionForm = 'export:pcap';
      this.showApplyButtons = true;
    },
    exportCSV: function () {
      this.actionForm = 'export:csv';
      this.showApplyButtons = true;
    },
    addTags: function () {
      this.actionForm = 'add:tags';
      this.showApplyButtons = true;
    },
    removeTags: function () {
      this.actionForm = 'remove:tags';
      this.showApplyButtons = true;
    },
    scrubPCAP: function () {
      this.actionForm = 'scrub:pcap';
      this.showApplyButtons = true;
    },
    deleteSession: function () {
      this.actionForm = 'delete:session';
      this.showApplyButtons = true;
    },
    sendSession: function (cluster) {
      this.cluster = cluster;
      this.actionForm = 'send:session';
      this.showApplyButtons = true;
    },
    createView: function () {
      this.actionForm = 'create:view';
      this.showApplyButtons = false;
    },
    viewIntersection: function () {
      this.actionForm = 'view:intersection';
      this.showApplyButtons = false;
    },
    actionFormDone: function (message, success, reloadData) {
      this.actionForm = undefined;
      if (message) {
        this.message = message;
        this.messageType = success ? 'success' : 'warning';
      }
    },
    /* updates the views list with the included new view */
    newView: function (view, viewName) {
      if (view && viewName && this.views) {
        this.views[viewName] = view;
      }
    },
    setView: function (view) {
      this.view = view;

      // update the url and session storage (to persist user's choice)
      // triggers the '$route.query.view' watcher that issues changeSearch event
      sessionStorage['moloch-view'] = view;
      this.$router.push({
        query: {
          ...this.$route.query,
          view: view
        }
      });
    },
    /* helper functions ------------------------------------------ */
    getViews: function () {
      UserService.getViews()
        .then((response) => {
          this.views = response;
        });
    },
    getMolochClusters: function () {
      ConfigService.getMolochClusters()
        .then((response) => {
          this.molochClusters = response;
        });
    },
    /**
     * If the start/stop time has changed:
     * Applies the date start/stop time url parameters and removes the date url parameter
     * Updating the url parameter triggers updateParams in Time.vue
     * If just a search was issued:
     * Update the start/stop time in the time component so that the query that is
     * issued has the correct start/stop time (date only sent if -1)
     */
    timeUpdate: function () {
      if (this.$store.state.timeRange === '0' &&
        this.$store.state.time.startTime && this.$store.state.time.stopTime) {
        if (this.user.timeLimit) {
          // make sure the query doesn't exceed the user time limit
          let deltaTime = this.$store.state.time.stopTime - this.$store.state.time.startTime;

          // make sure the time range does not exceed the user setting
          let deltaTimeHrs = deltaTime / 3600;
          if (deltaTimeHrs > this.user.timeLimit) {
            return;
          }
        }

        this.$router.push({
          query: {
            ...this.$route.query,
            date: undefined,
            stopTime: this.$store.state.time.stopTime,
            startTime: this.$store.state.time.startTime
          }
        });
      }

      this.updateTime = true;
      setTimeout(() => {
        this.updateTime = false;
      }, 1000);
    },
    /* event functions ------------------------------------------- */
    /**
     * Triggered when a time value is changed in the Time component
     * If the expression has changed, but has not been applied to the
     * url query parameters, apply it to url (this kicks off query by
     * triggering changeExpression, then timeUpdate)
     * If the expression has not changed, just tell the parent component
     * that the time has changed, so it should issue a query
     */
    timeChange: function () {
      if (this.$route.query.expression !== this.expression) {
        this.applyExpression();
      } else {
        this.$emit('changeSearch');
      }
    }
  }
};
</script>

<style>
.view-menu-dropdown .dropdown-menu {
  width: 200px;
}
</style>

<style scoped>
form {
  position: fixed;
  right: 0;
  left: 36px;
  border: none;
  z-index: 5;
  top: 36px;
  background-color: var(--color-secondary-lightest);

  -webkit-box-shadow: 0 0 16px -2px black;
     -moz-box-shadow: 0 0 16px -2px black;
          box-shadow: 0 0 16px -2px black;
}

.action-form-separator {
  margin: 5px 0;
  border-top: 1px solid var(--color-gray-light);
}

/* make sure action menu dropdown is above all the things
 * but specifically above the sticky sessions button */
.action-menu-dropdown { z-index: 1030; }

.form-group {
  margin-bottom: 0;
}
</style>
