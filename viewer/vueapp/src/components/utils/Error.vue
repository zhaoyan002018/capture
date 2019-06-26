<template>

  <div class="info-area vertical-center">
    <div class="text-danger" style="width: calc(100% - 36px);">
      <span class="fa fa-2x fa-warning">
      </span>
      <span v-if="message">
        {{ message }}
      </span>
      <span v-else-if="messageHtml"
        v-html="messageHtml">
      </span>
    </div>
  </div>

</template>

<script>
export default {
  name: 'MolochError',
  props: [ 'message', 'messageHtml' ]
};
</script>

<style scoped>
.info-area > .text-danger {
  white-space: pre-line;
  line-height: 1.1em;
  font-size: var(--px-xxlg);
}
</style>
