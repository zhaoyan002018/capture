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
      <div class="interfaceSet">用户绑定</div>
      <div class="filter-container borders" style="float:left">
        <el-button :loading="downloadLoading" class=" outline" size="mini" type="primary" icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
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
          <el-table-column v-for="column in columns" :key="column.title" :width="column.width || 'auto'" align="center">
            <template slot="header" slot-scope="scope">
              <el-tooltip v-if="column.help" :content="column.help" placement="top">
                <span>{{column.name}}</span>
              </el-tooltip>
              <span v-else>{{column.name}}</span>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row[column.title]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.enabled" class="outline" align="center" style="color: #0f0" type="text" icon="el-icon-check" @click="Confirm(scope.row, false)"> 启用 </el-button>
              <el-button v-else class="danger outline" type="text" icon="el-icon-error" style="color: red" @click="Confirm(scope.row, true)"> 禁用</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <span class="outline" @click="handleUpdate(scope.row)">
                <svg-icon icon-class="edit" />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog :visible.sync="dialogFormVisible" title="编辑绑定用户信息" width="400px" @close="resetTemp()">
        <div class="form">
          <el-form ref="dataForm" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
            <el-form-item label="用户名">
              <span>{{temp.name}}</span>
            </el-form-item>
            <el-form-item label="绑定IP">
              <el-input v-model="temp.bindIp"></el-input>
            </el-form-item>
            <el-form-item label="登录失败次数">
              <el-input v-model="temp.times"></el-input>
            </el-form-item>
            <el-form-item label="锁定时间(min)">
              <el-input v-model="temp.lockTime"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-checkbox v-model="temp.enabled"></el-checkbox>
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
import { fetcharticle, updatearticle } from '@/api/article';
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
      temp: {
        enabled: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      checked: true,
      columns: [
        { name: '序号', title: 'id', width: 96 },
        { name: '用户名', title: 'name', help: '用户名称' },
        { name: '绑定IP', title: 'bindIp', help: '只允许被绑定IP访问web页面' },
        { name: '最后登录IP', title: 'lastIp', help: '该用户最近一次登录时的IP地址' },
        { name: '登录失败次数', title: 'times', help: '限定该用户最大登录失败的次数' },
        { name: '锁定时间(min)', title: 'lockTime', help: '失败次数达到上限时，账户锁定时间' }
      ]
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
      fetcharticle(this.listQuery, 'userIp').then(response => {
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
          // console.log('updateDate', 'tempData', tempData);
          this.dialogFormVisible = false;
          updatearticle(tempData, 'userIp').then((response) => {
            if (response.data.success) {
              notify(this, response.data.message, 'success');
              this.getList();
            } else {
              notify(this, response.data.message, 'error');
            }
          });
        }
      });
    },
    toggleState (arr) {
      let [row, state] = arr;
      let tempData = Object.assign({}, row);
      tempData.enabled = state;
      updatearticle(tempData, 'userIp').then((response) => {
        let msg = !state ? `成功禁用${tempData.name}` : `成功启用${tempData.name}`;
        if (response.data.success) {
          notify(this, msg, 'success');
          this.getList();
        } else {
          notify(this, msg, 'error');
        }
      });
    },
    Confirm (row, state) {
      let that = this;
      let currentCase = '';
      if (arguments.length > 1) {
        currentCase = 'state';
      } else {
        currentCase = 'delete';
      }
      switch (currentCase) {
        case 'delete' : isContinue(that, this.handleDelete, row, '此操作将永久删除该用户信息，是否继续'); break;
        case 'state' : this.changeState(row, state); break;
      }
    },
    changeState (row, state) {
      let msg = state ? `是否启用对用户${row.name}的绑定` : `是否禁用对用户${row.name}的绑定`;
      isContinue(this, this.toggleState, [row, state], msg);
    },
    resetTemp () {
      this.temp = {
        enabled: false
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
