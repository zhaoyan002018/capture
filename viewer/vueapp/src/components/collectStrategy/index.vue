<template>
  <div>
    <div class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <moloch-paging v-if="showData"
                       :records-total="recordsTotal"
                       :records-filtered="recordsFiltered"
                       v-on:changePaging="changePaging"
                       length-default=500 >
        </moloch-paging>
        <!--<div style="position: absolute;">-->
        <!--<el-date-picker-->
        <!--v-model="timeRange"-->
        <!--type="datetimerange"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
        <!--</div>-->
      </div>
    </div>
    <dps-table
      v-if="!loading"
      :data="data"
      :title="title"
      :columns="columns"
      :btn="btn"
      :getList="getList"
      :Dialog="true"
      :dialogText="dialogText"
      :cardData="cardData"
      :temp="temp"
      :cardDataArr="cardDataArr"
      dialogWidth="610px"
      :isCollectPage="true"
      :handleCreate="handleCreate"
      :joinProto="joinProto"
      :handleUpdate="handleUpdate"
      :handleChangeState="handleChangeState"
      :handleDelete="handleDelete">
    </dps-table>
    <!-- loading overlay -->
    <moloch-loading
      v-if="loading && !error">
    </moloch-loading> <!-- /loading overlay -->
  </div>
</template>

<script>
import MolochPaging from '../utils/Pagination';
import MolochLoading from '../utils/Loading';
// import DpsTable from '@/components/dpsTable/index';
import DpsTable from '@/components/dpsTable/index';
import { fetcharticle, deleteacticle, createArticle, updatearticle } from '@/api/article';
import { notify } from '../../api/validate';

export default{
  name: 'collectStrategy',
  data () {
    // const dps = this;
    return {
      data: [],
      error: '',
      loading: false,
      query: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null
      },
      title: '采集策略',
      columns: [
        { name: '序号', title: 'id', width: '94' },
        { name: '名称', title: 'name' },
        { name: '过滤协议', title: 'proto', type: 'obj', output: 'string', subName: 'proto' },
        { name: '端口规则', title: 'port', type: 'obj', width: '327', output: 'arrString', subName: { srcPort: '源端口', dstPort: '目的端口' } },
        { name: '地址规则', title: 'addr', type: 'obj', width: '327', output: 'arrString', subName: { srcIp: '源IP', dstIp: '目的IP' } },
        { name: '状态', title: 'enabled', type: 'boolean', subName: ['启用', '禁用'], subColor: ['#0f0', '#f00'], label: 'button', className: ['el-icon-check', 'el-icon-error'] },
        { name: '操作', title: 'action', type: 'card', action: [{ name: 'edit' }, { name: 'del' }] }
      ],
      btn: {
        isRefresh: true,
        isHandleCreate: true
      },
      showData: [],
      recordsTotal: undefined,
      recordsFiltered: undefined,
      dialogText: [
        { name: '名称', title: 'name', type: 'input' },
        { name: '启用', title: 'enabled', type: 'checkbox' }
      ],
      cardData: [
        {
          index: 'proto',
          name: '协议规则',
          title: 'proto',
          type: 'table',
          content: [
            { name: 'HTTP', brief: '超文本传输协议' },
            { name: 'FTP', brief: '文件传输协议' },
            { name: 'telNet', brief: 'Internet的远程登录协议' },
            { name: 'pop3', brief: '邮局协议版本3' },
            { name: 'SMTP', brief: '简单邮件传输协议' },
            { name: 'DNS', brief: '域名系统' }],
          columns: [
            { name: '接收', title: 'receive', type: 'radio', label: 'or' },
            { name: '拒收', title: 'rejection', type: 'radio', label: 'not' },
            { name: '协议', title: 'name' },
            { name: '简介', title: 'brief' }]
        }, {
          index: 'port',
          name: '端口规则',
          title: 'port',
          type: 'form-Two',
          Content: [
            { name: '源端口', title: 'srcPort', type: 'input', label: 'srcPort', subTitle: 'port' },
            { name: '目的端口', title: 'dstPort', type: 'input', label: 'dstPort', subTitle: 'port' }
          ],
          Columns: [
            { name: '允许', title: 'receive', type: 'radio', label: 'or', width: 70 },
            { name: '排除', title: 'rejection', type: 'radio', label: 'not', width: 70 }
          ]
        }, {
          index: 'addr',
          name: '地址规则',
          title: 'addr',
          type: 'form-Two',
          Content: [
            { name: '源IP', title: 'srcIp', type: 'text', label: 'srcIp', subTitle: 'ip' },
            { name: '目的IP', title: 'dstIp', type: 'text', label: 'dstIp', subTitle: 'ip' }
          ],
          Columns: [
            { name: '允许', title: 'receive', type: 'input', label: 'or', width: 70 },
            { name: '排除', title: 'rejection', type: 'input', label: 'not', width: 70 }
          ]
        }],
      cardDataArr: ['proto'],
      temp: {
        port: {
          srcPort: {
            or: [],
            not: []
          },
          dstPort: {
            or: [],
            not: []
          }
        },
        addr: {
          srcIp: {
            or: [],
            not: []
          },
          dstIp: {
            or: [],
            not: []
          }
        },
        proto: {
          or: [],
          not: []
        }
      }
    };
  },
  components: {
    MolochPaging,
    MolochLoading,
    DpsTable
  },
  computed: {
  },
  mounted () {
    this.getList();
  },
  methods: {
    joinProto (str) {
      let result = '';
      for (let i in str) {
        if (str[i].length) {
          if (i === 'or') {
            if (result) {
              result += '||';
            }
            result += str[i].join('||');
          } else if (i === 'not') {
            result += '!';
            result += str[i].join('!');
          }
        }
      }
      result.replace(/[!(|{2})]$/g, '');
      return result;
    },
    getList: function () {
      this.loading = true;
      fetcharticle(this.query, 'collectStrategy').then((res) => {
        this.data = res.data.items;
        this.recordsTotal = res.data.total;
        this.recordsFiltered = res.data.total;
        this.loading = false;
      });
    },
    handleChangeState: function (arr) {
      let [temp, state] = arr;
      if (arr.length > 0) {
        temp.enabled = state;
      }
      temp = this.changeData(temp);
      updatearticle(temp, 'collectStrategy').then((res) => {
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.getList();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    changeData (temp) {
      return temp;
    },
    handleUpdate: function (temp) {
      updatearticle(temp, 'collectStrategy').then((res) => {
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.getList();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    handleCreate: function (temp) {
      createArticle(temp, 'collectStrategy').then((res) => {
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.getList();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    handleDelete: function (temp) {
      deleteacticle(temp, 'collectStrategy').then((res) => {
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.getList();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    changePaging: function (pagingValues) {
      this.query.length = pagingValues.length;
      this.query.start = pagingValues.start;
      this.getList();
    }
  }
};

</script>

<style scoped>

</style>
