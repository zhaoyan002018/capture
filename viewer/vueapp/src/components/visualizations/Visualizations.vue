<template>

  <div class="pt-2"
       :class="{'map-invisible':true}"
       style="position: relative;"
       :id="'vizContainer' + id">
    <!-- graph content -->
    <div>
      <!-- graph controls -->
      <div class="session-graph-btn-container"
           v-if="primary">
        <!-- zoom in/out -->
        <div class="btn-group btn-group-xs">
          <label class="btn btn-default"
                 @click="zoomOut"
                 v-b-tooltip.hover
                 :title="$t('visualizations.zoomOut')">
            <span class="fa fa-search-minus">
            </span>
          </label>
          <label class="btn btn-default"
                 @click="zoomIn"
                 v-b-tooltip.hover
                 :title="$t('visualizations.zoomIn')">
            <span class="fa fa-search-plus">
            </span>
          </label>
        </div> <!-- /zoom in/out -->
        <!-- pan left/right -->
        <div class="btn-group btn-group-xs ml-1">
          <label class="btn btn-default"
                 @click="panLeft"
                 v-b-tooltip.hover
                 :title="$t('visualizations.panLeft')">
            <span class="fa fa-chevron-left">
            </span>
          </label>
          <label class="btn btn-default"
                 @click="panRight"
                 v-b-tooltip.hover
                 :title="$t('visualizations.panRight')">
            <span class="fa fa-chevron-right">
            </span>
          </label>
        </div> <!-- /pan left/right -->
        <!-- graph type -->
        <div class="btn-group btn-group-xs btn-group-radios ml-1">
          <b-form-radio-group
            size="sm"
            buttons
            v-model="graphType"
            @input="changeGraphType">
            <b-radio value="lpHisto"
                     class="btn-radio">
              {{$t('visualizations.session')}}
            </b-radio>
            <b-radio value="paHisto"
                     class="btn-radio">
              {{$t('visualizations.packets')}}
            </b-radio>
            <b-radio value="dbHisto"
                     class="btn-radio">
              {{$t('visualizations.databytes')}}
            </b-radio>
          </b-form-radio-group>
        </div> <!-- graph type -->
        <!--统计-->
        <div class="data_total">
          <span v-if="graphType === 'lpHisto'">
            总会话数：{{lpHistoTotal}}项
          </span>
          <span v-else-if="graphType === 'paHisto'">
            总上行数据包数：{{pa1HistoTotal}}个
            总下行数据包数：{{pa2HistoTotal}}个
          </span>
          <span v-else-if="graphType === 'dbHisto'">
            总上行流量：{{db1HistoTotal}}
            总下行流量：{{db2HistoTotal}}
          </span>
        </div>
      </div> <!-- /graph controls -->

      <!-- graph -->
      <div v-if="graphData"
           class="plot-container">
        <div class="plot-area"
             :id="'plotArea' + id">
        </div>
      </div> <!-- /graph -->

    </div> <!-- /graph content -->

  </div>

</template>

<script>
// graph imports
import '../../../../public/flot-0.7/jquery.flot';
import '../../../../public/flot-0.7/jquery.flot.selection';
import '../../../../public/flot-0.7/jquery.flot.navigate';
import '../../../../public/flot-0.7/jquery.flot.resize';
import '../../../../public/flot-0.7/jquery.flot.stack';
import { changeSize } from '@/api/validate';

// color vars
let foregroundColor;
let primaryColor;
let srcColor;
let dstColor;
let highlightColor;
// let waterColor;
let landColorDark;
let landColorLight;

let timeout;

