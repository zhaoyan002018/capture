<template>
<div id="Map">
  <div class="inline-map">
    <!--<div v-if="mapData">-->
    <div v-if="true" style="height: 100%;">
      <div class="moloch-map-container">
        <!-- map -->
        <div class="moloch-map" id="chinaMap">
        </div> <!-- /map -->

        <el-tooltip :content="$t('visualizations.expandCollapseMapTip')"
                    placement="top">
          <el-button @click="toggleMapSize"
                     :class="{'btn-expand-map':primary,'btn-close-map':!primary,}">
            <span class="fa"
                  :class="{'fa-expand':!mapExpanded,'fa-compress':mapExpanded}">
            </span>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import echarts from 'echarts';
import 'echarts/map/js/china.js';
import 'echarts/map/js/province/hebei';

export default {
  name: 'MyMap',
  props: {
    primary: Boolean
  },
  data () {
    return {
      mydata: [
        { name: '北京', value: '100' }, { name: '天津', value: this.randomData() },
        { name: '上海', value: this.randomData() }, { name: '重庆', value: this.randomData() },
        { name: '河北', value: this.randomData() }, { name: '河南', value: this.randomData() },
        { name: '云南', value: this.randomData() }, { name: '辽宁', value: this.randomData() },
        { name: '黑龙江', value: this.randomData() }, { name: '湖南', value: this.randomData() },
        { name: '安徽', value: this.randomData() }, { name: '山东', value: this.randomData() },
        { name: '新疆', value: this.randomData() }, { name: '江苏', value: this.randomData() },
        { name: '浙江', value: this.randomData() }, { name: '江西', value: this.randomData() },
        { name: '湖北', value: this.randomData() }, { name: '广西', value: this.randomData() },
        { name: '甘肃', value: this.randomData() }, { name: '山西', value: this.randomData() },
        { name: '内蒙古', value: this.randomData() }, { name: '陕西', value: this.randomData() },
        { name: '吉林', value: this.randomData() }, { name: '福建', value: this.randomData() },
        { name: '贵州', value: this.randomData() }, { name: '广东', value: this.randomData() },
        { name: '青海', value: this.randomData() }, { name: '西藏', value: this.randomData() },
        { name: '四川', value: this.randomData() }, { name: '宁夏', value: this.randomData() },
        { name: '海南', value: this.randomData() }, { name: '台湾', value: this.randomData() },
        { name: '香港', value: this.randomData() }, { name: '澳门', value: this.randomData() }
      ],
      chart: null,
      mapExpanded: false
    };
  },
  mounted () {
    this.setupChart();
    window.addEventListener('resize', this.onMapResize, { passive: true });
  },
  methods: {
    setupChart () {
      const that = this;
      this.mapEl = $('#chinaMap');
      this.chart = echarts.init(document.getElementById('chinaMap'));
      // watch for the window to resize to resize the expanded map
      window.addEventListener('resize', this.onMapResize, { passive: true });
      // watch for the map to resize to change its style
      $(this.mapEl).on('resize', this.onMapResize);
      this.chart.resize();
      const Mydata = this.mydata;
      this.chart.setOption({
        backgroundColor: '#fcfcfc',
        tooltip: {
          trigger: 'item'
        },
        // 左侧小导航图标
        visualMap: {
          show: false,
          x: 'left',
          y: 'center',
          splitList: [
            { start: 500, end: 600 }, { start: 400, end: 500 },
            { start: 300, end: 400 }, { start: 200, end: 300 },
            { start: 100, end: 200 }, { start: 0, end: 100 }
          ],
          color: ['#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea']
        },
        // 配置属性
        series: [{
          name: '数据',
          type: 'map',
          mapType: 'china',
          roam: true,
          label: {
            normal: {
              show: true // 省份名称
            },
            emphasis: {
              show: false
            }
          },
          data: Mydata // 数据
        }]
      });
      // 处理点击事件并且跳转到相应的百度搜索页面
      this.chart.on('click', function (params) {
        // window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
        // params 是一个对象
        that.$store.commit('addToExpression', {
          expression: `province == ${params.name}`
        });
      });
    },
    randomData () {
      return Math.round(Math.random() * 500);
    },
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
    expandMapElement: function () {
      // onMapResize function expandes the map
      $(this.mapEl).resize();
      this.chart.resize();
    },
    shrinkMapElement: function () {
      $(this.mapEl).css({
        position: '',
        width: $(window).width() - 36,
        height: $(window).height() - 345
      });
      this.chart.resize();
    },
    isOutsideClick: function (e) {
      let element = $('#Map');
      if (!$(element).is(e.target) &&
        $(element).has(e.target).length === 0) {
        this.mapExpanded = false;
        this.shrinkMapElement();
      }
    },
    /* helper MAP functions */
    onMapResize: function () {
      if (this.mapExpanded) {
        $(this.mapEl).css({
          position: 'fixed',
          top: 0,
          'z-index': '5',
          width: $(window).width(),
          height: $(window).height()
        });
      }
    }
  }
};
</script>

<style>
/* map styles ---------------------- */
.inline-map .moloch-map-container > .moloch-map {
  width: 100%;
  height: 100%;
  z-index: 3;
}

.moloch-map-container {
  height: 100%;
}

/*!* legend (top 10) *!*/
/*.moloch-map-container .map-legend {*/
  /*max-width: 94%;*/
  /*margin-left: 4px;*/
  /*font-size: .8rem;*/
  /*position: fixed;*/
  /*bottom: 22px;*/
  /*right: 16px;*/
  /*z-index: 996;*/
  /*padding: 0 0 2px 4px;*/
  /*border-radius: 4px;*/
  /*background-color: #fff;*/
/*}*/

/*.moloch-map-container .map-legend .legend-item {*/
  /*display: inline-block;*/
  /*margin-right: 4px;*/
  /*margin-top: 2px;*/
  /*border-radius: 2px;*/
  /*padding: 2px 4px;*/
  /*color: #fff;*/
  /*text-shadow: 1px 1px 0 #333,*/
  /*-1px -1px 0 #333,*/
  /*1px -1px 0 #333,*/
  /*-1px 1px 0 #333,*/
  /*1px 1px 3px rgba(0, 0, 0, 0.65);*/
/*}*/

/*.moloch-map-container .map-legend strong {*/
  /*color: #000;*/
/*}*/
</style>

<style scoped>
#Map {
  height: 100%;
}

.inline-map {
  width: 100%;
  height: 100%;
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
</style>
