<template>

  <div>
    <!-- page size -->
    <el-select v-model="length" size="mini">
      <el-option v-for="option of lengthOptions" :key="option.value" :label="option.label" :value="option.value">
      </el-option>
    </el-select><!-- /page size -->
    <!-- paging -->
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="length"
      :total="recordsFiltered"
      @current-change="notifyParent">
    </el-pagination><!-- paging -->
    <!-- page info -->
    <div class="pagination-info cursor-help"
      v-b-tooltip.hover
      :title="pagingInfoTitle">
      显示 {{ start + 1 }}
      <span v-if="recordsFiltered">
        - {{ Math.min((start + length), recordsFiltered) }}
      </span>
      of {{ recordsFiltered | commaString }} entries
    </div> <!-- /page info -->
  </div>

</template>

<script>
export default {
  name: 'MolochPaging',
  props: [ 'recordsTotal', 'recordsFiltered', 'lengthDefault' ],
  watch: {
    length: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.notifyParent();
      }
    }
  },
  data: function () {
    return {
      start: 0,
      currentPage: 1
    };
  },
  computed: {
    length: {
      get: function () {
        // only allow a maximum of 1000
        return Math.min(parseInt(this.$route.query.length || this.lengthDefault || 50), 1000);
      },
      set: function (newValue) {
        if (newValue !== this.length) {
          this.$router.push({ query: { ...this.$route.query, length: newValue } });
        }
      }
    },
    lengthOptions: function () {
      let options = [
        { value: 10, label: '10 /页' },
        { value: 50, label: '50 /页' },
        { value: 100, label: '100 /页' },
        { value: 200, label: '200 /页' },
        { value: 500, label: '500 /页' },
        { value: 1000, label: '1000 /页' }
      ];

      let exists = false;
      for (let option of options) {
        if (this.length === option.value) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        options.push({
          value: this.length,
          label: `${this.length} /页`
        });
      }

      options.sort(function (a, b) {
        return a.value - b.value;
      });

      return options;
    },
    pagingInfoTitle: function () {
      let total = this.$options.filters.commaString(this.recordsTotal);
      return `（总计：${total}项）`;
    }
  },
  methods: {
    notifyParent: function (val) {
      this.start = (val - 1) * this.length | this.currentPage - 1;

      let pagingParams = {
        start: Number(this.start),
        length: Number(this.length)
      };

      this.$emit('changePaging', pagingParams);
    }
  }
};
</script>

<style scoped>
.pagination {
  display: inline-flex;
}

select.page-select {
  width: 120px;
  font-size: .8rem;
  display: inline-flex;
  height: 31px !important;
  margin-top: 1px;
  margin-right: -5px;
  margin-bottom: var(--px-xs);
  padding-top: var(--px-xs);
  padding-bottom: var(--px-xs);
  border-right: none;
  border-radius: var(--px-sm) 0 0 var(--px-sm);
  border-color: var(--color-gray-light);
  -webkit-appearance: none;
}

.pagination-info {
  display: inline-block;
  font-size: .8rem;
  color: var(--color-gray-dark);
  border: 1px solid var(--color-gray-light);
  padding: 5px 10px;
  margin-left: -6px;
  border-radius: 0 var(--px-sm) var(--px-sm) 0;
  background-color: var(--color-white);
}
</style>