export default {
  name: 'MolochVisualizations',
  props: {
    graphData: Object,
    // mapData: Object,
    primary: Boolean,
    timezone: {
      type: String,
      default: 'local'
    },
    id: {
      type: String,
      default: 'primary'
    }
  },
  data: function () {
    return {
      // map vars
      mapExpanded: false,
      // graph vars
      myCharts: undefined,
      option: {},
      plot: undefined,
      plotArea: undefined,
      graph: undefined,
      graphOptions: {},
      showMap: undefined,
      // 统计
      db1HistoTotal: null,
      db2HistoTotal: null,
      lpHistoTotal: null,
      pa1HistoTotal: null,
      pa2HistoTotal: null
    };
  },
  computed: {
    // src: {
    //   get: function (value) {
    //     return this.$store.state.mapSrc;
    //   },
    //   set: function (newValue) {
    //     if (this.primary) {
    //       this.$store.commit('toggleMapSrc', newValue);
    //     }
    //   }
    // },
    // dst: {
    //   get: function (value) {
    //     return this.$store.state.mapDst;
    //   },
    //   set: function (newValue) {
    //     if (this.primary) {
    //       this.$store.commit('toggleMapDst', newValue);
    //     }
    //   }
    // },
    graphType: {
      get: function (value) {
        return this.$store.state.graphType;
      },
      set: function (newValue) {
        if (this.primary) {
          this.$store.commit('updateGraphType', newValue);
        }
      }
    },
    seriesType: {
      get: function (value) {
        return this.$store.state.seriesType;
      },
      set: function (newValue) {
        if (this.primary) {
          this.$store.commit('updateSeriesType', newValue);
        }
      }
    }
  },
  watch: {
    graphType: function (newVal, oldVal) {
      function changeGraphType (that) {
        that.setupGraphData();
        try {
          that.plot.setData(that.graph);
          that.plot.setupGrid();
          that.plot.draw();
        } catch (e) {
          if (e) {
            that.setupGraphElement();
          }
        }
        // that.plot = $.plot(that.plotArea, that.graph, that.graphOptions);
      }
      /* eslint no-eval: ["error", {"allowIndirect": true}] */
      /* eslint-env browser */
      if (this.primary) {
        changeGraphType(this);
      } else { // wait for the plot to be accessible
        let id = parseInt(this.id);
        setTimeout(() => { changeGraphType(this); }, id * 100);
      }
    },
    seriesType: function (newVal, oldVal) {
      if (newVal && oldVal) {
        this.setupGraphData();
        this.plot = $.plot(this.plotArea, this.graph, this.graphOptions);
      }
    },
    graphData: function (newVal, oldVal) {
      if (newVal && oldVal) {
        this.setupGraphData(); // setup this.graph and this.graphOptions
        this.plot = $.plot(this.plotArea, this.graph, this.graphOptions);
      }
    }
  },
  created: function () {
    // set styles for graph and map
    const styles = window.getComputedStyle(document.body);
    foregroundColor = styles.getPropertyValue('--color-foreground').trim();
    primaryColor = styles.getPropertyValue('--color-primary').trim();
    srcColor = styles.getPropertyValue('--color-src').trim() || '#CA0404';
    dstColor = styles.getPropertyValue('--color-dst').trim() || '#0000FF';
    highlightColor = styles.getPropertyValue('--color-gray-darker').trim();
    // waterColor = styles.getPropertyValue('--color-water').trim();
    landColorDark = styles.getPropertyValue('--color-land-dark').trim();
    landColorLight = styles.getPropertyValue('--color-land-light').trim();

    if (!landColorDark || !landColorLight) {
      landColorDark = styles.getPropertyValue('--color-primary-dark').trim();
      landColorLight = styles.getPropertyValue('--color-primary-lightest').trim();
    }
  },
  mounted: function () {
    function setupMapAndGraph (that) {
      // create graph
      // setup the graph data and options
      that.setupGraphData();
      // create flot graph
      that.setupGraphElement();
    }

    if (this.primary) {
      this.graphType = this.$route.query.graphType || 'lpHisto';
      this.$store.commit('updateGraphType', this.graphType);

      this.seriesType = 'lines';
      this.$store.commit('updateSeriesType', this.seriesType);
      setupMapAndGraph(this);
    } else { // wait for values in store to be accessible
      let id = parseInt(this.id);
      setTimeout(() => { setupMapAndGraph(this); }, id * 100);
    }
  },
  methods: {
    DataTotal: function (data) {
      let total = 0;
      data.forEach(function (item) {
        total += item[1];
      });
      return total;
    },
    /* exposed functions --------------------------------------------------- */
    /* exposed GRAPH functions */
    changeGraphType: function () {
      if (this.primary) { // primary graph sets all graph's histo type
        this.$store.commit('updateGraphType', this.graphType);
        this.$router.replace({
          query: {
            ...this.$route.query,
            graphType: this.graphType
          }
        });
      }
    },
    changeSeriesType: function () {
      if (this.primary) { // primary graph sets all graph's series type
        this.$store.commit('updateSeriesType', this.seriesType);
        this.$router.replace({
          query: {
            ...this.$route.query,
            seriesType: this.seriesType
          }
        });
      }
    },
    zoomOut: function () {
      this.plot.zoomOut();
      this.debounce(this.updateResults, this.plot, 400);
    },
    zoomIn: function () {
      this.plot.zoom();
      this.debounce(this.updateResults, this.plot, 400);
    },
    panLeft: function () {
      this.plot.pan({ left: -100 });
      this.debounce(this.updateResults, this.plot, 400);
    },
    panRight: function () {
      this.plot.pan({ left: 100 });
      this.debounce(this.updateResults, this.plot, 400);
    },
    /* helper functions ---------------------------------------------------- */
    debounce: function (func, funcParam, ms) {
      if (timeout) { clearTimeout(timeout); }

      timeout = setTimeout(() => {
        func(funcParam);
      }, ms);
    },
    /* helper GRAPH functions */
    updateResults: function (graph) {
      let xAxis = graph.getXAxes();

      let result = {
        startTime: (xAxis[0].min / 1000).toFixed(),
        stopTime: (xAxis[0].max / 1000).toFixed()
      };

      if (result.startTime && result.stopTime) {
        this.$store.commit('setTime', result);
      }
    },
    setupGraphElement: function () {
      this.plotArea = $('#plotArea' + this.id);
      this.plot = $.plot(this.plotArea, this.graph, this.graphOptions);// 标签,数据,框架

      // triggered when an area of the graph is selected
      $(this.plotArea).on('plotselected', (event, ranges) => {
        let result = {
          startTime: (ranges.xaxis.from / 1000).toFixed(),
          stopTime: (ranges.xaxis.to / 1000).toFixed()
        };

        if (result.startTime && result.stopTime) {
          this.$store.commit('setTime', result);
        }
      });

      let previousPoint;
      // triggered when hovering over the graph
      $(this.plotArea).on('plothover', (event, pos, item) => {
        if (item) {
          if (!previousPoint ||
            previousPoint.dataIndex !== item.dataIndex ||
            previousPoint.seriesIndex !== item.seriesIndex) {
            $(document.body).find('#tooltip').remove();

            previousPoint = {
              dataIndex: item.dataIndex,
              seriesIndex: item.seriesIndex
            };

            let type;
            if (this.graphType === 'dbHisto' || this.graphType === 'paHisto') {
              type = item.seriesIndex === 0 ? this.$t('visualizations.src') : this.$t('visualizations.dst');
            }

            let val = this.$options.filters.commaString(Math.round(item.series.data[item.dataIndex][1] * 100) / 100);
            let d = this.$options.filters.timezoneDateString(item.datapoint[0].toFixed(0) / 1000, this.timezone || 'local');
            let atTxt = this.$t('visualizations.atTxt');
            let tooltipHTML = `<div id="tooltip" class="graph-tooltip">
                              <strong>${type || ''}</strong>
                              ${val} <strong>${atTxt}</strong> ${d}
                            </div>`;

            $(tooltipHTML).css({
              top: item.pageY - 30,
              left: item.pageX - 8
            }).appendTo(document.body);
          }
        } else {
          $(document.body).find('#tooltip').remove();
          previousPoint = null;
        }
      });
    },
    setupGraphData: function () {
      if (this.graphType === 'lpHisto') {
        this.lpHistoTotal = this.DataTotal(this.graphData.lpHisto);
      } else if (this.graphType === 'dbHisto') {
        this.db1HistoTotal = changeSize(this.DataTotal(this.graphData.db1Histo));
        this.db2HistoTotal = changeSize(this.DataTotal(this.graphData.db2Histo));
      } else if (this.graphType === 'paHisto') {
        this.pa1HistoTotal = this.DataTotal(this.graphData.pa1Histo);
        this.pa2HistoTotal = this.DataTotal(this.graphData.pa2Histo);
      }
      if (this.graphType === 'dbHisto') {
        this.graph = [
          { label: '上行', data: this.graphData.db1Histo, color: srcColor },
          { label: '下行', data: this.graphData.db2Histo, color: dstColor }
        ];
      } else if (this.graphType === 'paHisto') {
        this.graph = [
          { label: '上行', data: this.graphData.pa1Histo, color: srcColor },
          { label: '下行', data: this.graphData.pa2Histo, color: dstColor }
        ];
      } else {
        this.graph = [{ label: '会话', data: this.graphData[this.graphType], color: primaryColor }];
      }

      this.graphOptions = { // flot graph options
        series: {
          // stack: true,
          lines: {
            fill: true
          }
        },
        legend: {
          show: true,
          noColumns: 2,
          position: 'ne'
        },
        selection: {
          mode: 'x',
          color: highlightColor
        },
        xaxis: {
          mode: 'time',
          // label: this.$t('visualizations.datetime'),
          color: foregroundColor,
          min: this.graphData.xmin || null,
          max: this.graphData.xmax || null,
          tickFormatter: (v, axis) => {
            return this.$options.filters.timezoneDateString(
              Math.floor(v / 1000),
              this.timezone,
              'YYYY/MM/DD HH:mm:ss z'
            );
          }
        },
        yaxis: {
          min: 0,
          color: foregroundColor,
          zoomRange: false,
          autoscaleMargin: 0.2,
          // yaxis 的label
          tickFormatter: (v) => {
            if (this.graphType === 'dbHisto') {
              return this.$options.filters.humanReadableBytes(v * 8, '');
            } else {
              return this.$options.filters.humanReadableNumber(v);
            }
          }
        },
        grid: {
          borderWidth: 0,
          color: foregroundColor,
          hoverable: true,
          clickable: true
        },
        zoom: {
          interactive: false,
          trigger: 'dblclick',
          amount: 2
        },
        pan: {
          interactive: false,
          cursor: 'move',
          frameRate: 20
        }
      };
    }
  },
  beforeDestroy: function () {
    // turn of graph events
    $(this.plotArea).off('plothover');
    $(this.plotArea).off('plotselected');

    if (timeout) { clearTimeout(timeout); }

    // turn off map events
    window.removeEventListener('resize', this.onMapResize);
    $(document).off('mouseup', this.isOutsideClick);
    $(this.mapEl).off('resize', this.onMapResize);
    $(this.mapEl).remove();
  }
};
</script>

