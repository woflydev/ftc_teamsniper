<template>
  <nav class="navbar navbar-expand-md border-bottom border-body" data-bs-theme="dark">
    <div class="container">
      <a class="navbar-brand" href="#">
        FTC TeamSniper
      </a>
      <div class="navbar-text me-auto">
        {{ currentTime }}
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentTime: '',
      currentTimeUpdateCall: null,
      regionTimezones: {
        au2: 'Australia/Sydney',
        au4: 'Australia/Brisbane',
        nz0: 'Pacific/Auckland',
      },
    };
  },
  methods: {
    initTime() {
      const timezone = this.regionTimezones['au2']; // Assuming default region is 'au2'
      if (this.currentTimeUpdateCall) {
        clearInterval(this.currentTimeUpdateCall);
      }
      this.currentTimeUpdateCall = setInterval(() => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat([], {
          timeZone: timezone,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        this.currentTime = formatter.format(now);
      }, 1000);
    }
  },
  created() {
    this.initTime();
  },
};
</script>

<style scoped>
/* Add any custom CSS styles here if needed */
</style>
