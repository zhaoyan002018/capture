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
    <div class="app-container routing-setting">
      <el-tabs v-model="activeName2" type="border-card">
        <el-tab-pane label="静态路由" name="first">
          <div class="filter-container borders" style="width:100%;top: 0 !important;height: 41px;">
            <div style="float:left">
              <el-button type="info" size="mini" icon="el-icon-plus" class="outline" align="center" @click="handleCreate()"> 新增 </el-button>
              <el-button :loading="downloadLoading" size="mini" class="outline" type="primary" icon="el-icon-refresh" native-type="reset" @click="getList()" > 刷新 </el-button>
            </div>
            <div style="float: right;">
              <el-input v-model="mySearch" style="float: right; width:200px" placeholder="请输入内容" prefix-icon="el-icon-search" />
              <el-button class="filter-item outline" type="primary" style="float: right;margin-bottom:20px;" icon="el-icon-search" @click="handleFilter()" >搜索</el-button>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            border
            stripe>
            <el-table-column label="目的地址">
              <template slot-scope="scope">
                {{ scope.row.target }}
              </template>
            </el-table-column>
            <el-table-column label="子网掩码" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.mask }}
              </template>
            </el-table-column>
            <el-table-column label="网关" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.gateway }}
              </template>
            </el-table-column>
            <el-table-column label="度量值" align="center" prop="metric">
            </el-table-column>
            <el-table-column label="接口" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                {{ scope.row.oif }}
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center">
              <template slot-scope="scope">
              <span class="outline" @click="Confirm(scope.row)">
                <svg-icon icon-class="del" />
              </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--分页-->
      <el-dialog :visible.sync="dialogFormVisible" title="编辑单个路由静态" width="400px" @close="resetTemp()">
        <div class="form">
          <el-form ref="dataForm" :rules="rules" :model="temp" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
            <el-form-item label="目的地址" prop="target">
              <el-input v-model="temp.target" />
            </el-form-item>
            <el-form-item label="子网掩码" prop="mask">
              <el-input v-model="temp.mask"/>
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="temp.gateway"></el-input>
            </el-form-item>
            <el-form-item label="接口">
              <el-select v-model="temp.oif" class="filter-item" placeholder="自动选择">
                <el-option label="自动选择" :value="''"></el-option>
                <el-option v-for="item in interfaceList" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh" class="outline" type="info" plain @click="dialogFormVisible = false" >取消</el-button>
          <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" plain @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>
      <moloch-loading v-if="listLoading && !error"></moloch-loading>
    </div>
  </div>
</template>

<script>
import { fetchNetarticle, delActicle, addArticle } from '@/api/article';
import { isipcheck, isContinue, notify } from '@/api/validate';
import MolochPaging from '@/components/utils/Pagination';
import MolochLoading from '@/components/utils/Loading';
export default {
  components: {
    MolochLoading,
    MolochPaging
  },
  data () {
    const IPaddress = (rule, value, callback) => {
      if (!isipcheck(value)) {
        callback(new Error('请输入正确的IP地址'));
      } else {
        callback();
      }
    };
    return {
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
      temp: {},
      rules: {
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        target: [{ trigger: 'blur', validator: IPaddress }],
        mask: [{ trigger: 'blur', validator: IPaddress }],
        gateway: [{ trigger: 'blur', validator: IPaddress }]
      },
      dialogFormVisible: false,
      dialogStatus: ''
    };
  },
  watch: {
    dialogFormVisible: function (newVal, oldVal) {
      if (newVal) {
        this.getInterfaces();
      }
    }
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
      fetchNetarticle(this.listQuery, 'routes').then(response => {
        this.list = response.data;
        this.total = response.data.length;
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 2000);
      }).catch((error) => {
        this.$notify({
          message: error.data.message,
          type: 'error',
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
    handleDelete (row) {
      delActicle(row, 'delroute').then((response) => {
        if (response.data.success) {
          this.getList();
          notify(this, '已删除路由记录', 'success');
        } else {
          notify(this, response.data.message, 'error');
        }
      });
    },
    handleCreate () {
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    resetTemp () {
      this.temp = {
      };
      this.interfaceList = [];
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addArticle(this.temp, 'addroute').then((response) => {
            this.dialogFormVisible = false;
            this.resetTemp();
            if (response.data.success) {
              this.getList();
              notify(this, '成功添加路由记录', 'success');
            } else {
              notify(this, response.data.message, 'error');
            }
          });
        }
      });
    },
    handleFilter () {
      // this.getList()
      const NewList = [];
      for (const i of this.list) {
        if (this.mySearch === i.name) {
          NewList.push(i);
        }
      }
      this.list = JSON.parse(JSON.stringify(NewList));
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.handleDelete, row, '此操作将永久删除该路由记录，是否继续');
    }
  }
};
</script>
