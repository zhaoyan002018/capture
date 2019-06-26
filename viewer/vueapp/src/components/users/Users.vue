<template>

<div id="user">
  <moloch-nav-search
    :placeholder="$t('common.searchHolder',{name : $t('common.user')})"
    :query="query"
    :clear="clear"
    :searchForUsers="searchForUsers">
  </moloch-nav-search>

  <div class="users-paging">
    <div style="margin-left: 0.25rem !important;margin-top: 0.25rem !important;float:right;">

    </div>
    <moloch-paging v-if="users"
                   style="margin-left: 0.25rem !important;margin-top: 0.25rem !important;"
                   :records-total="users.recordsTotal"
                   :records-filtered="users.recordsFiltered"
                   v-on:changePaging="changePaging">
    </moloch-paging>
  </div>

  <div class="users-content">

    <moloch-error v-if="error"
                  :message="error">
    </moloch-error>

    <div v-if="!error">

      <moloch-loading v-if="loading">
      </moloch-loading>
      <!--添加用户-->
      <el-button @click="showCreateUser" style="margin-left: 5px;" size="mini" class="outline" type="info" icon="el-icon-plus"> 添加用户</el-button>
      <el-button class="outline" type="primary" size="mini" icon="el-icon-refresh" native-type="reset" @click="loadData" > 刷新 </el-button>
      <!-- user table -->
      <el-table border :data="data" style="margin: 5px;" ref="userTable" :row-key="getRowKeys"
                @sort-change="sortChange">
          <el-table-column width="50">
            <template slot-scope="scope" >
              <toggle-btn :opened="scope.row.expanded"
                          @toggle="handleUserSetting(scope.row, scope.row.state)">
              </toggle-btn>
            </template>
          </el-table-column>
          <el-table-column v-for="column in columns" :key="column.name" sortable align="center" :prop="column.sort">
            <template slot="header" slot-scope="scope">
              <el-tooltip :content="column.help" placement="top">
                <span>{{ column.name }}</span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span v-if="column.type === 'text'">{{ scope.row[column.sort] }}</span>
              <el-input v-else-if="column.type === 'input'" v-model="scope.row[column.sort]" type="text" size="mini" @change="userChanged(scope.row)"></el-input>
              <el-checkbox v-if="column.type === 'checkbox'" v-model="scope.row[column.sort]" @change="userChanged(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column width="180">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.changed" :content="`Save the updated settings for ${scope.row.userId}`" placement="top">
                <el-button @click="updateUser(scope.row)" style="width:34px !important;height: 34px !important;padding: 5px;margin:0 !important;">
                         <span class="fa fa-save">
                         </span>
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.changed" :content="`Cancel changed settings for ${scope.row.userId}`" placement="top">
                <el-button @click="loadData" style="width:34px !important;height: 34px !important;padding: 5px;margin:0 !important;">
                        <span class="fa fa-ban">
                        </span>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('common.settings')" placement="top">
                <el-button @click="openSettings(scope.row.userId)" style="width:34px !important;height: 34px !important;padding: 5px;margin:0 !important;">
                        <span class="fa fa-gear">
                      </span>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('common.history')" placement="top">
                <el-button @click="openHistory(scope.row.userId)" style="width:34px !important;height: 34px !important;padding: 5px;margin:0 !important;">
                        <span class="fa fa-history">
                        </span>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('common.delete')" placement="top">
                <el-button @click="Confirm(scope.row)" style="width:34px !important;height: 34px !important;padding: 5px;margin:0 !important;">
                <span class="fa fa-trash-o">
                </span>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1px">
          <template slot-scope="scope">
            <transition-group name="list">
              <div :key="scope.row.id + 'adv'"
                   v-if="scope.row.expanded" style="position: absolute;width: 100%;">
                <strong>
                  配置其他用户权限:
                </strong>
                <el-tooltip content="对此用户隐藏状态页面" placement="top">
                  <el-checkbox v-model="scope.row.hideStats" @change="userChanged(scope.row);">
                    隐藏状态页
                  </el-checkbox>
                </el-tooltip>
                <el-tooltip content="对此用户隐藏文件页面" placement="top">
                  <el-checkbox  v-model="scope.row.hideFiles" @change="userChanged(scope.row);">
                    隐藏文件页
                  </el-checkbox>
                </el-tooltip>
                <el-tooltip content="对此用户隐藏 PCAP 页面" placement="top">
                  <el-checkbox :id="scope.row.id + 'pcap'" v-model="scope.row.hidePcap" @change="userChanged(scope.row);">
                    隐藏PCAP页
                  </el-checkbox>
                </el-tooltip>
                <el-tooltip content="禁止此用户下载 PCAP 包" placement="top">
                  <el-checkbox :id="scope.row.id + 'pcapDownload'" v-model="scope.row.disablePcapDownload"
                               @change="userChanged(scope.row);">
                    禁止下载PCAP包
                  </el-checkbox>
                </el-tooltip>
              </div>
            </transition-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- new user form -->
      <el-dialog :visible.sync="createNewUser" :title="$t('users.createUserLabel')" @close="resetTemp()" class="Dialog" modal modal-append-to-body>
        <div style="float: left;width: 66%;">
          <el-form label-position="right" label-width="25%" :model="newuser" :rules="rules">
            <el-form-item :label="$t('users.userId')" prop="userId">
              <el-input v-model="newuser.userId"></el-input>
            </el-form-item>
            <el-form-item :label="$t('users.userName')" prop="userName">
              <el-input v-model="newuser.userName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('users.forcedExpression')">
              <el-input v-model="newuser.expression"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.password')" prop="password">
              <el-input v-model="newuser.password" type="password"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="float: right;width: 33%;display: flex;flex-wrap: wrap;">
          <el-form :model="newuser">
            <template v-for="(column, index) in columns">
              <el-tooltip :content="column.help" placement="top" :key="column.name" v-if="index === 3">
                <el-checkbox v-model="newuser[column.sort]" :label="column.name" style="width: 100%;margin-left: 30px;"></el-checkbox>
              </el-tooltip>
              <el-tooltip :content="column.help" placement="top" :key="column.name" v-if="index > 3">
                <el-checkbox v-model="newuser[column.sort]" :label="column.name" style="width: 100%;margin-left: 30px;"></el-checkbox>
              </el-tooltip>
            </template>
          </el-form>
        </div>
        <div style="position: absolute;bottom: 50px;right: 25px;">
          <el-button style="margin-right: 5px;" @click="cancelCreateUser" size="small" icon="el-icon-refresh" type="info" >
            {{$t('common.cancel')}}
          </el-button>
          <el-button style="" @click="createUser" size="small" icon="el-icon-circle-check-outline" type="primary">
            {{$t('common.create')}}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div> <!-- /users content -->
