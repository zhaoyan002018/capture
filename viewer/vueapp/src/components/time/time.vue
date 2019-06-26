<template>
  <div class="app-container">
    <div class="timeSet">时间配置</div>
    <div class="timeBody">
      <el-radio v-model="radio" label="1" class="radio" style="padding-left: 40px">手动设置</el-radio>
      <el-form :disabled="!disabled" label-width="80px" style="position: relative;height: 200px" >
        <div class="time">
          <el-form-item label="时区" >
            <el-select v-model="timeZone" style="width: 370px;">
              <el-option v-for="item in timezone" :key="item.name" :label="item.name" :value="item.option" style="width: 370px;" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="time" type="datetime" placeholder="选择日期时间" style="width: 370px;"/>
          </el-form-item>
        </div>
      </el-form>
      <el-radio v-model="radio" label="2" class="radio" style="padding-left: 40px;">NTP同步</el-radio>
      <el-form label-width="80px" style="position: relative;height: 100px">
        <div>
          <el-form-item label="服务器" class="time" >
            <el-select
              :disabled="disabled"
              v-model="myNTP"
              filterable
              allow-create
              default-first-option
              class="select"
              style="width: 370px;">
              <el-option v-for="item in servers" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-button size="mini" type="info" plain style="margin-left: 60% ;" @click="Confirm()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { Timesync } from '@/api/article';
import { isContinue, notify } from '@/api/validate';

