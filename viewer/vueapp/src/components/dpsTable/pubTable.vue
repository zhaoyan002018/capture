<template>
  <div>
    <div>
      {{title}}
      <pub-btn v-for="item in btn"
               v-if="item.enabled" :key="item.value"
               class="pubBtn" :title="item.value" style="color: #409EFF"
               @click="item.clickFn" :type="item.type" plain :icon="item.icon">
      </pub-btn>
    </div>
    <d2-crud
      ref="d2Crud"
      class="pubTable"
      :columns="currentColumns"
      :options="options"
      @detail="({ index, row }) => openDetail(index, row)"
      :rowHandle="rowHandle"
      edit-title="编辑"
      :edit-template="template"
      @dialog-cancel="handleDialogCancel"
      @row-edit="handleRowEdit"
      @row-add="handleRowAdd"
      @sort-change="handleSortChange"
      @row-remove="handleRowRemove"
      :form-options="formOptions"
      :data="data">
    </d2-crud>
    <el-dialog v-if="btn && btn.edit && btn.edit.enabled"
               title="配置表格指标"
               :visible.sync="dialog.dialogVisible" width="600px">
      <div class="form">
        <el-transfer
          filterable
          :filter-methodd="dialog.filterMethod"
          filter-placeholder="请输入要搜索的指标"
          style="padding: 0 32px"
          :titles="dialog.titles"
          v-model="dialog.value"
          :data="dialog.data">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <pub-btn type="submit" icon="el-icon-circle-check" value="确定" @click="submitDialog"></pub-btn>
        <pub-btn type="cancel" icon="el-icon-circle-close" value="取消" @click="cancelDialog"></pub-btn>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PubBtn from '@/components/dpsTable/pubButton';
export default {
  data () {
    return {
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false,
        gutter: 20
      },
      dialogData: []
    };
  },
  props: {
    dialog: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {
        return {
          size: 'mini',
          highlightCurrentRow: true,
          stripe: true,
          border: true,
          emptyText: '没有匹配到数据，请刷新页面',
          headerCellStyle: { 'text-align': 'center' },
          cellStyle: { 'text-align': 'center' }
        };
      }
    },
    rowHandle: {
      type: Object,
      default: () => {}
    },
    btn: {
      type: Object,
      default: () => {}
    },
    loadData: Function,
    title: String,
    canEditColumn: {
      type: Boolean,
      default: false
    },
    allColumns: {
      type: Object,
      default: () => {}
    },
    handleChangeColumn: Function,
    handleEditData: Function,
    handleDel: Function,
    handleAdd: Function
  },
  components: {
    PubBtn
  },
  computed: {
    template: function () {
      let temp = {};
      this.currentColumns.forEach((item, index) => {
        if (!temp[item.key]) {
          temp[item.key] = {};
          temp[item.key]['title'] = item.title;
          temp[item.key]['value'] = '';
        }
      });
      return temp;
    },
    currentColumns: {
      get: function () {
        let col = JSON.parse(JSON.stringify(this.columns));
        let all = this.allColumns ? JSON.parse(JSON.stringify(this.allColumns)) : {};
        let that = this;
        let cur = [];
        col.forEach((item) => {
          switch (all[item].type) {
            case 'time': all[item].formatter = (val) => { return that.typeEqualTime(val[item]); }; break;
            case 'size': all[item].formatter = (val) => { return that.typeEqualToSize(val[item]); }; break;
            case 'bytes': all[item].formatter = (val) => { return that.typeEqualToBytes(val[item]); }; break;
            case 'object': all[item].formatter = (val) => { return that.typeEqualToObject(val[item]); }; break;
            case 'array': all[item].formatter = (val) => { return that.typeEqualToArray(val[item]); }; break;
            default: break;
          }
          cur.push(all[item]);
        });
        return cur;
      }
    }
  },
  mounted () {
    $('.pubBtn').each((num, el) => {
      $(el).css({
        'position': 'absolute',
        right: function () {
          return num * 30 + 20 + 'px';
        }
      });
    });
  },
  methods: {
    /**
     * 根据表头的type值来确定表格中显示的数据
     * type=time;type=bytes;type=size
     * */
    typeEqualTime: function (val) {
      return this.$options.filters.timezoneDateString(val, 'YYYY/MM/DD HH:mm:ss z');
    },
    typeEqualToSize: function (val) {
      return this.$options.filters.humanReadableNumber(val);
    },
    typeEqualToBytes: function (val) {
      return this.$options.filters.humanReadableBytes(val);
    },
    typeEqualToArray: function (val) {
      console.log('toArray', val);
      return val.join(';');
    },
    typeEqualToObject: function (val) {
      console.log('toObject', val);
      return val;
    },
    openDetail: function (index, row) {
      console.log('openDetail', index, row);
      // 进行ajax请求
      // 显示数据  1.显示的架构该怎么设置
    },
    handleRowEdit: function ({ index, row }, done) {
      this.formOptions.saveLoading = true;
      this.handleEditData({ index, row });
      setTimeout(() => {
        done();
        this.formOptions.saveLoading = false;
      });
    },
    handleDialogCancel: function (done) {
      this.$message({
        message: '取消编辑',
        type: 'warning'
      });
      done();
    },
    handleRowRemove: function ({ index, row }, done) {
      this.handleDel({ index, row });
      setTimeout(() => {
        done();
      }, 300);
    },
    handleRowAdd: function (row, done) {
      this.formOptions.saveLoading = true;
      setTimeout(() => {
        this.handleAdd({ row });
        done();
        this.formOptions.saveLoading = false;
      }, 300);
    },
    addRowWithNewTemplate: function () {
      this.$refs.d2Crud.showDialog({
        mode: 'add',
        rowIndex: 2,
        template: this.template
      });
    },
    handleSortChange: function (column, prop, order) {
      console.log(column, prop, order);
    },
    handleEditColumn: function () {
      console.log('handleEditColumn');
      if (this.dialog) {
        this.$nextTick(() => {
          this.dialog.dialogVisible = true;
        });
      }
    },
    submitDialog: function () {
      if (this.dialog) {
        let that = this;
        let currentColumns = [];
        this.dialog.value.forEach((item) => {
          currentColumns.push(Object.keys(that.allColumns)[item]);
        });
        this.handleChangeColumn(currentColumns);
        this.$nextTick(() => {
          this.dialog.dialogVisible = false;
        });
      }
    },
    cancelDialog: function () {
      if (this.dialog) {
        this.$nextTick(() => {
          this.dialog.dialogVisible = false;
        });
      }
    }
  }
};
</script>
<style>
.pubTable .el-dialog{
  width: 33%!important;
  margin: 8vh auto auto !important;
}
</style>
