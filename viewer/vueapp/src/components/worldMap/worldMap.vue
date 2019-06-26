<template>
  <div :class="{'expanded':mapExpanded}" id="worldMap">
    <div class="inline-map">
      <div v-if="mapData" style="height: 100%;">
        <div class="moloch-map-container">
          <!-- map -->
          <div class="moloch-map"
               :id="'molochMap' + id">
          </div> <!-- /map -->

          <el-tooltip :content="$t('visualizations.expandCollapseMapTip')" placement="top">
            <el-button
              :class="{'btn-expand-map':primary,'btn-close-map':!primary}"
              @click="toggleMapSize">
              <span class="fa" :class="{'fa-expand':!mapExpanded,'fa-compress':mapExpanded}">
              </span>
            </el-button>
          </el-tooltip>
          <el-button-group style=" position: absolute; width: 26px; top: 52px; right: 2px;z-index: 5;">
            <el-tooltip :content="$t('visualizations.toggleSourceCountriesTip')" placement="top">
              <el-button
                :class="{'active':src}"
                @click="toggleSrcDst('src')">
                <strong>{{$t('visualizations.countriesSShort')}}</strong>
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('visualizations.toggleDestinationCountriesTip')" placement="top">
              <el-button
                style="margin-left: 0px !important;"
                :class="{'active':dst}"
                @click="toggleSrcDst('dst')">
                <strong>{{$t('visualizations.countriesDShort')}}</strong>
              </el-button>
            </el-tooltip>
          </el-button-group><!-- /map buttons -->
          <!-- map legend -->
          <div class="map-legend"
               v-if="legend.length">
            <strong>{{$t('visualizations.top10')}}</strong>&nbsp;
            <span v-for="(item, key) in legend"
                  :key="key"
                  class="legend-item"
                  :style="{'background-color':item.color}">
                {{ item.name }}
                ({{ item.value | commaString }})
              </span>
          </div> <!-- map legend -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// map imports
import '../../../../public/jquery-jvectormap-1.2.2.min.js';
import '../../../../public/jquery-jvectormap-world-en.js';
import '../../../../public/flot-0.7/jquery.flot.resize';
import '../../../../public/flot-0.7/jquery.flot.stack';

import '../../../../public/flot-0.7/jquery.flot';
import '../../../../public/flot-0.7/jquery.flot.selection';
import '../../../../public/flot-0.7/jquery.flot.navigate';

let landColorDark;
let landColorLight;

let timeout;
// let basePath;

