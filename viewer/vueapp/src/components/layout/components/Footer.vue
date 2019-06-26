<template>

  <div class="footer">
    <p>
      <small>
        {{dpsVersion}} |
        <a v-if="this.$constants.DPS_WEBSITE.indexOf('http') !== -1" :href="this.$constants.DPS_WEBSITE" target="_blank">{{this.$constants.DPS_SHORT_COMPANY}}</a>
        <a v-else :href="'http://' + this.$constants.DPS_WEBSITE" target="_blank">{{this.$constants.DPS_SHORT_COMPANY}}</a>
        <span v-if="responseTime && !loadingData">
          | {{ responseTime | commaString }}ms
        </span>
        <span v-if="loadingData">
          |
          <span class="fa fa-spinner fa-spin fa-lg text-theme-accent">
          </span>
        </span>
      </small>
    </p>
  </div>

</template>

<script>
export default {
  name: 'MolochFooter',
  data: function () {
    return {
      dpsVersion: this.$constants.DPS_VERSION
    };
  },
  computed: {
    responseTime: function () {
      return this.$store.state.responseTime;
    },
    loadingData: function () {
      return this.$store.state.loadingData;
    }
  }
};
</script>

<style scoped>
.footer {
  text-align: center;
  color: var(--color-gray-dark);
  border-top: 1px solid var(--color-gray-light);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 25px;
  line-height: 25px;
  overflow: hidden;
}
</style>
