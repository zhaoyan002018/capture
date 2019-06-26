/**
 * DpsTable
 *
 * 配置表格的通用组件，可以通过标签 dps-table 使用表格
 *
 * 使用时需要传参：参数格式有以下内容，使用时可挑选添加
 *
 * 初始样子如下，如果使用过程中有新添加的类型，令做好备注
 */

data= [{
  index: 1, name: 'eth1',mtu: 1500,addrs: ['10.251.251.251/24', 'fe80::20c:29ff:fe02:3c4b/64'],
  Link: ['等保1区', '等保2区', ''],state: 'Down', enabled: true
}] // 表格主体内容


/**
 * 参数：变量
 * *******必填*******
 * name: String 表头名称  必填
 * title: Stging 数据所对应的key值(同data中的index、name、addrs...)通过该值去输出表格内容 必填
 *
 * title值为action 表明对应的列为操作，
 * action: [] Array // 暂时未处理
 *
 * *******选填*******
 * sort: String 以sort内容排序
 * help：String 鼠标悬停时tooltip对应的提示信息
 * width：Number 自定义表格的宽度
 *
 * type: String 如果数据不是number|string，则需要设置type值
 *
 *
 * type=boolean
 * subName:[] Array 满足条件时，在页面上显示对应的值
 * judge: [] Array 判断条件，当存在多个条件时使用，与subName中的值一一对应
 * subType: String 对判断条件进行二次判断，如果subType='boolean'，表明数据为true|false
 * ########## judge和subType 二选其一 ##########
 *
 * type=array
 * label: String 如果对输出的数据有其他要求，通过设置label的值，做出对应的跳转显示 eg：label='tag' 会给输出标签 添加style和class='tag_p'
 *
 * */
columns = [{
  name: '序号',type:'string', sort: 'timestamp', help: this.$t('history.timeHelper')
},{
  name: '状态', subName1: '启用', suvName2: '禁用', title: 'enabled', type: 'boolean', sort: 'view.name', help: this.$t('history.viewNameHelper') },
  {name: 'MTU', title: 'state', subName1: '启用', suvName2: '禁用', judge: 'DOWN', type: 'boolean', sort: 'expression', nowrap: true, width: 27, exists: false, help: this.$t('history.expressionHelper'),
  // 如果传过来的值是Boolean值，subName1指为true时输出内容，subName2指值为false时输出内容， judge指属性值不为true|false时，进行判断的依据
},{
  name: '操作', title: 'action', action: [{name: 'edit', fun: this.edit}, {name: 'del', fun: this.del}]
  // 对于表格最后一列可能出现的操作，添加了action属性，name(1.使用到的svg的name) fun: 这个svg图表所对应的方法，方法和columns应该写在同一个vue文件中
}]


btn = {
  handleCreate: false,// 手动添加[添加]按钮
  refresh: true //刷新按钮
}// 表格上方使用的按钮
