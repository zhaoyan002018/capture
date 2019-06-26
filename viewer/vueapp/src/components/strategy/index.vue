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
    <div class="interfaceSet">策略配置</div>
    <div class="filter-container borders" style="float:left">
      <el-button type="info" icon="el-icon-plus" class="outline" size="mini" align="center" @click="handleCreate()"> 添加 </el-button>
      <el-button :loading="downloadLoading" class="green outline" size="mini" type="primary" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
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
        <el-table-column label="序号" align="center" width="100" type="index">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="策略名称" width="200" align="center">
          <template slot-scope="scope">
            <span class="update_btn" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="introduce" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="源IP" prop="srcIp">
          <template slot-scope="scope">
            <span>192.168.9.166</span>
          </template>
        </el-table-column>
        <el-table-column label="目的IP" prop="dstIp">
          <template slot-scope="scope">
            <span>192.168.9.12</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.enabled" class="outline info dps-info" size="mini" icon="el-icon-check" style="color: #0f0">启用</el-button>
            <el-button v-else class="outline info dps-info" icon="el-icon-close" size="mini" style="color: #f00">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog :visible.sync="dialogFormVisible" title="添加策略" width="400px" @close="resetTemp()">
      <div class="form">
        <el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
          <el-form-item label="策略名称">
            <el-input v-model="temp.name"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="dialogFormVisible = false" >取消</el-button>
        <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
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

export default {
  components: {
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
      activeName2: 'first',
      downloadLoading: false,
      mySearch: '',
      list: null,
      interfaceList: null,
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
      // this.$http.post('', this.listQuery)
      fetcharticle(this.listQuery, 'strategy').then(response => {
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
.update_btn:hover{
  color: blue;
  text-decoration: underline blue;
  cursor: pointer;
}
.dps-info{
  border-radius: 8px;
  background: #d0d0d0;
  border-color: #d0d0d0;
}
</style>
