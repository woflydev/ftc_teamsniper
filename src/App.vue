<template>
  <div>
    <!-- Include the AppHeader component -->
    <AppHeader
      :selectedRegionLabel="selectedRegion ? selectedRegion.label : 'Region'"
      :regions="regions"
      @sorting-option-selected="changeSorting"
      @region-selected="changeRegion"
    />

    <!-- Content goes here -->
    <div class="container mt-4">
      <div class="container mt-4">
        <Search
          :host="host"
          :sortingOption="sortingOption"
          :region="selectedRegion.key"
          ref="searchComponent"
        />
    </div>
    </div>
    
    <!-- Container for the Explainer component -->
    <div class="container mt-4">
      <Explainer />
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import Search from './components/Search.vue';
import Explainer from './components/Explainer.vue';
</script>

<script>

const host = `${window.location.protocol}//${window.location.host}`;
const allowedSortingOptions = ['relevance', 'alphabetical'];
const regions = [
  { key: 'au2', label: 'NSW' },
  { key: 'au4', label: 'QLD' },
  { key: 'au8', label: 'NT' },
  { key: 'au9', label: 'ACT' },
  { key: 'au3', label: 'MEL' },
  { key: 'au5', label: 'ADL' },
  { key: 'nz0', label: 'New Zealand' },
];

export default {
  components: {
    AppHeader,
    Search,
  },
  data() {
    const allowedSortingOptions = ['relevance', 'alphabetical'];
    const storedSortingOption = localStorage.getItem('sortingOption');
    const defaultSortingOption = allowedSortingOptions.includes(storedSortingOption)
      ? storedSortingOption
      : 'relevance';

      const storedRegion = JSON.parse(localStorage.getItem('selectedRegion'));
      const defaultRegion = storedRegion && regions.some(region => region.key === storedRegion.key)
        ? storedRegion
        : regions.find(region => region.key === 'au2');

      return {
        sortingOption: defaultSortingOption,
        selectedRegion: defaultRegion, // Initialize it as an object
        regions,
      };
  },
  methods: {
    changeSorting(option) {
      if (allowedSortingOptions.includes(option)) {
        this.sortingOption = option;
        localStorage.setItem('sortingOption', option);
      } else {
        console.warn("WARN: Sorting option not found. Set to default.")
        this.sortingOption = 'relevance';
        localStorage.setItem('sortingOption', 'relevance');
      }
    },
    changeRegion(option) {
      if (regions.some(region => region.key === option)) {
        this.selectedRegion = regions.find(region => region.key === option);
        localStorage.setItem('selectedRegion', JSON.stringify(this.selectedRegion));
      } else {
        console.warn("WARN: Region code not found. Set to default.")
        this.selectedRegion = regions[0];
        localStorage.setItem('selectedRegion', JSON.stringify(regions[0]));
      }
    },
  },
};
</script>


<style scoped>
/* Custom CSS to control the width of the Explainer component */
.container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
