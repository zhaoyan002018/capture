<template>
  <div>
    <div>
      <pub-btn type="submit" icon="el-icon-plus" value="添加图表" @click="handleAddChart"></pub-btn>
      <pub-btn type="submit" icon="el-icon-plus" value="添加表格" @click="handleAddTable"></pub-btn>
    </div>
    <div id="container">
      <!--container中的表格和图标需要在js中动态的去生成。-->
      <ul></ul>
    </div>
  </div>
</template>
<script>
import PubBtn from '@/components/dpsTable/pubButton';
export default {
  data () {
    return {
      dataList: [{ title: '测试1', type: 'table', enabled: true, link: 'test' },
        { title: '测试2', type: 'pie', enabled: true, link: 'test2' },
        { title: '测试3', type: 'line', enabled: true, link: 'test3' },
        { title: '测试4', type: 'bar', enabled: true, link: 'test4' }]
    };
  },
  components: {
    PubBtn
  },
  mounted () {
    this.getData();
  },
  methods: {
    getData: function () {
      this.createElementLi();
    },
    handleAddChart: function () {

    },
    handleAddTable: function () {
    },
    createElementLi: function () {
      let el = '';
      this.dataList.forEach((item) => {
        el += `<li>
                <a :href="${item.link}" :title="${item.title}">
                    <div class="Li_title">${item.title}</div>
                    <div class="Li_img"></div>
                </a>
              </li>`;
      });
      $('#container ul').append(el);
    }
    // createLiItem: function (obj) {
    //   switch (obj.type) {
    //     case 'table': return
    //   }
    // }
  }
};
</script>

<style scoped>
  .Li_title{

   }
  .Li_img{

  }
</style>
