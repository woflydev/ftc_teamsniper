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
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      currentTime: '',
      currentTimeUpdateCall: null,
    };
  },
  methods: {
    async initTime() {
      try {
        const { coords } = await this.getCurrentPosition();
        const timezone = await this.getTimezone(coords.latitude, coords.longitude);
        
        if (this.currentTimeUpdateCall) {
          clearInterval(this.currentTimeUpdateCall);
        }
        
        this.currentTimeUpdateCall = setInterval(() => {
          const now = DateTime.now().setZone(timezone);
          this.currentTime = now.toFormat('HH:mm:ss');
        }, 1000);
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    },
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    getTimezone(latitude, longitude) {
      return new Promise((resolve, reject) => {
        const timezoneUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=ARUW81SI55Z9&format=json&by=position&lat=${latitude}&lng=${longitude}`;
        
        fetch(timezoneUrl)
          .then(response => response.json())
          .then(data => {
            resolve(data.zoneName || 'UTC'); // Default to UTC if no timezone data is available
          })
          .catch(error => {
            console.error('Error getting timezone:', error);
            reject(error);
          });
      });
    },
  },
  mounted() {
    this.initTime();
  },
};
</script>

<style scoped>
/* Add any custom CSS styles here if needed */
</style>
