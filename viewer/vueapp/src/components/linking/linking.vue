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
      <div class="interfaceSet">链路配置</div>
      <div class="filter-container borders" style="float:left">
        <el-button type="info" icon="el-icon-plus" class="outline" align="center" size="mini" @click="handleCreate()"> 添加 </el-button>
        <el-button :loading="downloadLoading" class="green outline" type="primary" size="mini" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
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
          <el-table-column label="链路ID" align="center" width="100" type="index">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="链路名称" prop="name" align="center" />
          <el-table-column label="接口" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.eths" :key="item.id">{{ item }};&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.enabled">运行</span>
              <span v-else>停止</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.enabled" style="margin-right: 30px;" class="outline" @click="Confirm(scope.row, false)" >
                <svg-icon icon-class="run" />
              </span>
              <span v-else style="margin-right: 30px;" class="outline" @click="Confirm(scope.row, true)">
                <svg-icon icon-class="stop" />
              </span>
              <span style="margin-right: 30px;" class="outline" @click="handleUpdate(scope.row)">
                <svg-icon icon-class="edit" />
              </span>
              <span class="outline" @click="Confirm(scope.row)">
                <svg-icon icon-class="del" />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog :visible.sync="dialogFormVisible" title="编辑链路配置" width="400px" @close="resetTemp()">
        <div class="form">
          <el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
            <el-form-item label="链路名称">
              <el-input v-model="temp.name"/>
            </el-form-item>
            <el-form-item label="接口">
              <el-select v-model="temp.eths" multiple style="width: 222px;" placeholder="请选择">
                <el-option
                  v-for="item in interfaceList"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-checkbox v-model="temp.enabled">运行</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="dialogFormVisible = false" >取消</el-button>
          <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>
      <!--loading overlay -->
      <moloch-loading
        v-if="listLoading && !error">
      </moloch-loading> <!-- /loading overlay -->
    </div>
  </div>
</template>

<script>
import { fetchNetarticle, updateArticle, delActicle, addArticle } from '@/api/article';
import { isContinue, notify } from '@/api/validate';
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
      interfaceList: [],
      listLoading: true,
      error: '',
      total: 0,
      listQuery: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null
      },
      temp: {
        enabled: false,
        eths: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      selectlistRow: [],
      checked: true
    };
  },
  created () {
    this.getList();
  },
  watch: {
    dialogFormVisible: function (newVal, oldVal) {
      if (newVal) {
        this.getInterfaces();
      }
    }
  },
  methods: {
    // 分页
    changePaging (pagingValues) {
      this.listQuery.length = pagingValues.length;
      this.listQuery.start = pagingValues.start;
      this.getList();
    },
    getInterfaces () {
      fetchNetarticle(this.listQuery, 'interface').then(response => {
        const that = this;
        response.data.forEach(function (item) {
          that.interfaceList.push(item.name);
        });
      });
    },
    getList () {
      this.listLoading = true;
      // this.$http.post('', this.listQuery)
      fetchNetarticle(this.listQuery, 'links').then(response => {
        this.list = response.data;
        this.total = response.data.length;
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
          // console.log(tempData);
          updateArticle(tempData, 'modifylink').then((response) => {
            this.dialogFormVisible = false;
            // if (response.da)
            if (response.data.success) {
              this.getList();
              notify(this, '编辑成功', 'success');
            } else {
              notify(this, response.data.message, 'error');
            }
          });
        }
      });
    },
    handleDelete (row) {
      delActicle(row, 'dellink').then((response) => {
        // // this.list = response.data.items;
        // const index = this.list.indexOf(row.id);
        // this.list.splice(index, 1);
        this.dialogFormVisible = false;
        if (response.data.success) {
          this.getList();
          notify(this, '删除成功', 'success');
        } else {
          notify(this, response.data.message, 'error');
        }
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
          addArticle(this.temp, 'addlink').then((response) => {
            this.dialogFormVisible = false;
            if (response.data.success) {
              this.getList();
              notify(this, '添加成功', 'success');
            } else {
              notify(this, response.data.message, 'error');
            }
          });
        }
      });
    },
    toggleState (arr) {
      let [row, runstate] = arr;
      let ObjRow = Object.assign({}, row);// copy ob
      ObjRow.enabled = runstate;
      updateArticle(ObjRow, 'modifylink').then((response) => {
        if (response.data.success) {
          this.getList();
          let message = runstate ? '已运行' : '已停止';
          notify(this, message, 'success');
        } else {
          notify(this, response.data.message, 'error');
        }
      });
    },
    Confirm (row, enabled) {
      let that = this;
      if (arguments.length > 1) {
        if (enabled) {
          isContinue(that, this.toggleState, [row, enabled], '是否运行链路' + arguments[0].name);
        } else {
          isContinue(that, this.toggleState, [row, enabled], '是否停止链路' + arguments[0].name);
        }
      } else {
        isContinue(that, this.handleDelete, row, `此操作将永久删除链路${row.name}，是否继续`);
      }
    },
    resetTemp () {
      this.temp = {
        eths: []
      };
      this.interfaceList = [];
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
  .green{
    /*color:#0f0 !important;*/
    font-weight:900;
  }
</style>
