<template>
  <div class="container">
    <div class="text-center">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Start typing..."
          v-model="searchQuery"
          @keydown.enter="searchTeams"
          ref="searchInput"
        />
        <button class="btn btn-primary" @click="searchTeams">Search</button>
      </div>
    </div>
    <div class="scrollable-box">
      <ul v-if="teamResults.length" class="list-group">
        <li
          v-for="(team, index) in teamResults"
          :key="index"
          class="list-group-item"
          @click="selectTeam(team)"
          :class="{ 'active-result': activeResultIndex === index }"
        >
          <div class="result">
            <div class="result-left">
              {{ team.teamNumber }} - {{ team.teamName }}
            </div>
            <div class="result-right">
              <div class="result-top">
                {{ team.location }}
              </div>
              <div class="result-bottom">
                {{ team.rookieYear }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <p v-else>No results found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      teamResults: [],
      activeResultIndex: -1,
    };
  },
  methods: {
    async searchTeams() {
      const apiUrl = `${this.host}/v2.0/2023/teams?page=1`;
      await this.fetchData(apiUrl, 'team');
    },
    async fetchData(apiUrl, dataType) {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data; // Adjust this based on the actual structure of the API response
        console.info(`INFO - Received ${dataType} Data:`, data);
        
        if (dataType === 'team') {
          this.teamResults = data.teams; // Adjust this based on the actual structure of the API response
        }
      } catch (error) {
        console.error('USR_ERR:', error);
      }
    },
    async selectTeam(team) {
      try {
        console.info('INFO - Selected Team:', team);
        // Add logic to handle the selected team, if needed
      } catch (error) {
        console.error('USR_ERR:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Scrollable container for results */
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

/* Styles for individual search result */
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
</style>
