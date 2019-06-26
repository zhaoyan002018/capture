<template>
  <div>
    <div class="search_model">
      <div class="mr-1 ml-1 mt-1 mb-1">
        <moloch-paging v-if="list"
                       :records-total="total"
                       :records-filtered="total"
                       v-on:changePaging="changePaging"
                       length-default=500 >
        </moloch-paging>
      </div>
    </div>
    <div class="app-container">
      <div class="interfaceSet">手动导出报表</div>
      <div class="filter-container borders" style="float:left">
        <el-button :loading="downloadLoading" class="green outline" type="text" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
      </div>
      <template>
        <!--<el-table-->
          <!--ref="multipleTable"-->
          <!--:data="list"-->
          <!--class="links-table"-->
          <!--border-->
          <!--stripe-->
          <!--tooltip-effect="dark"-->
          <!--style="width: 100%"-->
          <!--@selection-change="selectRow">-->
          <!--&lt;!&ndash;<el-table-column type="selection" width="55" align="center" />&ndash;&gt;-->
          <!--<el-table-column label="序号" align="center" width="100" type="index">-->
            <!--<template slot-scope="scope">-->
              <!--{{ scope.row.id }}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="用户名" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.name}}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="绑定IP" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.bundIp}}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="上次访问的IP" prop="lastIp" align="center"></el-table-column>-->
          <!--<el-table-column label="登录次数" prop="times" align="center"></el-table-column>-->
          <!--<el-table-column prop="action" label="操作" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<span class="outline" @click="handleUpdate(scope.row)">-->
                <!--<svg-icon icon-class="edit" />-->
              <!--</span>-->
              <!--<span style="margin-left: 30px;" class="outline" @click="Confirm(scope.row)">-->
                <!--<svg-icon icon-class="del" />-->
              <!--</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      </template>
      <!--<el-dialog :visible.sync="dialogFormVisible" title="编辑绑定用户信息" width="400px" @close="resetTemp()">-->
        <!--<div class="form">-->
          <!--<el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">-->
            <!--<el-form-item label="用户名">-->
              <!--<span>{{temp.name}}</span>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="绑定IP">-->
              <!--<el-input v-model="temp.bundIp"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        <!--</div>-->
        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="dialogFormVisible = false" >取消</el-button>-->
          <!--<el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
      <!--loading overlay -->
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
      activeName2: 'first',
      downloadLoading: false,
      mySearch: '',
      list: null,
      interfaceList: null,
      listLoading: true,
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
    this.getList();
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
      fetcharticle(this.listQuery, 'userIp').then(response => {
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
          console.log(tempData);
          editUpdatearticle(tempData, 'userIp').then((response) => {
            for (const v of this.list) {
              if (v.id === tempData.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);// 删除并替换
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              message: response.data.text,
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
          message: response.data.text,
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        this.$notify({
          message: error.text,
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
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }).catch((error) => {
            this.$notify({
              message: error.text,
              type: 'error',
              duration: 2000
            });
          });
        }
      });
    },
    selectRow (val) {
      this.selectlistRow = val;
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
      updatearticle({'Objid': Objid, 'state': state}, 'linking').then((response) => {
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
          message: response.data.text,
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        this.$notify({
          message: error.text,
          type: 'error',
          duration: 2000
        });
      });
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.handleDelete, row, '此操作将永久删除该用户信息，是否继续');
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
  .action span{
    margin-left:20px;
  }
  .links-table{
    position: relative;
    top: 49px;
  }
</style>
