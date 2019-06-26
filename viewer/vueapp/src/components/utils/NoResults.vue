<template>

  <div class="info-area vertical-horizontal-center">

    <div v-if="parseInt(recordsTotal) === 0">
      <span class="fa fa-3x text-muted-more fa-exclamation-triangle">
      </span>&nbsp;
      {{$t('noResults.empty')}}
    </div>

    <div v-else-if="!recordsTotal || recordsTotal > 0">
      <span class="fa fa-3x text-muted-more fa-folder-open">
      </span>&nbsp;
      {{$t('noResults.noresult')}}
      <small v-if="view"
        class="text-theme-primary">
        <br>
        {{$t('noResults.noforget')}}:
        <strong>{{ view }}</strong>
      </small>
    </div>

  </div>

</template>

<script>
export default {
  name: 'MolochNoResults',
  props: [ 'recordsTotal', 'view' ]
};
</script>

<style scoped>
.info-area {
  font-size: var(--px-xxlg);
}
</style>
