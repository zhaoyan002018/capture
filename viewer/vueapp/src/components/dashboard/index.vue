<template>
  <div class="dashboard-container" style="height: 100%;">
    <admin-dashboard></admin-dashboard>
  </div>
</template>

<script>
import adminDashboard from './admin';

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data () {
    return {
    };
  }
};
</script>