</div> <!-- container-fluid -->

</template>

<script>
import MolochPaging from '../utils/Pagination';
import MolochError from '../utils/Error';
import MolochLoading from '../utils/Loading';
import ToggleBtn from '../utils/ToggleBtn';
import MolochNavSearch from '@/components/navSearch/index';
import { isContinue, notify } from '@/api/validate';

let searchInputTimeout; // timeout to debounce the search input

export default {
  name: 'Users',
  components: {
    MolochPaging,
    MolochError,
    MolochLoading,
    ToggleBtn,
    MolochNavSearch
  },
  data: function () {
    return {
      error: '',
      loading: true,
      data: [],
      users: null,
      createError: '',
      newuser: {
        enabled: true,
        packetSearch: true
      },
      query: {
        length: parseInt(this.$route.query.length) || 50,
        start: 0,
        filter: null,
        sortField: 'userId',
        desc: false
      },
      columns: [
        { name: this.$t('users.userId'), sort: 'userId', type: 'text', nowrap: true, help: this.$t('users.userIdHelper') },
        { name: this.$t('users.userName'), sort: 'userName', type: 'input', nowrap: true, help: this.$t('users.userNameHelper') },
        { name: this.$t('users.forcedExpression'), sort: 'expression', type: 'input', nowrap: true, help: this.$t('users.forcedExpressionHelper') },
        { name: this.$t('users.enabled'), sort: 'enabled', type: 'checkbox', nowrap: true, help: this.$t('users.enabledHelper') },
        { name: this.$t('users.admin'), sort: 'createEnabled', type: 'checkbox', nowrap: true, help: this.$t('users.adminHelper') },
        // { name: '登录失败次数', sort: 'loginTimes', type: 'input', nowrap: true, help: '限制该用户登录失败次数' },
        { name: this.$t('users.webInterface'), sort: 'webEnabled', type: 'checkbox', help: this.$t('users.webInterfaceHelper') },
        { name: this.$t('users.webAuthHeader'), sort: 'headerAuthEnabled', type: 'checkbox', help: this.$t('users.webAuthHeaderHelper') },
        { name: this.$t('users.emailSearch'), sort: 'emailSearch', type: 'checkbox', help: this.$t('users.emailSearchHelper') },
        { name: this.$t('users.canRemoveData'), sort: 'removeEnabled', type: 'checkbox', help: this.$t('users.canRemoveDataHelper') },
        { name: this.$t('users.canSearchPkt'), sort: 'packetSearch', type: 'checkbox', help: this.$t('users.canSearchHelper') }
      ],
      sortModel: null,
      rules: {
        userId: [{ trigger: 'blur', message: this.$t('users.userIdErr'), required: true }],
        userName: [{ trigger: 'blur', message: this.$t('users.userNameErr'), required: true }],
        password: [{ trigger: 'blur', message: this.$t('users.passwordErr'), required: true }]
      },
      createNewUser: false
    };
  },
  computed: {
    user: {
      get: function () {
        return this.$store.state.user;
      },
      set: function (newValue) {
        this.$store.commit('setUser', newValue);
      }
    }
  },
  created: function () {
    this.loadData();
  },
  methods: {
    /* exposed page functions ------------------------------------ */
    changePaging (pagingValues) {
      this.query.length = pagingValues.length;
      this.query.start = pagingValues.start;

      this.loadData();
    },
    searchForUsers () {
      if (searchInputTimeout) { clearTimeout(searchInputTimeout); }
      // debounce the input so it only issues a request after keyups cease for 400ms
      searchInputTimeout = setTimeout(() => {
        searchInputTimeout = null;
        this.loadData();
      }, 400);
    },
    clear () {
      this.query.filter = undefined;
      this.loadData();
    },
    onOffFocus: function () {
      this.focusInput = false;
    },
    columnClick (name) {
      this.query.sortField = name;
      this.loadData();
    },
    /* remove the message when user is done with it or duration ends */
    userChanged: function (user) {
      this.$set(user, 'changed', true);
    },
    updateUser: function (user) {
      this.$set(user, 'expanded', undefined);
      this.$http.post('user/update', user)
        .then((response) => {
          notify(this, response.data.text, 'success');
          // update the current user if they were changed
          if (this.user.userId === user.userId) {
            // update all the fields
            for (let field in user) {
              if (this.user.hasOwnProperty(field) &&
                user[field] !== undefined) {
                this.user[field] = user[field];
              }
            }
          }
          this.$set(user, 'changed', false);
        }, (error) => {
          notify(this, error.text, 'error');
        });
    },
    deleteUser: function (user) {
      this.$http.post('user/delete', user)
        .then((response) => {
          notify(this, response.data.text, 'success');
          const index = this.users.data.indexOf(user);
          this.users.data.splice(index, 1);
        }, (error) => {
          notify(this, error.text, 'error');
        });
    },
    createUser: function () {
      this.createError = '';

      if (!this.newuser.userId) {
        this.createError = this.$t('users.userIdErr');
        return;
      }

      if (!this.newuser.userName) {
        this.createError = this.$t('users.userNameErr');
        return;
      }

      if (!this.newuser.password) {
        this.createError = this.$t('users.passwordErr');
        return;
      }
      this.$http.post('user/create', this.newuser)
        .then((response) => {
          notify(this, response.data.text, 'success');
          this.newuser = { enabled: true, packetSearch: true };
          this.loadData();
        })
        .catch((error) => {
          // this.createError = error.text;
          notify(this, error.text, 'error');
        });
      this.createNewUser = false;
    },
    cancelCreateUser: function () {
      this.createNewUser = false;
    },
    openSettings: function (userId) {
      this.$router.push({
        path: '/settings/index',
        query: {
          ...this.$route.query,
          userId: userId
        }
      });
    },
    openHistory: function (userId) {
      this.$router.push({
        path: '/history/index',
        query: {
          ...this.$route.query,
          userId: userId
        }
      });
    },
    toggleAdvSettings: function (user) {
      this.$set(user, 'expanded', !user.expanded);
    },
    /* helper functions ------------------------------------------ */
    loadData: function () {
      this.$http.post('user/list', this.query)
        .then((response) => {
          this.error = '';
          this.loading = false;
          this.users = response.data;
          this.data = this.users.data;
        }, (error) => {
          this.loading = false;
          this.error = error.text;
          this.error = error.text;
        });
    },
    /* 用于排序 */
    sortChange: function (column, prop, order) {
      this.sortModel = column.prop;
      if (order === 'descending') {
        this.query.desc = true;
      }
      this.columnClick(column.prop);
    },
    showCreateUser: function () {
      this.createNewUser = true;
    },
    handleUserSetting: function (row, state) {
      this.toggleAdvSettings(row);
      if (state === undefined) {
        row.state = true;
      } else {
        row.state = !row.state;
      }
      this.$refs.userTable.toggleRowExpansion(row, row.state); // 点击button展开
    },
    getRowKeys (row) {
      return row.id;
    },
    Confirm (row) {
      let that = this;
      isContinue(that, this.deleteUser, row, '此操作将会永久删除该用户，是否继续');
    },
    resetTemp () {
      this.newuser = {
        enabled: true,
        packetSearch: true
      };
    }
  }
};
</script>

<style scoped>
/* search navbar */

/* paging/toast navbar */
.users-paging {
  z-index: 4;
  position: fixed;
  top: 75px;
  width:calc(100% - 36px);
  height: 40px;
  background-color: var(--color-quaternary-lightest);

  -webkit-box-shadow: 0 0 16px -2px black;
  -moz-box-shadow: 0 0 16px -2px black;
  box-shadow: 0 0 16px -2px black;
}

/* page content */
.users-content {
  padding-top: 100px;
  padding-right:10px;
}

</style>