<style>
  /*统计悬框的样式*/
  .data_total {
    border-radius: 5px;
    padding: 2px 2px;
    font-size: 12px;
    border: 1px solid;
    background-color: var(--color-background, white) !important;
    border-color: var(--color-primary) !important;
    color: var(--color-primary);
    position: absolute !important;
    top: 0 !important;
    left: 123px !important;
  }
  /* zoom buttons */
  .jvectormap-zoomin, .jvectormap-zoomout {
    position: absolute;
    left: 2px;
    width: 18px;
    height: 20px;
    cursor: pointer;
    line-height: 16px;
    text-align: center;
    border-radius: 3px;
    color: var(--color-gray-darker);
    border-color: var(--color-gray);
    background-color: var(--color-white);
    font-weight: bolder;
  }
  .jvectormap-zoomin:hover, .jvectormap-zoomout:hover {
    color: var(--color-gray-darker);
    border-color: var(--color-gray-dark);
    background-color: var(--color-gray-light);
  }
  .jvectormap-zoomin {
    top: 2px;
  }
  .jvectormap-zoomout {
    top: 24px;
  }

  /* labels added to body by jvectormap */
  .jvectormap-label {
    z-index: 6;
    position: absolute;
    display: none;
    border: solid 1px var(--color-gray-light);
    background: var(--color-gray-darker);
    color: var(--color-white);
    font-size: smaller;
    padding: var(--px-none) var(--px-sm);
    border-radius: 3px;
  }

  /* display a tooltip above the bar in the session graph */
  .graph-tooltip {
    z-index: 4;
    position: absolute;
    white-space: nowrap;
    color: var(--color-gray-lighter);
    padding: 3px;
    font-size: 8pt;
    background-color: var(--color-black);
    border-radius: 4px;
    border: 1px solid var(--color-black);
  }
  .graph-tooltip:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: 2px;
    top: 20px;
    border-style: solid;
    border-width: 8px 8px 0 8px;
    border-color: var(--color-black) transparent transparent transparent;
  }

  /* make graph labels smaller */
  .tickLabels .tickLabel {
    font-size: smaller;
  }
</style>

<style scoped>

  /* graph styles -------------------- */
  .plot-area {
    width: 100%;
    height: 150px;
  }

  .map-visible .plot-container {
    position: relative;
    display: block;
    width: 100%;
  }
  .map-invisible .plot-container {
    position: relative;
    width: 99%;
  }

  /* center timeline buttons */
  .session-graph-btn-container {
    position: absolute;
    left: 50%;
    white-space: nowrap;
    z-index: 1;
  }

  .session-graph-btn-container > div {
    position: relative;
    left: -50%;
  }

  /* center timeline buttons on timeline graph if the map is collapsed */
  .map-visible .session-graph-btn-container {
    left: 25%;
  }
  .map-visible .session-graph-btn-container > div {
    left: 0;
  }

  .session-graph-btn-container .btn-group-xs.btn-group-radios {
    margin-top: -7px;
  }

  .session-graph-btn-container .btn-group-xs label.btn-radio {
    padding: 1px 5px;
    font-size: 12px;
    line-height: 1.5;
  }
</style>
