<template>
  <div>
    <div class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <moloch-paging :records-total="total"
                       :records-filtered="total"
                       v-on:changePaging="changePaging"
                       length-default=500 >
        </moloch-paging>
      </div>
    </div>
    <div class="app-container">
      <div class="interfaceSet">规则库</div>
      <div class="filter-container borders" style="float:left">
        <el-button :loading="downloadLoading" size="mini" class="green outline" type="primary" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
      </div>
      <template>
        <el-table
          ref="multipleTable"
          :data="list"
          class="links-table"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" align="center" width="100" type="index">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="当前版本" prop="version" align="center" show-overflow-tooltip />
          <el-table-column label="是否允许自动更新" prop="enabled" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.enabled" class="el-icon-circle-check" style="color: #66c219">允许</span>
              <span v-else class="el-icon-circle-close" style="color: #f53436">禁止</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <moloch-loading
        v-if="listLoading && !error">
      </moloch-loading> <!-- /loading overlay -->
    </div>
  </div>
</template>

<script>
import { fetcharticle, updatearticle, deleteacticle, createArticle, editUpdatearticle } from '@/api/article';
import { isContinue } from '@/api/validate';
import MolochPaging from '@/components/utils/Pagination';
import MolochLoading from '@/components/utils/Loading';
import MolochRuleBaseTypeahead from '../utils/rulebaseTypeahead';

export default {
  components: {
    MolochRuleBaseTypeahead,
    MolochLoading,
    MolochPaging
  },
  data () {
    return {
      tab: {
        captureFilter: false,
        operate: false
      },
      checkList: [],
      downloadLoading: false,
      list: null,
      listLoading: false,
      error: '',
      total: 0,
      listQuery: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      selectlistRow: [],
      checked: true
    };
  },
  created () {
    // this.getList();
  },
  methods: {
    // 分页
    changePaging (pagingValues) {
      this.listQuery.length = pagingValues.length;
      this.listQuery.start = pagingValues.start;
      this.getList();
    },
    getList () {
      this.listLoading = true;
      fetcharticle(this.listQuery, 'ruleBase').then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 2000);
      }).catch(function (error) {
        this.$nitify({
          type: error,
          message: error.text,
          duration: 2000
        });
      });
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          editUpdatearticle(tempData, 'linking').then((response) => {
            for (const v of this.list) {
              if (v.id === tempData.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);// 删除并替换
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              message: response.data.message,
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete (row) {
      let otemp = '';
      let Objid = [];
      if (this.selectlistRow.length !== 0) {
        otemp = JSON.parse(JSON.stringify(this.selectlistRow));
        for (let i in this.selectlistRow) {
          Objid.push(i.id);
        }
      } else {
        otemp = JSON.parse(JSON.stringify(row));
        Objid.push(otemp.id);
      }
      deleteacticle(Objid, 'linking').then((response) => {
        // this.list = response.data.items;
        for (let i in Objid) {
          for (let v of this.list) {
            if (Objid[i] === v.id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1);
            }
          }
        }
        this.dialogFormVisible = false;
        this.$notify({
          message: response.data.message,
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        this.$notify({
          message: error.data.message,
          type: 'error',
          duration: 2000
        });
      });
    },
    handleCreate () {
      // this.resetTemp()
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp, 'linking').then((response) => {
            this.list.unshift(response.data.items);
            // this.list = response.data.items;
            this.dialogFormVisible = false;
            this.$notify({
              message: response.data.message,
              type: 'success',
              duration: 2000
            });
          }).catch((error) => {
            this.$notify({
              message: error.data.message,
              type: 'error',
              duration: 2000
            });
          });
        }
      });
    },
    toggleState (row, runstate) {
      let Objid = []; // 存放停止运行的ip
      let state;
      if (this.selectlistRow.length !== 0) { // 顶部的按钮--运行&停止调用，被选中的行
        for (const i of this.selectlistRow) {
          state = row;
          Objid.push(i.id);
        }
      } else {
        state = runstate;
        Objid.push(row.id);
      }
      updatearticle({ 'Objid': Objid, 'state': state }, 'linking').then((response) => {
        for (let i in Objid) {
          for (let j of this.list) {
            if (Objid[i] === j.id) {
              j.runState = state;
              const index = this.list.indexOf(j);
              this.list.splice(index, 1, j);
            }
          }
        }
        this.$notify({
          message: response.data.message,
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        this.$notify({
          message: error.data.message,
          type: 'error',
          duration: 2000
        });
      });
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.handleDelete, row, '此操作将永久删除该文件，是否继续');
    },
    resetTemp () {
      this.temp = {
        interfaces: []
      };
    }
  }
};
</script>
<style scoped>
  .links-table{
    position: relative;
    top: 49px;
  }
  .green{
    /*color:#0f0 !important;*/
    font-weight:900;
  }
</style>
