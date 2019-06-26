<template>
  <div class="files">
    <div class="top_button">
      <el-button class=" danger outline" size="mini" type="danger" icon="el-icon-close" @click="Confirm()"> 删除</el-button>
      <el-button class="green outline" size="mini" type="primary" icon="el-icon-refresh" native-type="reset" @click="sort()" > 刷新 </el-button>
    </div>
    <el-table
      v-if="columns && columns.length"
      :id="id"
      :data="data"
      stripe
      border
      @sort-change="sortChange"
      @selection-change="selectRow"
      :class="tableClasses"
      tooltip-effect="dark"
      class="table-striped">
      <el-table-column type="selection" width="48px" align="center" />
      <el-table-column v-for="(column, index) in columns" :key="column.name" align="center" :prop="column.dataField" sortable>
        <template slot="header" slot-scope="scope">
          <el-tooltip :content="column.help" placement="top">
          <span>{{ column.name }}</span>
          </el-tooltip>
        </template>
        <template slot-scope="scope" >
          <span v-if="index < 2">{{ scope.row[column.sort] }}</span>
          <!--name-->
          <span  v-else-if="index === 2">
            <a class="download" :href="'/download/'+ scope.row.fullname" v-if="scope.row['filesize'] >= 0">
              {{ scope.row.name }}
            </a>
            <span v-else>
              {{ scope.row.name }}
            </span>
          </span>
          <span v-else>
            <span v-if="column.dataFunction(scope.row[column.sort]) < 0" style="color: #f00">
              文件可能被删除
            </span>
            <span v-else>
             {{ column.dataFunction(scope.row[column.sort]) }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="操作">
        <template slot-scope="scope">
          <span class="outline" @click="Confirm(scope.row)" >
             <svg-icon icon-class="del" />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UserService from '../users/UserService';
import ToggleBtn from '../utils/ToggleBtn';
import { isContinue } from '@/api/validate';

/**
 * IMPORTANT! This component kicks off the loading of the
 * data in the table once the table state has been loaded.
 * There is no need to load data in the parent.
 */
export default {
  name: 'MolochFileTable',
  components: { ToggleBtn },
  props: {
    loadData: { // event to fire when the table needs to load data
      type: Function,
      required: true
    },
    id: { // unique id of the table
      type: String,
      required: false
    },
    tableClasses: { // table classes to be applied to the table
      type: String,
      require: false
    },
    /* IMPORTANT:
     * All columns must have a width.
     * Columns that should be shown by default (no table state saved) must have default flag */
    columns: { // columns to be displayed in the table
      type: Array,
      required: true
    },
    data: { // table data
      type: Array
    },
    tableStateName: { // api endpoint to save table state (/state/:tableStateName)
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      error: '',
      tableDiv: undefined,
      tableDesc: undefined,
      tableSortField: undefined,
      sortModel: '',
      computedColumns: [], // columns in the order computed from the saved table state
      selectlistRow: []
    };
  },
  mounted: function () {
    this.tableDiv = `#${this.id}`;
    this.getTableState(); // IMPORTANT! this loads the data for the table
  },
  methods: {
    /* exposed page functions ------------------------------------ */
    sort: function (sort) {
      // 如果点击的是刷新按钮，效果时单纯刷新，不会调整顺序；
      if (sort === undefined) {
        this.loadData();
      } else {
        // if the sort field is the same, toggle it, otherwise set it to default (true)
        this.tableDesc = this.tableSortField === sort ? !this.tableDesc : true;
        this.tableSortField = sort;
        this.loadData(this.tableSortField, this.tableDesc);
      }
      this.saveTableState();
    },
    /* fits the table to the width of the current window size */
    /* helper functions ------------------------------------------ */
    getTableState: function () {
      UserService.getState(this.tableStateName)
        .then((response) => {
          if (response.data && response.data.order && response.data.visibleHeaders) {
            // there is a saved table state for this table
            // so apply it to sortField, desc, and column order
            this.tableSortField = response.data.order[0][0]; // num
            this.tableDesc = response.data.order[0][1] !== 'desc'; // true
          }
          this.loadData(this.tableSortField, this.tableDesc);
        })
        .catch(() => {
        });
    },
    saveTableState: function () {
      let tableState = {
        order: [[this.tableSortField, this.tableDesc === true ? 'desc' : 'asc']],
        visibleHeaders: []
      };
      for (let column of this.computedColumns) {
        tableState.visibleHeaders.push(column.id);
      }
      UserService.saveState(tableState, this.tableStateName);
    },
    cloneColumn: function (column) {
      let newCol = JSON.parse(JSON.stringify(column));
      if (column.dataFunction) {
        newCol.dataFunction = column.dataFunction;
      }
      if (column.avgTotFunction) {
        newCol.avgTotFunction = column.avgTotFunction;
      }
      return newCol;
    },
    sortChange: function (column, prop, order) {
      this.sortModel = column.prop;
      this.sort(column.prop);
    },
    deleteFile: function (row) {
      let deleteRow = !row ? this.selectlistRow : row;
      this.axios.post('/deledtFildRow', {
        params: {
          row: deleteRow
        }
      }).then(res => {
        if (res.data.success) {
          setTimeout(() => {
            this.loadData();
            this.$notify({
              title: res.data.message,
              type: 'success',
              duration: 2000
            });
          }, 500);
        } else {
          this.$notify({
            title: res.data.message,
            type: 'error',
            duration: 2000
          });
        }
      });
    },
    selectRow (val) {
      this.selectlistRow = val;
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.deleteFile, row, '此操作将永久删除该文件，是否继续');
    }
  }
};
</script>
<style>
  .download:hover{
    text-decoration: underline !important;
  }
</style>
<style scoped>
.top_button{
  border: 1px solid #f0f0f0;
  width: 211px;
  text-align: center;
  border-bottom: #fff;
  position: relative;
  z-index: 1;
  top: 1px;
  background: #fff;
  line-height: 32px;
  cursor: pointer;
}
.green{
  font-weight:900;
  border:1px solid transparent;
}
</style>
