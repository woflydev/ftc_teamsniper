<template>
  <div class="container">
    <div class="text-center">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search for season (e.g. 2023)"
          v-model="searchQuery"
          @keydown.enter="searchTeams"
          ref="searchInput"
        />
        <button class="btn btn-primary" @click="searchTeams">Search</button>
      </div>
    </div>
    <div class="scrollable-box">
      <ul class="list-group">
        <li
          v-for="(team, index) in allTeams"
          :key="index"
          class="list-group-item"
          @click="selectTeam(team)"
          :class="{ 'active-result': activeResultIndex === index }"
        >
          <div class="result">
            <div class="result-left">
              {{ team.teamNumber }} - {{ team.nameShort }}
            </div>
            <div class="result-right">
              <div class="result-top">
                {{ team.city }}, {{ team.stateProv }}, {{ team.country }}
              </div>
              <div class="result-bottom">
                Rookie Year: {{ team.rookieYear }}
              </div>
            </div>
          </div>
        </li>
        <li v-if="loading" class="list-group-item">
          <div>Hold on, combing through records...</div>
        </li>
        <li v-if="noResults" class="list-group-item">
          <div>No such season!</div>
        </li>
      </ul>
      <p v-if="!allTeams.length && !loading && !noResults">No results found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    host: String,
  },
  data() {
    return {
      searchQuery: '',
      allTeams: [],
      activeResultIndex: -1,
      loading: false,
      noResults: false,
      totalPages: 0,
    };
  },
  methods: {
    async searchTeams() {
      this.loading = true;
      this.noResults = false;
      this.allTeams = []; // clear

      const pageTotalUrl = `${this.host}/api/search?year=${this.searchQuery}&page=1`;
      let pageTotalResponse;
      try {
        pageTotalResponse = await axios.get(pageTotalUrl);
      } catch {
        this.loading = false;
        this.noResults = true;
        return;
      }
      
      this.totalPages = pageTotalResponse.data.pageTotal;

      for (let page = this.totalPages; page >= 1; page--) {
        const pageUrl = `${this.host}/api/search?year=${this.searchQuery}&page=${page}`;
        const pageResponse = await axios.get(pageUrl);
        const sortedPageData = pageResponse.data.teams.sort((a, b) => b.teamNumber - a.teamNumber);
        this.allTeams = this.allTeams.concat(sortedPageData);
        this.allTeams = this.allTeams.filter(team => /^\d{1,5}$/.test(team.teamNumber.toString()) && team.rookieYear >= 2000);

        await this.$nextTick();
      }

      this.loading = false;
    },

    async selectTeam(team) {
      try {
        console.info('INFO - Selected Team:', team);
        window.open(`https://www.theorangealliance.org/teams/${team.teamNumber}`, '_blank')
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
