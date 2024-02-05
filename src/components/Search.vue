<template>
  <div class="container">
    <div class="text-center">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Start typing..."
          v-model="searchQuery"
          @keydown.enter="searchStations"
          ref="searchInput"
        />
        <button class="btn btn-primary" @click="searchStations">Search</button>
      </div>
    </div>
    <div class="scrollable-box">
      <ul v-if="transportResults.length" class="list-group">
        <li
          v-for="(result, index) in sortedResults"
          :key="index"
          class="list-group-item"
          @click="selectStop(result)"
          :class="{ 'active-result': activeResultIndex === index }"
        >
          <div class="result">
            <div class="result-left">
              {{ result.stop.fullName }}
              <div v-if="result.nswIcons.length">
                <img
                  v-for="(icon, index) in result.nswIcons"
                  :key="index"
                  :src="`${getIconPath(icon)}`"
                  :alt="icon"
                />
              </div>
            </div>
            <div class="result-right">
              <div class="result-top">
                {{ result.stop.locality }}
              </div>
              <div class="result-bottom">
                {{ result.stop.code ? result.stop.code : result.stop.id }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>No results found.</p>
    </div>
    <div class="departure-box">
      <div v-if="departureResults.length">
        <div v-for="(departure, index) in departureResults" :key="index">
          <div>
            <span>{{ departure.tripInstance.trip.route.name }}</span>
            <span> - {{ departure.tripInstance.trip.headsign.headline }}</span>
            <span v-if="departure.vehicle.lastPosition && departure.vehicle.lastPosition.statusString">
              <br />{{ departure.vehicle.lastPosition.statusString }}
            </span>
          </div>
          <div>
            <span>{{ departure.tripInstance.trip.headsign.subtitle }}</span>
            <span v-if="departure.vehicle">
              <span>Operated by {{ departure.tripInstance.trip.route.agency.name }}</span>
              <span>{{ departure.time }}</span>
              <span v-if="departure.vehicle.vehicleModel">
                <br />{{ departure.vehicle.vehicleModel }}
              </span>
            </span>
          </div>
          <br />
        </div>
      </div>
        <p v-else>No departures found.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      transportResults: [],
      departureResults: [],
      activeResultIndex: -1,
    };
  },
  props: {
    host: String,
    sortingOption: String,
    region: String,
  },
  computed: {
    regionComputed() {
      return this.region;
    },
    sortedResults() {
      let results = [...this.transportResults];
      if (this.sortingOption === 'score') {
        results.sort((a, b) => b.search.score - a.search.score);
      } else if (this.sortingOption === 'alphabetical') {
        results.sort((a, b) =>
          a.stop.fullName.localeCompare(b.stop.fullName)
        );
      }
      return results.map((result) => {
        const nswModes = result.stop.modes
          ? result.stop.modes.filter((mode) => mode.startsWith('au2:'))
          : [];
        const nswIcons = nswModes.map((mode) => {
          const icon = mode.split(':')[1];
          return `${icon}.svg`;
        });
        return { ...result, nswIcons };
      });
    },
  },
  watch: {
    region(newRegion) {
      if (this.searchQuery) {
        this.searchStations(); // Re-run the search when region changes and searchQuery is not empty
      }
    },
  },
  mounted() {
    this.$refs.searchInput.focus(); // Focus the search input on component mount
  },
  methods: {
    async searchStations() {
      const apiUrl = `${this.host}/api/search?region=${this.region}&limit=20&q=${this.searchQuery}`;
      await this.fetchData(apiUrl, 'station');
    },
    async fetchData(apiUrl, dataType) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.info(`INFO - Received ${dataType} Data:`, data);
        if (dataType === 'station') {
          this.transportResults = data.response.stops;
        } else if (dataType === 'departure') {
          this.departureResults = data.response.departures;

          if (this.departureResults.length > 0) {
            console.log('First Departure:', this.departureResults[0]);
          }
        }
      } catch (error) {
        console.error('USR_ERR:', error);
      }
    },
    async selectStop(result) {
      try {
        console.info('INFO - Selected Stop:', result);
        const query = result.stop.id;
        const apiUrl = `${this.host}/api/departures?region=${this.region}&query=${query}`;
        console.log(apiUrl);
        await this.fetchData(apiUrl, 'departure');
      } catch (error) {
        console.error('USR_ERR:', error);
      }
    },
    getIconPath(icon) {
      // Define a mapping of regions to their corresponding icon folders
      const regionsToIconFolders = {
        au2: 'tfnsw',
        au4: 'translink',
        au8: 'nttransport',
        au9: 'actgov',
        au3: 'vicptv',
        au5: 'adelaidemetro',
        nz0: 'nzicons',
      };
      
      const defaultIconFolder = 'tfnsw';
      const iconFolder = regionsToIconFolders[this.region] || defaultIconFolder;
      const returnPath = `/icons/${iconFolder}/${icon}`;
      return returnPath;
    },
  },
};
</script>

<style scoped>
/* Scrollable container for results and departures */
.scrollable-box {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
}

/* Override Bootstrap hover style for list items */
.list-group-item {
  cursor: pointer;
}

/* Styles for individual search result and departure info */
.result {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-left {
  flex: 1;
  word-wrap: normal;
  text-align: left;
  max-width: 60%;
}

.result-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.result-top {
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
}

/* Styles for departure box */
.departure-box {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
