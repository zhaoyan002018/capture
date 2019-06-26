<script>
import { Dialog } from 'element-ui';
export default {
  name: 'ExDialog',
  mixins: [Dialog],
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.appendToBody ) {
      document.body.appendChild(this.$el);
    }
  }
}
</script>
