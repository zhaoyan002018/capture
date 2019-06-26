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
      <div class="physicalInterface">物理接口</div>
      <div class="filter-container borders">
        <el-button :loading="downloadLoading" native-type="reset" size="mini" class="filter-item green outline" type="primary" icon="el-icon-refresh" @click="getList()" > 刷新 </el-button>
      </div>
      <el-table
        :key="tableKey"
        :data="list"
        border
        stripe
        style="width: 100%;top: 49px;">
        <el-table-column label="序号" align="center" width="102" prop="index"></el-table-column>
        <el-table-column label="接口名称" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)" class="outline">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="网口状态" align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.state == 'UP'" src="@/assets/cnet.gif">
            <img v-else src="@/assets/nnet.gif">
          </template>
        </el-table-column>
        <el-table-column label="链路" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.Link">——</span>
            <div v-else>
              <p v-for="item in scope.row.Link" :key="item">{{item}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="IP地址">
          <template slot-scope="scope">
            <p v-for="item in scope.row.addrs" :key="item">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="MTU" class-name="status-col" align="center" >
          <template slot-scope="scope">
            <span>{{ scope.row.mtu }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80" class-name="small-padding" type="index">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled" class="el-icon-check bgg" />
            <span v-else class="el-icon-circle-close-outline bgr"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.enabled" class="filter-item outline" align="center" type="text" icon="el-icon-check" @click="Confirm(scope.row, false)"> 启用 </el-button>
            <el-button v-else class="filter-item danger outline" type="text" icon="el-icon-error" @click="Confirm(scope.row, true)"> 禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogFormVisible" title="编辑" width="500px" >
        <div class="form">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="margin-left:40px;" size="mini">
            <el-form-item label="接口名称">
              <span>{{ temp.name }}</span>
            </el-form-item>
            <el-form-item label="IP地址">
              <el-input :autosize="{minRows:5}" v-model="temp.addr" type="textarea" style="width: 254px" placeholder="请输入内容" >
                <p v-for="item in temp.addrs" :key="item">
                  {{item}}
                </p>
              </el-input>
              <el-tooltip content="例如：0.0.0.0/24" placement="bottom">
                <span class="el-icon-warning" style="color: #ccc" />
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh" type="info" @click="dialogFormVisible = false" >取消</el-button>
          <el-button size="small" icon="el-icon-circle-check-outline" type="primary" @click="updateData()">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <moloch-loading
      v-if="listLoading && !error">
    </moloch-loading> <!-- /loading overlay -->
  </div>
</template>

<script>
import { fetchNetarticle, updateArticle } from '@/api/article';
import MolochLoading from '@/components/utils/Loading';
import MolochPaging from '@/components/utils/Pagination';
import { notify, isContinue } from '@/api/validate';

export default {
  name: 'Interface',
  components: {
    MolochLoading,
    MolochPaging
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      error: '',
      listQuery: {
        length: parseInt(this.$route.query.length) || 500,
        start: 0,
        filter: null
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      Link: [],
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      rules: {
      },
      downloadLoading: false
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
    getList () { // 作用就是从mock中获取数据
      this.listLoading = true;
      return fetchNetarticle(this.listQuery, 'interface').then(response => {
        this.list = response.data;
        this.list.forEach(function (item) {
          item.addr = item.addrs.join('\n');
        });
        this.total = response.data.length;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.1 * 2000);
      }).catch((error) => {
        this.$notify.error({
          message: error.text,
          duration: 2000
        });
      });
    },
    resetTemp () {
      this.temp = {
      };
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row);// copy obj
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          let data = {};
          tempData.addrs.length = 0;
          tempData.addr.split('\n').forEach(function (item) {
            tempData.addrs.push(item);
          });
          for (let i = 0; i < tempData.addrs.length; i++) {
            for (let j = i + 1; j < tempData.addrs.length; j++) {
              if (tempData.addrs[i] === tempData.addrs[j]) {
                tempData.addrs.splice(j, 1);
                j--;
              }
            }
          }
          for (let i in tempData) {
            if (i !== 'addr') {
              data[i] = tempData[i];
            }
          }
          updateArticle(data, 'modifyifs').then((response) => {
            // for (const v of this.list) {
            //   if (v.id === tempData.id) {
            //     const index = this.list.indexOf(v);
            //     this.list.splice(index, 1, tempData);
            //     break;
            //   }
            // }
            this.dialogFormVisible = false;
            this.resetTemp();
            const that = this;
            if (response.data.success) {
              this.getList();
              setTimeout(() => {
                notify(that, response.data.message, 'success');
              }, 300);
            } else {
              notify(that, response.data.message, 'error');
            }
          });
        }
      });
    },
    ToggleRow (arr) {
      let [row, enabled] = arr;
      let ObjRow = Object.assign({}, row);// copy obj
      ObjRow.enabled = enabled;
      updateArticle(ObjRow, 'modifyifs').then(response => {
        const that = this;
        if (response.data.success) {
          this.getList();
          setTimeout(() => {
            let message = enabled ? '已启用' : '已禁用';
            notify(that, message, 'success');
          }, 300);
        } else {
          notify(that, response.data.message, 'error');
        }
      });
    },
    Confirm (row, enabled) {
      if (enabled) {
        isContinue(this, this.ToggleRow, [row, enabled], '是否启用该接口');
      } else {
        isContinue(this, this.ToggleRow, [row, enabled], '是否禁用该接口');
      }
    }
  }
};
</script>
<style scoped>
  .physicalInterface{
    width: 150px;
    height: 35px;
    line-height:35px;
    text-align: center;
    border:1px solid #f0f0f0;
    border-bottom:#fff;
    font-size:14px;
    position:relative;
    top:50px;
    z-index: 4;
    background: #ffffff;
  }
  .danger{
    color:#f00;
  }
  .green{
    font-weight:900;
  }
  .bgg{
    color: #0f0;
  }
  .bgr{
    color: #f00;
    font-weight: 900;
  }
  .form{
    width: 480px;
    height: 217px;
    overflow-y: auto;
  }
</style>