export default {
  name: 'WorldMap',
  props: {
    mapData: Object,
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
      map: undefined,
      mapEl: undefined,
      legend: [],
      mapExpanded: false,
      height: $(window).height() - 324
    };
  },
  watch: {
    src: function (newVal, oldVal) {
      this.setupMapData(this.mapData);
    },
    dst: function (newVal, oldVal) {
      this.setupMapData(this.mapData);
    },
    mapData: function (newVal, oldVal) {
      if (newVal && oldVal) {
        this.setupMapData(); // setup this.mapData
      }
    }
  },
  created: function () {
    const styles = window.getComputedStyle(document.body);
    landColorDark = styles.getPropertyValue('--color-land-dark').trim();
    landColorLight = styles.getPropertyValue('--color-land-light').trim();

    if (!landColorDark || !landColorLight) {
      landColorDark = styles.getPropertyValue('--color-primary-dark').trim();
      landColorLight = styles.getPropertyValue('--color-primary-lightest').trim();
    }
  },
  mounted: function () {
    function setupMapAndGraph (that) {
      // create map
      that.displayMap();
    }

    // basePath = this.$route.path.split('/')[1];

    if (this.primary) {
      setupMapAndGraph(this);
    } else { // wait for values in store to be accessible
      let id = parseInt(this.id);
      setTimeout(() => { setupMapAndGraph(this); }, id * 100);
    }
  },
  computed: {
    src: {
      get: function (value) {
        return this.$store.state.mapSrc;
      },
      set: function (newValue) {
        if (this.primary) {
          this.$store.commit('toggleMapSrc', newValue);
        }
      }
    },
    dst: {
      get: function (value) {
        return this.$store.state.mapDst;
      },
      set: function (newValue) {
        if (this.primary) {
          this.$store.commit('toggleMapDst', newValue);
        }
      }
    }
  },
  methods: {
    /* exposed functions --------------------------------------------------- */
    /* exposed MAP functions */
    toggleMapSize: function () {
      this.mapExpanded = !this.mapExpanded;
      if (this.mapExpanded) {
        this.expandMapElement();
        $(document).on('mouseup', this.isOutsideClick);
      } else {
        this.shrinkMapElement();
        $(document).off('mouseup', this.isOutsideClick);
      }
    },
    toggleSrcDst: function (type) {
      if (this.primary) { // primary map sets all other map's src/dst
        this[type] = !this[type];
      }
    },
    /* helper functions ---------------------------------------------------- */
    debounce: function (func, funcParam, ms) {
      if (timeout) { clearTimeout(timeout); }

      timeout = setTimeout(() => {
        func(funcParam);
      }, ms);
    },
    /* helper MAP functions */
    onMapResize: function () {
      if (this.mapExpanded) {
        $(this.mapEl).css({
          position: 'fixed',
          // left: '8px',
          left: '36px',
          top: '36px',
          'z-index': 5,
          width: $(window).width(),
          height: $(window).height()
        });
      }
    },
    expandMapElement: function () {
      // onMapResize function expandes the map
      $(this.mapEl).resize();
    },
    shrinkMapElement: function () {
      $(this.mapEl).css({
        position: 'absolute',
        left: '8px',
        'z-index': 5,
        top: '0',
        // width: 'calc(100% - 36px)',
        height: $(window).height() - 324
      });
    },
    isOutsideClick: function (e) {
      let element = $('#worldMap');
      if (!$(element).is(e.target) &&
        $(element).has(e.target).length === 0) {
        this.mapExpanded = false;
        this.shrinkMapElement();
      }
    },
    displayMap: function () {
      this.setupMapElement();
      // setup map data
      this.setupMapData();
    },
    setupMapElement: function () {
      this.mapEl = $('#molochMap' + this.id);

      // watch for the window to resize to resize the expanded map
      window.addEventListener('resize', this.onMapResize, { passive: true });
      // watch for the map to resize to change its style
      $(this.mapEl).on('resize', this.onMapResize);
      $(this.mapEl).vectorMap({ // setup map
        map: 'world_en',
        backgroundColor: '#fff',
        regionStyle: {
          initial: {
            fill: '#ccc'
          },
          hover: {
            fill: 'yellow'
          }
        },
        hoverOpacity: 0.7,
        series: {
          regions: [{
            scale: [ '#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea' ],
            normalizeFunction: 'polynomial',
            attribute: 'fill'
          }]
        },
        onRegionLabelShow: (e, el, code) => {
          el.html(el.html() + ' (' + code + ') - ' +
            this.$options.filters.commaString(this.map.series.regions[0].values[code] || 0));
        },
        onRegionClick: (e, code) => {
          this.$store.commit('addToExpression', {
            expression: `country == ${code}`
          });
          /* eslint-disable no-undef */
          if (worldToChina && code === 'CN') {
            this.$router.push({ name: 'chinamap', query: this.$store.state.menu.chinamap.query, params: { nav: true } });
            $('.jvectormap-label').remove();
          }
        }
      });

      // save reference to the map object to retrieve regions
      this.map = $(this.mapEl).children('.jvectormap-container').data('mapObject');
    },
    setupMapData: function () {
      this.map.series.regions[0].clear();
      delete this.map.series.regions[0].params.min;
      delete this.map.series.regions[0].params.max;
      if (this.src && this.dst) {
        if (!this.mapData.tot) {
          this.mapData.tot = {};
          let k;
          for (k in this.mapData.src) {
            this.mapData.tot[k] = this.mapData.src[k];
          }

          for (k in this.mapData.dst) {
            if (this.mapData.tot[k]) {
              this.mapData.tot[k] += this.mapData.dst[k];
            } else {
              this.mapData.tot[k] = this.mapData.dst[k];
            }
          }
        }
        this.map.series.regions[0].setValues(this.mapData.tot);
      } else if (this.src) {
        this.map.series.regions[0].setValues(this.mapData.src);
      } else if (this.dst) {
        this.map.series.regions[0].setValues(this.mapData.dst);
      }
      let region = this.map.series.regions[0];
      this.legend = [];
      for (var key in region.values) {
        if (region.values.hasOwnProperty(key) &&
          region.elements.hasOwnProperty(key)) {
          this.legend.push({
            name: key,
            value: region.values[key],
            color: region.elements[key].element.properties.fill
          });
        }
      }
      this.legend.sort((a, b) => {
        return b.value - a.value;
      });

      this.legend = this.legend.slice(0, 10); // get top 10
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
/* map styles ---------------------- */
.moloch-map-container{
  height: 100%;
}
.inline-map .moloch-map-container > .moloch-map {
  z-index: 3;
  width: 100%;
  height: 100%;
  margin-bottom: -25px;
}

.jvectormap-container {
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
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

/* legend (top 10) */
.moloch-map-container .map-legend {
  max-width: 94%;
  margin-left: 4px;
  font-size: .8rem;
  position: fixed;
  bottom: 22px;
  right: 16px;
  z-index: 996;
  padding: 0 0 2px 4px;
  border-radius: 4px;
  background-color: #fff;
}

.moloch-map-container .map-legend .legend-item {
  display: inline-block;
  margin-right: 4px;
  margin-top: 2px;
  border-radius: 2px;
  padding: 2px 4px;
  color: #fff;
  text-shadow: 1px 1px 0 #333,
  -1px -1px 0 #333,
  1px -1px 0 #333,
  -1px 1px 0 #333,
  1px 1px 3px rgba(0,0,0,0.65);
}

.moloch-map-container .map-legend strong {
  color: #000;
}

/* make graph labels smaller */
.tickLabels .tickLabel {
  font-size: smaller;
}
</style>

<style scoped>
#worldMap{
  height: 100%;
}
.inline-map {
  width: 100%;
  height: 100%;
  /*float: right;*/
  position: relative;
}

.map-invisible .inline-map {
  visibility: hidden;
  width: 5px !important;
}

.btn-close-map {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 998;
}

.btn-expand-map {
  position: absolute;
  top: 26px;
  right: 2px;
  z-index: 998;
}

/* show the buttons on top of the map */
/*.expanded .src-dst-btns,*/
.expanded .btn-close-map,
.expanded .btn-expand-map {
  z-index : 6;
}
</style>
