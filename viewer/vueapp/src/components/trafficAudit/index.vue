<template>
  <div class="app-container">
    <div>ftp流量审计</div>
    <pub-button value="刷新" @click="loadData" type="refresh" plain icon="el-icon-refresh"/>
    <pub-table :data="data" :columns="columns" align="center">
    </pub-table>
  </div>
</template>
<script>
import PubButton from '@/components/dpsTable/pubButton';
import PubTable from '@/components/dpsTable/pubTable';
export default {
  data () {
    return {
      data: [{ ts: '15-05-2019T12:03:59', srcIp: '10.155.72.20', srcPort: 39209, dstIp: '10.1.72.161', dstPort: 12721 }],
      columns: [
        { expand: true, width: '60px' },
        { name: 'ts', title: '时间' },
        { name: 'srcIp', title: '源IP' },
        { name: 'dstIp', title: '目的IP' },
        { name: 'srcPort', title: '源端口' },
        { name: 'dstPort', title: '目的端口' },
        { name: 'action', title: '操作', message: '查看详情' }
      ]
    };
  },
  components: {
    PubButton,
    PubTable
  },
  methods: {
    loadData: function () {
      console.log('refresh');
    }
  }

};
</script>
<style scoped>

</style>
