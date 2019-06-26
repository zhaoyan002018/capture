<template>
  <div id="newReport">
    <div class="head">表单</div>
    <div>
      <div class="allSameCss">
        <ve-line :data="firstLine" :extend="firstExtend"></ve-line>
      </div>
      <div class="allSameCss">
        <ve-line :data="secondLine" :extend="firstExtend" :settings="secondSettings"></ve-line>
      </div>
      <div class="allSameCss">
        <ve-line :data="thirdLine" :extend="thirdExtend"></ve-line>
      </div>
      <div class="allSameCss">
        <ve-line :data="firstLine" :extend="fourExtend"></ve-line>
      </div>
    </div>
    <div>
      <div class="allSameCss">
        <ve-histogram :data="viFirstData" :extend="viFirstExtend"></ve-histogram>
      </div>
      <div class="allSameCss">
        <ve-histogram :data="viSecondData" :extend="viSecondExtend"></ve-histogram>
        <!--<ve-line :data="viSecond_Data"></ve-line>-->
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: 'DpsReport',
  data () {
    this.viSecondExtend = {
      axisLabel: {
        color: '#fff'
      },
      yAxis: [{
        type: 'value',
        name: '数值',
        position: 'left'
      }, {
        type: 'value',
        name: '比率',
        position: 'right',
        min: 0,
        max: 1
      }],
      series: [
        {}, {}
      ]
    };
    this.viFirstExtend = {
      axisLabel: {
        color: '#fff'
      }
    };
    this.fourExtend = {
      axisLabel: {
        color: '#fff'
      },
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    };
    this.thirdExtend = {
      axisLabel: {
        color: '#fff'
      }
    };
    this.secondSettings = {
      area: true
    };
    this.firstExtend = {
      axisLabel: {
        color: '#fff'
      }
    };
    return {
      // 第一个图表 普通线形图
      firstLine: {
        columns: ['日期', '有效的攻击次数', '所有被检测到攻击数'],
        rows: [
          {'日期': '1.1', '有效的攻击次数': '10', '所有被检测到攻击数': '10'},
          {'日期': '1.2', '有效的攻击次数': '50', '所有被检测到攻击数': '100'},
          {'日期': '1.3', '有效的攻击次数': '40', '所有被检测到攻击数': '50'},
          {'日期': '1.4', '有效的攻击次数': '15', '所有被检测到攻击数': '60'},
          {'日期': '1.5', '有效的攻击次数': '1', '所有被检测到攻击数': '10'}
        ]
      },
      // 第二个图表 面积图
      secondLine: {
        columns: ['日期', '有效的攻击次数'],
        rows: [
          {'日期': '1.1', '有效的攻击次数': '10'},
          {'日期': '1.2', '有效的攻击次数': '50'},
          {'日期': '1.3', '有效的攻击次数': '40'},
          {'日期': '1.4', '有效的攻击次数': '15'},
          {'日期': '1.5', '有效的攻击次数': '1'}
        ]
      },
      // 第三个图表 时间线形图
      thirdLine: {
        columns: ['时间', '攻击次数'],
        rows: []
      },
      thirdRows: [
        ['00', 421965],
        ['01', 893005],
        ['02', 1202788],
        ['03', 1040020],
        ['04', 989665],
        ['05', 1124970],
        ['06', 954096],
        ['07', 1096254],
        ['08', 1035489],
        ['09', 1031156],
        ['10', 1098096],
        ['11', 787596],
        ['12', 999379],
        ['13', 787298],
        ['14', 934534],
        ['15', 419625],
        ['16', 354515],
        ['17', 372338],
        ['18', 616790],
        ['19', 408467],
        ['20', 482709],
        ['21', 362063],
        ['22', 544621],
        ['23', 451043]
      ],
      // 第一个柱状图
      viFirstData: {
        columns: ['时间', '数量'],
        rows: []
      },
      viFirstRows: [
        [7, 54],
        [8, 756],
        [9, 543],
        [10, 837],
        [11, 345],
        [12, 837],
        [13, 564],
        [14, 1564],
        [15, 156],
        [16, 2875],
        [17, 546]],
      // 第二个柱状图 柱状图+折线图
      viSecondData: {
        columns: ['区县', '人口数（求和）', '建档数（求和）', '完整数（求和）', '建档率（求和）', '完整率（求和）'],
        cols: ['区县', '建档率（求和）', '完整率（求和）', '人口数（求和）', '建档数（求和）', '完整数（求和）'],
        rows: []
      },
      viSecondRows: [
        ['永康市', 0.23, 0.3, 9936, 188449, 55348],
        ['武义县', 0.53, 0.89, 99076, 549624, 722301],
        ['兰溪市', 0.52, 0.47, 116802, 668675, 163694],
        ['义乌市', 0.31, 0.99, 125878, 285084, 522218],
        ['金东区', 0.11, 0.07, 162433, 376610, 86742],
        ['浦江县', 0.75, 0, 354812, 176817, 143925],
        ['磐安县', 0.65, 0.82, 520753, 286595, 720352],
        ['婺城区', 0.13, 0.96, 810477, 52436, 654632],
        ['金华市', 0.28, 0.18, 819931, 693752, 73553],
        ['东阳市', 0.53, 0.72, 839319, 374740, 890305]
      ],
      viSecond_Data: {
        columns: ['区县', '建档率（求和）', '完整率（求和）'],
        rows: []
      }
    };
  },
  mounted () {
    this.changeThirdData();
    this.changeFourData();
    this.changeViSecondData();
  },
  methods: {
    changeData: function (col, rows) {
      let endArr = [];
      for (let i in rows) {
        let obj = {};
        for (let j in col) {
          obj[col[j]] = rows[i][j];
        }
        endArr.push(obj);
      }
      return endArr;
    },
    changeThirdData: function () {
      this.thirdLine['rows'] = this.changeData(this.thirdLine['columns'], this.thirdRows);
    },
    changeFourData: function () {
      this.viFirstData['rows'] = this.changeData(this.viFirstData['columns'], this.viFirstRows);
    },
    changeViSecondData: function () {
      this.viSecondData['rows'] = this.changeData(this.viSecondData['cols'], this.viSecondRows);
      this.viSecond_Data['rows'] = this.changeData(this.viSecond_Data['columns'], this.viSecondRows);
    }
  }
};
</script>
<style scoped>
  #newReport{
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../assets/bgReport.jpg');
    padding: 10px;
  }
  .head{
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 30px;
    font-weight: 900;
    color: #fff;
    text-align: center;
    vertical-align: top;
    border: 1px solid #CCCCCC;
  }
  .allSameCss{
    width:350px;
    height: 350px;
    display: inline-block;
  }
</style>
