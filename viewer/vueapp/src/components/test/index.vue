<template>
  <div class="app-container">
    <pub-table
      ref="pubTable"
      title="公共组件测试"
      v-if="rowHandlesEnabled"
      :data="data"
      :columns.sync="columns"
      :btn="btn"
      :allColumns.sync="allColumns"
      :canEditColumn="canEditColumn"
      :loadData="loadData"
      :handleChangeColumn="handleChangeColumn"
      :handleEditData="handleEditData"
      :handleDel="handleDel"
      :dialog="dialog"
      :handleAdd="handleAdd"
      :rowHandle="rowHandle"
    />
    <pub-table
      v-else
      :data="data"
      :columns="columns"
    />
  </div>
</template>
<script>
import PubTable from '@/components/dpsTable/pubTable';
import { fetcharticle, updatearticle, editUpdatearticle, deleteacticle, createArticle } from '@/api/article';
import { notify } from '../../api/validate';
export default {
  data () {
    return {
      columns: undefined,
      data: undefined,
      dialog: {},
      rowHandle: {
        columnHeader: '查看详情',
        align: 'center',
        edit: {
          size: 'mini',
          text: '',
          type: 'text',
          icon: 'el-icon-edit',
          show: function (index, row) {
            if (row.showEdit) return true;
            return false;
          }
        },
        remove: {
          size: 'mini',
          type: 'text',
          text: '',
          confirm: true,
          icon: 'el-icon-close',
          show: function (index, row) {
            if (row.showRemove) return true;
            return false;
          }
        },
        custom: [{
          emit: 'detail',
          text: '查看详情',
          size: 'mini',
          type: 'text',
          show: function (index, row) {
            if (row.showDetails) return true;
            return false;
          }
        }]
      },
      rowHandlesEnabled: true,
      btn: {
        refresh: {enabled: true, value: '刷新', type: 'text', icon: 'el-icon-refresh', clickFn: () => { return this.loadData(); }},
        add: {enabled: true, value: '添加', type: 'text', icon: 'el-icon-plus', clickFn: () => { return this.handleAddDialog(); }},
        edit: {enabled: true, value: '配置表格指标', type: 'text', icon: 'el-icon-s-tools', clickFn: () => { return this.handleEditColumn(); }}
      },
      canEditColumn: true,
      allColumns: {},
      useMock: true
    };
  },
  components: {
    PubTable
  },
  created () {
    this.loadData();
  },
  methods: {
    loadData: function () {
      fetcharticle({}, 'test').then((res) => {
        console.log('res', res);
        this.data = res.data.data;
        this.columns = res.data.columns;
        this.allColumns = res.data.allColumns;
        this.getDialogData();
      }).catch((err) => {
        console.log(err);
      });
    },
    getDialogData () {
      if (Object.keys(this.allColumns).length) {
        let data = [];
        let value = [];
        Object.keys(this.allColumns).forEach((item, index) => {
          if (this.columns.indexOf(this.allColumns[item].key) >= 0) {
            value.push(index);
          }
          data.push({
            key: index,
            label: this.allColumns[item].title,
            filter: this.allColumns[item].key
          });
        });
        this.dialog = {
          data: data,
          dialogVisible: false,
          filterMethod: function (query, item) {
            return item.filter.indexOf(query) > -1;
          },
          value: value,
          titles: ['所有指标', '已选择的指标']
        };
      }
    },
    handleChangeColumn: function (val) {
      updatearticle(val, 'test').then((res) => {
        console.log('test', res);
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.loadData();
        } else {
          notify(this, res.data.message, 'error');
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    handleEditData: function (val) {
      editUpdatearticle(val, 'test').then((res) => {
        console.log('editUpdatearticle', res);
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.loadData();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    handleAddDialog: function () {
      this.$refs.pubTable.addRowWithNewTemplate();
    },
    handleEditColumn: function () {
      this.$refs.pubTable.handleEditColumn();
    },
    handleDel: function (val) {
      deleteacticle(val, 'test').then((res) => {
        console.log('res', res);
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.loadData();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    },
    handleAdd: function (val) {
      createArticle(val, 'test').then((res) => {
        if (res.data.success) {
          notify(this, res.data.message, 'success');
          this.loadData();
        } else {
          notify(this, res.data.message, 'error');
        }
      });
    }
  }
};
</script>
