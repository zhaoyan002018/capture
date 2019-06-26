<template>

<div class="spigraph-page">

  <!-- search navbar -->
  <moloch-search
    :num-matching-sessions="filtered"
    :timezone="user.settings.timezone"
    @changeSearch="loadData">
  </moloch-search> <!-- /search navbar -->

  <!-- spigraph sub navbar -->
  <form class="spigraph-form"
        @submit.prevent>
    <div class="form-inline pr-1 pl-1 pt-1 pb-1">

      <div class="ml-1 records-display">
        <strong class="text-theme-accent"
                v-if="!error && recordsFiltered !== undefined">
          {{$t('spigraph.showEntriesTip',[recordsFiltered ,recordsTotal])}}
        </strong>
      </div>
    </div>
  </form>

  <div class="spigraph-content">

    <!-- main visualization -->
    <div v-if="mapData && graphData"
         class="well well-sm ml-2 mr-2 primary">
      <moloch-visualizations
        id="primary"
        :graph-data="graphData"
        :map-data="mapData"
        :primary="true"
        :timezone="user.settings.timezone">
      </moloch-visualizations>
    </div> <!-- /main visualization -->
    <div v-if="mapData && graphData"
    class="worldmap">
      <world-map
        id="primary"
        :graph-data="graphData"
        :map-data="mapData"
        :primary="true"
        :timezone="user.settings.timezone">
      </world-map>
    </div>
    <!-- loading overlay -->
    <moloch-loading
      v-if="loading && !error">
    </moloch-loading> <!-- /loading overlay -->

  </div>

</div>

</template>

<script>
import FieldService from '../search/FieldService';
import MolochError from '../utils/Error';
import MolochSearch from '../search/Search';
import MolochLoading from '../utils/Loading';
import MolochNoResults from '../utils/NoResults';
import MolochVisualizations from '../visualizations/Visualizations';
import WorldMap from './worldMap';
// import { mapHeight } from '@/api/validate';

let oldFieldObj;
let refreshInterval;
let respondedAt; // the time that the last data load succesfully responded

export default {
  name: 'Spigraph',
  components: {
    MolochError,
    MolochSearch,
    MolochLoading,
    MolochNoResults,
    MolochVisualizations,
    WorldMap
  },
  data: function () {
    return {
      error: '',
      fields: [],
      loading: true,
      filtered: 0,
      graphData: undefined,
      mapData: undefined,
      refresh: 0,
      recordsTotal: 0,
      recordsFiltered: 0,
      items: [],
      showDropdown: false,
      fieldTypeahead: undefined,
      sortBy: this.$route.query.sort || 'graph'
    };
  },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
    graphType: function () {
      return this.$store.state.graphType;
    },
    query: function () {
      let sort = 'name';
      if (!this.$route.query.sort || this.$route.query.sort === 'graph') {
        sort = this.$route.query.graphType || 'lpHisto';
      }
      return {
        sort: sort,
        date: this.$store.state.timeRange,
        exp: this.$route.query.field || this.user.settings.spiGraph || 'node',
        size: this.$route.query.size || 20,
        startTime: this.$store.state.time.startTime,
        stopTime: this.$store.state.time.stopTime,
        bounding: this.$route.query.bounding || 'last',
        interval: this.$route.query.interval || 'auto',
        view: this.$route.query.view || undefined,
        expression: this.$store.state.expression || undefined
      };
    },
    fieldObj: function () {
      for (let field of this.fields) {
        if (field.dbField === this.query.exp ||
          field.exp === this.query.exp) {
          oldFieldObj = field;
          return field;
        }
      }
      return oldFieldObj;
    }
  },
  watch: {
    '$route.query.size': function (newVal, oldVal) {
      this.loadData();
    },
    '$route.query.sort': function (newVal, oldVal) {
      this.loadData();
    },
    '$route.query.field': function (newVal, oldVal) {
      this.loadData();
    },
    // watch graph type and update sort
    'graphType': function (newVal, oldVal) {
      if (newVal && this.sortBy === 'graph') {
        this.query.sort = newVal;
        if (oldVal) { this.loadData(); }
      }
    }
  },
  mounted: function () {
    // this.autoHeight();
    // mapHeight();
  },
  created: function () {
    setTimeout(() => {
      // wait for query to be computed
      this.loadData();
      this.changeRefreshInterval();
    });

    FieldService.get(true)
      .then((result) => {
        this.fields = JSON.parse(JSON.stringify(result));
        this.fields.push({
          dbField: 'ip.dst:port',
          exp: 'ip.dst:port',
          help: 'Destination IP:Destination Port',
          group: 'general',
          friendlyName: 'Dst IP:Dst Port'
        });
        for (let field of this.fields) {
          if (field.dbField === this.query.exp ||
            field.exp === this.query.exp) {
            this.fieldTypeahead = field.friendlyName;
          }
        }
      }).catch((error) => {
        this.loading = false;
        this.error = error.text || error;
      });
  },
  methods: {
    /* exposed page functions ---------------------------------------------- */
    changeMaxElements: function () {
      this.$router.push({
        query: {
          ...this.$route.query,
          size: this.query.size
        }
      });
    },
    changeSortBy: function () {
      if (this.sortBy === 'graph') {
        this.query.sort = this.graphType;
      } else {
        this.query.sort = this.sortBy;
      }
      this.$router.push({
        query: {
          ...this.$route.query,
          sort: this.sortBy
        }
      });
    },
    changeRefreshInterval: function () {
      if (refreshInterval) { clearInterval(refreshInterval); }

      if (this.refresh && this.refresh > 0) {
        this.loadData();
        refreshInterval = setInterval(() => {
          if (respondedAt && Date.now() - respondedAt >= parseInt(this.refresh * 1000)) {
            this.loadData();
          }
        }, 500);
      }
    },
    /* event functions ----------------------------------------------------- */
    changeField: function (field) {
      this.fieldTypeahead = field.friendlyName;
      this.query.exp = field.dbField;
      this.$router.push({
        query: {
          ...this.$route.query,
          field: this.query.exp
        }
      });
    },
    /* helper functions ---------------------------------------------------- */
    loadData: function () {
      respondedAt = undefined;
      this.loading = true;
      this.error = false;
      this.query.map = true;
      this.$http.get('spigraph.json', { params: this.query })
        .then((response) => {
          respondedAt = Date.now();
          this.error = '';
          this.loading = false;
          this.items = []; // clear items
          this.processData(response.data);
          this.recordsTotal = response.data.recordsTotal;
          this.recordsFiltered = response.data.recordsFiltered;
        }, (error) => {
          respondedAt = undefined;
          this.loading = false;
          this.error = error.text || error;
        });
    },
    processData: function (json) {
      this.mapData = json.map;
      this.graphData = json.graph;

      let finfo = this.db2Field(this.filed);

      for (let i = 0, len = json.items.length; i < len; i++) {
        json.items[i].type = finfo.type;
      }

      this.items = json.items;
    },
    db2Field: function (dbField) {
      for (let k in this.fields) {
        if (dbField === this.fields[k].dbField ||
          dbField === this.fields[k].rawField) {
          return this.fields[k];
        }
      }

      return undefined;
    }
  }
};
</script>
