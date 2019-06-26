<template>
  <div id="dpsTable">
    <div class="app-container">
      <div class="interfaceSet">{{title}}</div>
      <div class="filter-container borders" style="float:left">
        <el-button v-if="btn.isHandleCreate && btn.isHandleCreate !== 'undefined'" type="info" icon="el-icon-plus" size="mini"
                   class="outline" align="center" @click="handleCreateBtn()"> 添加 </el-button>
        <!--<el-button type="text" icon="el-icon-check" class="outline" align="center" -->
                   <!--@click="toggleState(true)"> 运行 </el-button>-->
        <!--<el-button class="outline danger" type="text" icon="el-icon-error" -->
                   <!--@click="toggleState(false)"> 停止</el-button>-->
        <el-button v-if="btn.isRefresh && btn.isRefresh !== 'undefined'" :loading="downloadLoading" class="green outline" type="primary" size="mini"
                   icon="el-icon-refresh" native-type="reset" @click="getList()"> 刷新 </el-button>
      </div>
      <template>
        <el-table
          ref="multipleTable"
          :data="data"
          class="links-table"
          stripe
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column v-for="(column) in columns" :key="column.title" align="center" :sortable="column.sortable||false" :width="column.width">
            <!--设置表格表头内容-->
            <template slot="header" slot-scope="scope">
              <div>
                <div v-if="column.help" style="line-height: 20px !important;">
                  <el-tooltip :content="column.help" placement="top">
                    <span>{{ column.name }}</span>
                  </el-tooltip>
                </div>
                <div v-else style="line-height: 20px!important;">
                  <span>{{ column.name }}</span>
                </div>
              </div>
            </template>
            <!--设置表格内容-->
            <template slot-scope="scope" show-overflow-tooltip>
              <!--仅仅只是一个字符串或者数字，仅仅只是显示，没有添加判断-->
              <!--首先区分类型-->
              <div v-if="column.title !== 'action'">
                <!--type === array-->
                <div v-if="column.type === 'array'">
                  <p v-html="showArray(scope.row, column)"></p>
                </div>
                <div v-else-if="column.type === 'obj'">
                  <p v-html="showObject(scope.row, column)"></p>
                </div>
                <div v-else>
                  <!--判断是一个Boolean值-->
                  <div v-if="column.type === 'boolean'">
                    <div v-if="column.customize" v-html="column.Customize(scope.row, column)"></div>
                    <el-tag v-else-if="column.label === 'level'" class="tag_threatLevel" @click="Update(scope.row)"
                            :style="{'background-color':  column.color[scope.row[column.title] - 1]}">{{column.subName[scope.row[column.title] - 1]}}</el-tag>
                    <div v-else-if="column.label === 'button'">
                      <el-button type="text" class="outline" v-if="scope.row[column.title]" @click="changeState(scope.row, false)" :style="{color:column.subColor[0]}" :icon="column.className[0]">{{ column.subName[0] }}</el-button>
                      <el-button type="text" class="outline" v-else @click="changeState(scope.row, true)" :style="{color:column.subColor[1]}" :icon="column.className[1]">{{ column.subName[1] }}</el-button>
                    </div>
                    <div v-else v-html="showBoolean(scope.row, column)"></div>
                  </div>
                  <div v-else>
                    <div v-if="column.label === 'time'">
                      <!--如果输入的column中label值为time，指输入的是时间戳，单位是秒，会将其转化成2019/3/30 11:10:05的样子-->
                      <span>{{new Date(parseInt(scope.row[column.title]) *1000).toLocaleString().replace(/[\u4e00-\u9fa5]+/g, '')}}</span>
                    </div>
                   <div v-else>
                      <span>{{scope.row[column.title]}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!--如果这一列是操作列-->
              <div v-else>
                <span v-for="item in column.action" :key="item.title"
                      style="cursor: pointer;margin-left: 30px;" class="outline" @click="action(scope.row, column, item)">
                  <svg-icon :icon-class="item.name" />
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog v-if="Dialog" :visible.sync="dialogFormVisible" :title="dialogTitle" :width="dialogWidth" @close="resetTemp()">
        <div class="form">
          <el-form ref="dataForm" :model="tempData" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
            <el-form-item v-for="item in dialogText" :key="item.title" :label="item.name">
              <span v-if="item.type === 'text'">{{tempData[item.title] || item.default}}</span>
              <el-input v-if="item.type === 'input'" v-model="tempData[item.title]" :placeholder="tempData[item.placeholder]"></el-input>
              <el-checkbox v-if="item.type === 'checkbox'" v-model="tempData[item.title]">{{item.subTitle}}</el-checkbox>
              <el-radio-group v-if="item.type === 'radio-button'" v-model="tempData[item.title]">
                <el-radio-button v-for="(btn, index) in item.btnName" :key="btn" :label="index + 1">{{btn}}</el-radio-button>
              </el-radio-group>
              <el-cascader v-if="item.type === 'cascader'" :options="item.options" :show-all-levels="item.showAllLevels"></el-cascader>
              <el-input v-if="item.type === 'input+btn'" :disabled="true"
                        style="width: 70%;" placeholder=""
                        v-model="tempData[item.title]"></el-input>
              <button v-if="item.type === 'input+btn'" type="button" class="outline"
                      style="cursor: pointer;width: 20%;border: 1px solid #fff;border-radius: 10px;padding: 0 2px;" @click.stop="openDialogTree(item, tempData)">more</button>
            </el-form-item>
            <el-tabs v-if="cardData.length" v-model="tabTitle">
              <el-tab-pane v-for="item in cardData" :key="item.title" :label="item.name" :name="item.title">
               <el-table v-if="item.type === 'table'" :data="item.content" border ref="dialogTable"  @selection-change="handleSelectionChange">
                 <el-table-column type="selection" width="55" v-if="item.selection"></el-table-column>
                 <el-table-column v-for="column in item.columns" :key="column.name" show-overflow-tooltip>
                   <template slot="header" slot-scope="scope">
                     <div v-if="column.help" style="line-height: 20px !important;">
                       <el-tooltip :content="column.help" placement="top">
                         <span>{{ column.name }}</span>
                       </el-tooltip>
                     </div>
                     <div v-else style="line-height: 20px!important;">
                       <span>{{ column.name }}</span>
                     </div>
                   </template>
                   <template slot-scope="scope">
                     <el-radio v-if="column.type === 'radio'"
                               @change="change(item, scope.row.name, column.label + scope.row.name)"
                               v-model="radioData[item.title][scope.row.name]"
                               :label="column.label + scope.row.name">{{ column.label }}</el-radio>
                     <span v-else>{{scope.row[column.title]}}</span>
                   </template>
                 </el-table-column>
               </el-table>
               <el-form v-if="item.type === 'form'" :rules="rules" label-width="100px">
                 <div v-for="col in item.content" :key="col.title">
                  <el-form-item :label="col.name">
                   <el-input v-if="col.type === 'input' && col.subTitle === 'ip' || col.subTitle === 'port'" :class="col.title"
                             @blur="check(col, item)" v-model="tempData[item.title][col.title]"></el-input>
                    <span class="msg" v-if="col.type === 'input' && col.subTitle === 'ip' || col.subTitle === 'port'" style="color: red;position: absolute;"></span>
                   <el-radio-group class="radio-button" v-if="col.type === 'radio-button'" v-model="tempData[item.title][col.title]">
                     <el-radio-button v-for="(data, index) in col.subBtn" :key="data" :label="index">{{data}}</el-radio-button>
                   </el-radio-group>
                 </el-form-item>
                 </div>
                </el-form>
               <div v-if="item.type === 'twoTable'">
                 <div style="float: left;width: 50%;">
                   <el-table :data="collectData[item.title][item.firContent[0].title]" border>
                     <el-table-column v-for="column in item.firColumns" :key="column.name" show-overflow-tooltip :width="column.width">
                       <template slot="header" slot-scope="scope">
                         <div v-if="column.help" style="line-height: 20px !important;">
                           <el-tooltip :content="column.help" placement="top">
                             <span>{{ column.name }}</span>
                           </el-tooltip>
                         </div>
                         <div v-else style="line-height: 20px!important;">
                           <span>{{ column.name }}</span>
                         </div>
                       </template>
                       <template slot-scope="scope">
                           <el-radio  v-if="column.type === 'radio'"
                                      @change="change(item, scope.row, column.label + scope.row, 'firContent')"
                                     :label="column.label + scope.row"
                                     v-model="radioData[item.title][item.firContent[0].title][scope.row]">
                             {{ column.label }}
                           </el-radio>
                           <span v-else>{{scope.row}}</span>
                       </template>
                     </el-table-column>
                   </el-table>
                   <el-button @click="addContent(item.title,item.firContent[0].title, 'firContent')">+</el-button>
                   <el-input style="width: 75%;" v-if="item.firContent[0].title === 'srcIp'" v-model="addData.srcIp"></el-input>
                   <el-input style="width: 75%;" v-if="item.firContent[0].title === 'srcPort'" v-model="addData.srcPort"></el-input>
                 </div>
                 <div style="float: left;width: 50%;">
                   <el-table :data="collectData[item.title][item.sedContent[0].title]" border>
                     <el-table-column v-for="column in item.sedColumns" :key="column.name"
                                      show-overflow-tooltip :width="column.width" align="center">
                       <template slot="header" slot-scope="scope">
                         <div v-if="column.help" style="line-height: 20px !important;">
                           <el-tooltip :content="column.help" placement="top">
                             <span>{{ column.name }}</span>
                           </el-tooltip>
                         </div>
                         <div v-else style="line-height: 20px!important;">
                           <span>{{ column.name }}</span>
                         </div>
                       </template>
                       <template slot-scope="scope">
                         <el-radio  v-if="column.type === 'radio'"
                                    @change="change(item, scope.row, column.label + scope.row, 'sedContent')"
                                    :label="column.label + scope.row"
                                    v-model="radioData[item.title][item.sedContent[0].title][scope.row]">
                           {{ column.label }}
                         </el-radio>
                         <span v-else>{{scope.row}}</span>
                       </template>
                     </el-table-column>
                   </el-table>
                   <el-button @click="addContent(item.title,item.sedContent[0].title, 'sedContent')">+</el-button>
                   <el-input style="width: 75%;" v-if="item.sedContent[0].title === 'dstIp'" v-model="addData.dstIp"></el-input>
                   <el-input style="width: 75%;" v-if="item.sedContent[0].title === 'dstPort'" v-model="addData.dstPort"></el-input>
                 </div>
               </div>
               <el-form v-if="item.type === 'form-Two'" label-width="100px">
                 <div v-for="con in item.Content" :key="con.title">
                   <div style="font-weight: 700;font-style: italic;font-size: 17px;">{{ con.name }}</div>
                   <el-form-item v-for="col in item.Columns" :key="col.title" :label="col.name">
                     <el-input v-model="formTwoData[con.title][col.title]" :class="[con.title, col.title]" @blur="check(col, item, con)"></el-input>
                     <span class="msg" style="color: red;position: absolute;"></span>
                   </el-form-item>
                 </div>
               </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
        <el-dialog v-if="Dialog_tree" :visible.sync="dialogFormVisible_tree" :title="dialogTitleTree" append-to-body width="400px" @close="resetTempDataTree()">
          <div class="form">
            <el-form ref="dataFormTree" :model="tempDataTree" status-icon auto-complete="on" label-position="left" label-width="110px" style="margin-left:28px;" size="mini">
              <el-tree :data="treeData" ref="tree" :show-checkbox="showCheckbox" node-key="id" :props="defaultProps"></el-tree>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="closeTree()" >取消</el-button>
            <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="submitTree()">确定</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" icon="el-icon-refresh" class="outline" type="info" @click="close()" >取消</el-button>
          <el-button size="small" icon="el-icon-circle-check-outline" class="outline" type="primary" @click="submit()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isEnglishSymbol, isContinue, hasEng, isipcheck, enabledPort, ipToInt, endSymbol } from '../../api/validate';

export default {
  name: 'DpsTable',
  props: {
    // 固定必备的
    title: String,
    data: Array,
    rules: Object,
    columns: Array,
    btn: {
      type: Object,
      default: () => ({isRefresh: true})
    },
    dialogTitle: String,
    dialogWidth: {
      type: String,
      default: '400px'
    },
    dialogText: Array,
    temp: Object,
    treeData: Array,
    getList: Function,
    Dialog_tree: {
      type: Boolean,
      default: false
    },
    cardDialog: {
      type: Boolean,
      default: false
    },
    cardData: {
      type: Array,
      default: () => ([])
    },
    cardDialogTitle: {
      type: String,
      default: ''
    },
    Dialog: {
      type: Boolean,
      default: false
    },
    Confirm: Function,
    Customize: Function,
    showCheckbox: {
      type: Boolean,
      default: true
    },
    dialogTitleTree: {
      type: String,
      default: ''
    },
    handleCreate: Function,
    handleUpdate: Function,
    handleDelete: Function,
    handleChangeState: Function,
    // eventLevel 传过来的方法
    cardDataArr: Array,
    joinProto: Function,
    isCollectPage: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      downloadLoading: false,
      dialogFormVisible: false,
      dialogFormVisible_tree: false, // element树形控件
      DialogCardVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tempData: {},
      tempDataTree: {},
      isCreate: false,
      treeCheck: null,
      multipleSelection: [],
      radioData: {},
      content: {},
      msg: null,
      tabTitle: 'proto',
      firTemp: {},
      sedTemp: {},
      collectData: {},
      addData: {
        srcIp: '',
        dstIp: '',
        srcPort: '',
        dstPort: ''
      },
      formTwoData: {
        srcIp: {
          receive: '',
          rejection: ''
        },
        dstIp: {
          receive: '',
          rejection: ''
        },
        srcPort: {
          receive: '',
          rejection: ''
        },
        dstPort: {
          receive: '',
          rejection: ''
        }
      }
    };
  },
  computed: {
    isFormTwoData: function () {
      if (this.title === '采集策略') {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    tempData: {
      handler (newVal) {
        if (this.isCollectPage) {
          this.formTwoData.dstIp.receive = newVal.addr.dstIp.or.join(';');
          this.formTwoData.dstIp.rejection = newVal.addr.dstIp.not.join(';');
          this.formTwoData.srcIp.receive = newVal.addr.srcIp.or.join(';');
          this.formTwoData.srcIp.rejection = newVal.addr.srcIp.not.join(';');
          this.formTwoData.dstPort.receive = newVal.port.dstPort.or.join(';');
          this.formTwoData.dstPort.rejection = newVal.port.dstPort.not.join(';');
          this.formTwoData.srcPort.receive = newVal.port.srcPort.or.join(';');
          this.formTwoData.srcPort.rejection = newVal.port.srcPort.not.join(';');
        }
      },
      deep: true
    }
  },
  created () {
    this.tempData = Object.assign({}, this.temp);
    this.changeLogicalOperator(this.tempData);
  },
  mounted () {
  },
  filters: {
  },
  methods: {
    change (item, msg, val) {
      if (item.title === 'proto') {
        let title = item.title;
        this.$set(this.radioData[title], msg, val);
      }
      this.$nextTick(() => {
        this.radioData = Object.assign({}, this.radioData);
      });
    },
    changeLogicalOperator (Obj) {
      for (let i in this.cardDataArr) {
        let str = this.cardDataArr[i];
        let data = {};
        let collectData = {};
        if (str === 'proto') {
          if (Obj[str]) {
            let label = Obj[str];
            for (let i in label) {
              if (i === 'or') {
                label[i].forEach((item) => {
                  data[item] = 'or' + item;
                });
              } else if (i === 'not') {
                label[i].forEach((item) => {
                  data[item] = 'not' + item;
                });
              }
            }
            this.radioData[str] = data;
          } else {
            this.radioData[str] = {};
          }
        } else {
          for (let j in Obj[str]) {
            if (Obj[str][j]) {
              let label = Obj[str][j];
              data[j] = {};
              collectData[j] = [];
              for (let i in label) {
                if (i === 'or') {
                  label[i].forEach((item) => {
                    data[j][item] = 'or' + item;
                    collectData[j].push(item);
                  });
                } else if (i === 'not') {
                  label[i].forEach((item) => {
                    collectData[j].push(item);
                    data[j][item] = 'not' + item;
                  });
                }
              }
              this.radioData[str] = data;
              this.collectData[str] = collectData;
            } else {
              this.radioData = {};
              this.radioData[str] = {};
            }
          }
        }
      }
    },
    changeLogicalOperatorToString (Obj) {
      for (let i in Obj.proto) {
        if (/not/g.test(Obj.proto[i])) {
          this.tempData.proto.not.push(i);
        } else if (/or/g.test(Obj.proto[i])) {
          this.tempData.proto.or.push(i);
        }
      }
    },
    addContent (title, label, str) {
      this.$nextTick(() => {
        let val = this.addData[label];
        this.collectData[title][label].push(val);
        this.addData[label] = '';
      });
    },
    check (col, items, con) {
      let value = $(`.${con.title}.${col.title} .el-input__inner`).eq(0).val();
      let msg = '';
      if (value) {
        try {
          msg = !msg && !isEnglishSymbol(value) ? '请使用英文标点符号' : msg;
          msg = !msg && hasEng(value) ? '不能包含英文字母' : msg;
          msg = !msg && !endSymbol(value) ? '请以分号结尾或不使用分号' : msg;
          value.split(';').forEach((item) => {
            if (item) {
              if (/-/g.test(item)) {
                item.split('-').forEach((data) => {
                  msg = con.subTitle === 'ip' ? !msg && !isipcheck(data) ? `${data}IP地址错误，请输入正确的IP地址` : msg
                    : !msg && !enabledPort(data) ? `${data}超出范围` : msg;
                  if (msg) throw new Error('StopForEach');
                });
              } else {
                msg = con.subTitle === 'ip'
                  ? !msg && !isipcheck(item)
                    ? `${item}IP地址错误，请输入正确的IP地址`
                    : msg
                  : !msg && !enabledPort(item)
                    ? `${item}超出范围`
                    : msg;
                if (msg) throw new Error('StopForEach');
              }
            }
          });
        } catch (e) {
          if (e.message !== 'StopIteration') throw e;
        }
        try {
          let colLabel = col.title === 'receive' ? 'rejection' : 'receive';
          let colTitle = colLabel === 'receive' ? '接收' : '拒收';
          let label = con.title;
          let formTwoData = Object.assign({}, this.formTwoData);
          value.split(';').forEach((item) => {
            formTwoData[label][colLabel].split(';').forEach((Item) => {
              let fir = /-/g.test(item);
              let sed = /-/g.test(Item);
              if (item) {
                if (con.subTitle === 'port') {
                  msg = fir
                    ? sed
                      ? !msg && (((Item.split('-')[0] - 0) >= (item.split('-')[0] - 0) && (Item.split('-')[0] - 0) <= (item.split('-')[1] - 0)) || ((item.split('-')[0] - 0) >= (Item.split('-')[0] - 0) && (item.split('-')[0] - 0) <= (Item.split('-')[1] - 0)))
                        ? `${item}与${colTitle}中的${Item}交集` : msg
                      : !msg && (Item - 0) >= (item.split('-')[0] - 0) && (Item - 0) <= (item.split('-')[1] - 0) ? `${item}包括${colTitle}中的${Item}` : msg
                    : sed
                      ? !msg && (item - 0) >= (Item.split('-')[0] - 0) && (item - 0) <= (Item.split('-')[1] - 0) ? `${item}在${colTitle}中的${Item}重复` : msg
                      : !msg && item === Item ? `${item}与${colTitle}中的${Item}重复` : msg;
                } else if (con.subTitle === 'ip') {
                  msg = fir
                    ? sed
                      ? !msg && ((ipToInt(Item.split('-')[0]) >= ipToInt(item.split('-')[0]) && ipToInt(Item.split('-')[0]) <= ipToInt(item.split('-')[1])) || (ipToInt(item.split('-')[0]) >= ipToInt(Item.split('-')[0]) && ipToInt(item.split('-')[0]) <= ipToInt(Item.split('-')[1])))
                        ? `${item}与${colTitle}中的${Item}交集` : msg
                      : !msg && ipToInt(Item) >= ipToInt(item.split('-')[0]) && ipToInt(Item) <= ipToInt(item.split('-')[1]) ? `${item}包括${colTitle}中的${Item}` : msg
                    : sed
                      ? !msg && ipToInt(item) >= ipToInt(Item.split('-')[0]) && ipToInt(item) <= ipToInt(Item.split('-')[1]) ? `${item}在${colTitle}中的${Item}重复` : msg
                      : !msg && ipToInt(item) === ipToInt(Item) ? `${item}与${colTitle}中的${Item}重复` : msg;
                }
              }
              if (msg) {
                throw new Error('StopForEach');
              }
            });
          });
        } catch (e) {
          if (e.message !== 'StopForEach') throw e;
        }
      }
      if (msg) {
        $(`.${con.title}.${col.title} .el-input__inner`).eq(0).css({'border-color': 'red'}).parent().next('.msg').text(msg);
      } else {
        $(`.${con.title}.${col.title} .el-input__inner`).eq(0).css({'border-color': '#DCDFE6'}).parent().next('.msg').text(msg);
      }
    },
    // 表格具有复选框 被选中的数据
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    action: function (row, col, item) {
      let data = Object.assign({}, this.temp);
      this.tempData = Object.assign(data, row);
      if (item.name === 'edit') {
        this.changeLogicalOperator(this.tempData);
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
      } else if (item.name === 'del') {
        this.handleDelete(this.tempData);
      }
    },
    handleClick (tab, event) {
    },
    // 通过按钮打开第二个对话框 使用element 中的MessageBox
    openDialogTree (item, temp) {
      let checked = temp[item.subTitle];
      this.dialogFormVisible_tree = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checked);
      });
    },
    handleCreateBtn () {
      this.isCreate = true;
      this.dialogFormVisible = true;
      this.tempData = Object.assign({}, this.temp);
    },
    submit: function () {
      this.dialogFormVisible = false;
      if (this.isFormTwoData) {
        for (let i in this.formTwoData) {
          if (/Ip/ig.test(i)) {
            this.tempData.addr[i].or = this.formTwoData[i].receive.split(';');
            this.tempData.addr[i].not = this.formTwoData[i].rejection.split(';');
          } else if (/port/gi.test(i)) {
            this.tempData.port[i].or = this.formTwoData[i].receive.split(';');
            this.tempData.port[i].not = this.formTwoData[i].rejection.split(';');
          }
        }
        this.tempData.proto.not.length = 0;
        this.tempData.proto.or.length = 0;
        this.changeLogicalOperatorToString(this.radioData);
      }
      if (this.isCreate) {
        this.handleCreate(this.tempData);
      } else {
        this.handleUpdate(this.tempData);
      }
    },
    submitTree: function () {
      this.tempData['treeData'] = this.$refs.tree.getCheckedKeys();
      this.dialogFormVisible_tree = false;
    },
    closeTree: function () {
      this.dialogFormVisible_tree = false;
    },
    Update (row) {
      let data = Object.assign({}, this.temp);
      this.tempData = Object.assign(data, row);
      this.isCreate = false; // 不是添加操作 是update操作
      // this.dialogFormVisible_tree = true;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    changeState (row, state) {
      // console.log(row, state);
      let data = Object.assign({}, row);
      let msg = null;
      if (this.title === '采集策略') {
        msg = !state ? '是否禁用该策略' : '是否启用该策略';
      }
      isContinue(this, this.handleChangeState, [data, state], msg);
    },
    // 表格内容中的显示设置
    showArray: function (row, column) {
      let result = '';
      for (let i in row[column.title]) {
        if (column.label === 'tag') {
          result += `<p @click="` + this.edit + `"
                        style="display: inline-block;margin-right: 8px;margin-bottom: 0!important;"
                        class="tag_p">` + row[column.title][i] + `</p>`;
        } else if (column.label === 'inline-block') {
          result += `<p style="display: inline-block;padding: 1px 2px;">` + row[column.title][i].name + `</p>`;
        } else {
          result += `<p style="margin-bottom: 0!important;">` + row[column.title][i] + `</p>`;
        }
      }
      return result;
    },
    showBoolean: function (row, column) {
      let result = '';
      if (column.subType === 'boolean') {
        if (column.label === 'button') {
          if (row[column.title]) {
            result = `<el-button type="text" icon="` + column.className[0] + `">` + column.subName[0] + `</el-button>`;
          } else {
            result = `<el-button type="text" icon="` + column.className[1] + `">` + column.subName[1] + `</el-button>`;
          }
        } else {
          if (row[column.title]) {
            result = `<span>` + column.subName[0] + `</span>`;
          } else {
            result = `<span>` + column.subName[1] + `</span>`;
          }
        }
      } else {
        column.judge.forEach(function (item, index) {
          if (item === row[column.title]) {
            result = `<span>` + column.subName[index] + `</span>`;
          }
        });
      }
      return result;
    },
    showObject: function (row, column) {
      let result = '';
      let data = '';
      for (let i in row[column.title]) {
        if (column.output === 'string') {
          data = this.joinProto(row[column.title]);
          // result = data;
          result = `<p class="ellipsis" title="${data}">${data}</p>`;
        } else if (column.output === 'arrString') {
          if (column.subName[i]) {
            data = this.joinProto(row[column.title][i]);
            result += `<p class="ellipsis" title="${data || '所有'}">` + column.subName[i] + ':' + (data || '所有') + `</p>`;
          }
        } else {
          if (column.subName[i]) {
            result += `<p class="ellipsis" title="${row[column.title][i][i] || '所有'}">` + column.subName[i] + ':' + (row[column.title][i][i] || '所有') + `</p>`;
          }
        }
      }
      return result;
    },
    // 当对话框关闭时，初始化tempData
    resetTemp: function () {
      this.tempData = Object.assign({}, this.temp);
      if (this.cardData.length) {
        this.tabTitle = 'proto';
        this.radioData.proto = {};
      }
      if (this.$refs.dialogTable) {
        this.$nextTick(() => {
          this.$refs.dialogTable[0].clearSelection();
        });
      }
    },
    resetTempDataTree: function () {
      this.$refs.tree.setCheckedKeys([]);
    },
    close: function () {
      this.dialogFormVisible = false;
      this.tempData = Object.assign({}, this.temp);
    }
  }
};
</script>

<style>
  .tag_p{
    color: RGB(45,168,249);
    background: rgba(144,147,153,.1);
    border-radius: 5px;
  }
</style>
