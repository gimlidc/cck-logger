<template>
  <div id="app">
    <div v-for="facility in facilities" :key="facility.url">
      <a :href="facility.url">
        <div class="facilityName">
          {{ facility.name }}
        </div>
        <div class="facilityLocation">
          {{ facility.location }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import {loadListOfFacilities} from "@/remote";

export default {
  name: 'App',
  data() {
    return {
      facilities: [],
      changes: {}
    }
  },
  methods: {
    loadFacilities: async function() {
      loadListOfFacilities((errors, data) => {
        console.log(data["Body"].toString())
        if (data === null || errors) return;

        this.facilities = data["Body"].toString().split("\n").map(line => {
          let fields = line.split(";");
          return {
            name: fields[0],
            url: fields[1],
            location: fields[2]
          }
        });
      })
    }
  },
  mounted() {
    this.loadFacilities()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
