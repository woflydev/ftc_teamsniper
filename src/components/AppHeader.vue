<template>
  <nav class="navbar navbar-expand-md border-bottom border-body" data-bs-theme="dark">
    <div class="container">
      <a class="navbar-brand" href="#">
        ZeroTrip
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
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="regionDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedRegionLabel }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="regionDropdown">
              <li
                v-for="region in regions"
                :key="region.key"
                @click="selectRegion(region)"
              >
                <a class="dropdown-item">{{ region.label }}</a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="sortingDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort By
            </a>
            <ul class="dropdown-menu" aria-labelledby="sortingDropdown">
              <li @click="selectSortingOption('relevance')">
                <a class="dropdown-item">By Relevance</a>
              </li>
              <li @click="selectSortingOption('alphabetical')">
                <a class="dropdown-item">Alphabetical Order</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    selectedRegionLabel: String,
    regions: Array,
  },
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
    selectSortingOption(option) {
      this.$emit('sorting-option-selected', option);
    },
    selectRegion(region) {
      this.$emit('region-selected', region.key);
    },
    initTime() {
      const timezone = this.regionTimezones[this.regions.find(
        (region) => region.label === this.selectedRegionLabel
      ).key];
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
  watch: {
    selectedRegionLabel() {
      this.initTime();
    },
  },
};
</script>

<style scoped>
/* Add any custom CSS styles here if needed */
</style>