export default {
  data () {
    return {
      radio: '1',
      time: '',
      servers: ['time.nist.gov', 'time.windows.com', 'time-nw.nist.gov', 'time-a.nist.gov', 'time-b.nist.gov'],
      disabled: true,
      timezone: [
        { name: '(UTC-12:00) 国际日期变更线西', option: 'Etc/GMT+12' },
        { name: '(UTC-11:00) 协调世界时-11', option: 'Etc/GMT+11' },
        { name: '(UTC-10:00) 夏威夷', option: 'Pacific/Honolulu' },
        { name: '(UTC-09:00) 安克雷奇', option: 'America/Anchorage' },
        { name: '(UTC-08:00) 下加利福尼亚州', option: 'America/Santa_Isabel' },
        { name: '(UTC-08:00) 太平洋时间（美国和加拿大)', option: 'America/Los_Angeles' },
        { name: '(UTC-07:00) 奇瓦瓦, 拉巴斯, 马萨特兰', option: 'America/Chihuahua' },
        { name: '(UTC-07:00) 亚利桑那', option: 'America/Phoenix' },
        { name: '(UTC-07:00) 山地时间（美国和加拿大）', option: 'America/Denver' },
        { name: '(UTC-06:00) 中美洲', option: 'America/Guatemala' },
        { name: '(UTC-06:00) 中部时间（美国和加拿大）', option: 'America/Chicago' },
        { name: '(UTC-06:00) 萨斯喀彻温', option: 'America/Regina' },
        { name: '(UTC-06:00) 瓜达拉哈拉, 墨西哥城, 蒙特雷', option: 'America/Mexico_City' },
        { name: '(UTC-05:00) 波哥大, 利马, 基多', option: 'America/Bogota' },
        { name: '(UTC-05:00) 印地安那州（东部）', option: 'America/Indiana/Indianapolis' },
        { name: '(UTC-05:00) 东部时间（美国和加拿大）', option: 'America/New_York' },
        { name: '(UTC-04:30) 加拉加斯', option: 'America/Caracas' },
        { name: '(UTC-04:00) 大西洋时间（加拿大）', option: 'America/Halifax' },
        { name: '(UTC-04:00) 亚松森', option: 'America/Asuncion' },
        { name: '(UTC-04:00) 乔治敦, 拉巴斯, 马瑙斯, 圣胡安', option: 'America/La_Paz' },
        { name: '(UTC-04:00) 库亚巴', option: 'America/Cuiaba' },
        { name: '(UTC-04:00) 圣地亚哥', option: 'America/Santiago' },
        { name: '(UTC-03:30) 纽芬兰', option: 'America/St_Johns' },
        { name: '(UTC-03:00) 巴西利亚', option: 'America/Sao_Paulo' },
        { name: '(UTC-03:00) 格陵兰', option: 'America/Godthab' },
        { name: '(UTC-03:00) 卡宴, 福塔雷萨', option: 'America/Cayenne' },
        { name: '(UTC-03:00) 布宜诺斯艾利斯', option: 'America/Argentina/Buenos_Aires' },
        { name: '(UTC-03:00) 蒙得维的亚', option: 'America/Montevideo' },
        { name: '(UTC-02:00) 协调世界时-2', option: 'Etc/GMT+2' },
        { name: '(UTC-01:00) 佛得角群岛', option: 'Atlantic/Cape_Verde' },
        { name: '(UTC-01:00) 亚速尔群岛', option: 'Atlantic/Azores' },
        { name: '(UTC+00:00) 卡萨布兰卡', option: 'Africa/Casablanca' },
        { name: '(UTC+00:00) 蒙罗维亚, 雷克雅未克', option: 'Atlantic/Reykjavik' },
        { name: '(UTC+00:00) 都柏林, 爱丁堡, 里斯本, 伦敦', option: 'Europe/London' },
        { name: '(UTC+00:00) 协调世界时', option: 'Etc/GMT' },
        { name: '(UTC+01:00) 阿姆斯特丹, 柏林, 伯尔尼, 罗马, 斯德哥尔摩, 维也纳', option: 'Europe/Berlin' },
        { name: '(UTC+01:00) 布鲁塞尔, 哥本哈根, 马德里, 巴黎', option: 'Europe/Paris' },
        { name: '(UTC+01:00) 中非西部', option: 'Africa/Lagos' },
        { name: '(UTC+01:00) 贝尔格莱德, 布拉迪斯拉发, 布达佩斯, 卢布尔雅那, 布拉格', option: 'Europe/Budapest' },
        { name: '(UTC+01:00) 萨拉热窝, 斯科普里, 华沙, 萨格勒布', option: 'Europe/Warsaw' },
        { name: '(UTC+01:00) 温得和克', option: 'Africa/Windhoek' },
        { name: '(UTC+02:00) 雅典, 布加勒斯特, 伊斯坦布尔', option: 'Europe/Istanbul' },
        { name: '(UTC+02:00) 赫尔辛基, 基辅, 里加, 索非亚, 塔林, 维尔纽斯', option: 'Europe/Kiev' },
        { name: '(UTC+02:00) 开罗', option: 'Africa/Cairo' },
        { name: '(UTC+02:00) 大马士革', option: 'Asia/Damascus' },
        { name: '(UTC+02:00) 安曼', option: 'Asia/Amman' },
        { name: '(UTC+02:00) 哈拉雷, 比勒陀利亚', option: 'Africa/Johannesburg' },
        { name: '(UTC+02:00) 耶路撒冷', option: 'Asia/Jerusalem' },
        { name: '(UTC+02:00) 贝鲁特', option: 'Asia/Beirut' },
        { name: '(UTC+03:00) 巴格达', option: 'Asia/Baghdad' },
        { name: '(UTC+03:00) 明斯克', option: 'Europe/Minsk' },
        { name: '(UTC+03:00) 利雅得', option: 'Asia/Riyadh' },
        { name: '(UTC+03:00) 内罗毕', option: 'Africa/Nairobi' },
        { name: '(UTC+03:30) 德黑兰', option: 'Asia/Tehran' },
        { name: '(UTC+04:00) 莫斯科, 圣彼得堡, 伏尔加格勒', option: 'Europe/Moscow' },
        { name: '(UTC+04:00) 第比利斯', option: 'Asia/Tbilisi' },
        { name: '(UTC+04:00) 埃里温', option: 'Asia/Yerevan' },
        { name: '(UTC+04:00) 阿布扎比, 马斯喀特', option: 'Asia/Dubai' },
        { name: '(UTC+04:00) 巴库', option: 'Asia/Baku' },
        { name: '(UTC+04:00) 路易港', option: 'Indian/Mauritius' },
        { name: '(UTC+04:30) 喀布尔', option: 'Asia/Kabul' },
        { name: '(UTC+05:00) 塔什干', option: 'Asia/Tashkent' },
        { name: '(UTC+05:00) 伊斯兰堡, 卡拉奇', option: 'Asia/Karachi' },
        { name: '(UTC+05:30) 斯里加亚渥登普拉', option: 'Asia/Colombo' },
        { name: '(UTC+05:30) 钦奈, 加尔各答, 孟买, 新德里', option: 'Asia/Kolkata' },
        { name: '(UTC+05:45) 加德满都', option: 'Asia/Kathmandu' },
        { name: '(UTC+06:00) 阿斯塔纳', option: 'Asia/Almaty' },
        { name: '(UTC+06:00) 达卡', option: 'Asia/Dhaka' },
        { name: '(UTC+06:00) 叶卡捷琳堡', option: 'Asia/Yekaterinburg' },
        { name: '(UTC+06:30) 仰光', option: 'Asia/Rangoon' },
        { name: '(UTC+07:00) 曼谷, 河内, 雅加达', option: 'Asia/Bangkok' },
        { name: '(UTC+07:00) 新西伯利亚', option: 'Asia/Novosibirsk' },
        { name: '(UTC+08:00) 克拉斯诺亚尔斯克', option: 'Asia/Krasnoyarsk' },
        { name: '(UTC+08:00) 乌兰巴托', option: 'Asia/Ulaanbaatar' },
        { name: '(UTC+08:00) 北京, 重庆, 香港特别行政区, 乌鲁木齐', option: 'Asia/Shanghai' },
        { name: '(UTC+08:00) 佩思', option: 'Australia/Perth' },
        { name: '(UTC+08:00) 吉隆坡, 新加坡', option: 'Asia/Singapore' },
        { name: '(UTC+08:00) 台北', option: 'Asia/Taipei' },
        { name: '(UTC+09:00) 伊尔库茨克', option: 'Asia/Irkutsk' },
        { name: '(UTC+09:00) 首尔', option: 'Asia/Seoul' },
        { name: '(UTC+09:00) 大阪, 札幌, 东京', option: 'Asia/Tokyo' },
        { name: '(UTC+09:30) 达尔文', option: 'Australia/Darwin' },
        { name: '(UTC+09:30) 阿德莱德', option: 'Australia/Adelaide' },
        { name: '(UTC+10:00) 霍巴特', option: 'Australia/Hobart' },
        { name: '(UTC+10:00) 雅库茨克', option: 'Asia/Yakutsk' },
        { name: '(UTC+10:00) 布里斯班', option: 'Australia/Brisbane' },
        { name: '(UTC+10:00) 关岛, 莫尔兹比港', option: 'Pacific/Port_Moresby' },
        { name: '(UTC+10:00) 堪培拉, 墨尔本, 悉尼', option: 'Australia/Sydney' },
        { name: '(UTC+11:00) 符拉迪沃斯托克', option: 'Asia/Vladivostok' },
        { name: '(UTC+11:00) 所罗门群岛, 新喀里多尼亚', option: 'Pacific/Guadalcanal' },
        { name: '(UTC+12:00) 协调世界时+12', option: 'Etc/GMT-12' },
        { name: '(UTC+12:00) 斐济, 马绍尔群岛', option: 'Pacific/Fiji' },
        { name: '(UTC+12:00) 马加丹', option: 'Asia/Magadan' },
        { name: '(UTC+12:00) 奥克兰, 惠灵顿', option: 'Pacific/Auckland' },
        { name: '(UTC+13:00) 努库阿洛法', option: 'Pacific/Tongatapu' },
        { name: '(UTC+13:00) 萨摩亚群岛', option: 'Pacific/Apia' }],
      timeZone: '',
      myNTP: 'time.nist.gov'
    };
  },
  mounted () {
    this.loadData();
  },
  watch: {
    radio: function (newVal, oldVal) {
      if (newVal === '1') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  methods: {
    loadData () {
      // this.disabled = true;
      this.$http.get('/gettime').then(response => {
        if (response.data.ntp_enabled) {
          this.myNTP = response.data.ntp_server;
          this.radio = '2';
        } else {
          this.radio = '1';
          this.time = response.data.timestamp;
          this.timeZone = response.data.timezone;
        }
      });
    },
    submit () {
      let msg = {};
      if (this.disabled) {
        let time = null;
        if (typeof this.time === 'number') {
          time = this.time;
        } else {
          time = this.time.getTime();
        }
        msg['timestamp'] = time;
        msg['timezone'] = this.timeZone;
        msg['ntp_enabled'] = false;
      } else {
        msg['ntp_enabled'] = true;
        msg['ntp_server'] = this.myNTP;
      }
      Timesync(msg).then(response => {
        if (response.data.success) {
          this.loadData();
          notify(this, response.data.message, 'success');
        } else {
          notify(this, response.data.message, 'error');
        }
      });
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.submit, row, '此操作会导致查询时间范围变动，请谨慎操作！');
    }
  }
};
</script>

<style>
  /*注意不需要scoped作用域*/
  .time input{
    cursor: text !important;
  }
  .radio {
    display: block;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    margin-left: 0;
    margin-top: 15px;
    line-height: 32px;
  }
  .timeSet {
    width: 150px;
    height: 35px;
    line-height:35px;
    text-align: center;
    border:1px solid #f0f0f0;
    border-bottom:#fff;
    font-size:14px;
    position:relative;
    top:1px;
    background: #ffffff;
  }
  .timeBody{
    border: 1px solid #f0f0f0;
    padding-bottom: 20px;
  }
  .time {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
