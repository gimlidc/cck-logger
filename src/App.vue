<template>
  <div id="app">
    <h2>Přehled změn v "aktualitách" sociálního zařízení</h2>
    <p>Datum v horním indexu obsahuje datum změny, první změna byla 18.11.2020 (první načtení aplikace). Pro aktualizaci si tedy stačí pamatovat, kdy jste aktuality procházeli naposledy a brát pouze data, která jsou vyšší.</p>
    <p>Změny jsou ukazovány za posledních 7 dní. Cokoli jde upravit (dejte mi vědět #Slack pomahamepraze @Honza Blažek (nebo gimli@matfyz.cz)</p>
    <div class="location" v-for="location in locations" :key="location">
      <div class="locationName"
           @click="toggleLocation(location)">{{ location }}</div>
      <div v-for="facility in getFacilities(location)"
           :key="facility.name"
           class="facility">
        <a :href="facility.url">
          <div class="facilityName">
            {{ facility.name }}
          </div>
        </a>
        <div class="diff"
             v-for="report in changes"
             :key="report.date"
             v-show="report.websites.map(website => website.url).indexOf(facility.url) !== -1">
          {{ report.date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {loadListOfFacilities, loadReport} from "@/remote";

export default {
  name: 'App',
  data() {
    return {
      locations: [],
      facilities: [],
      changes: [],
      shown: {}
    }
  },
  methods: {
    toggleLocation(location) {
      console.log(location)
      this.shown[location] = !this.shown[location];
      console.log(this.shown[location])
    },
    getFacilities(location) {
      return this.facilities.filter(facility => facility.location === location)
    },
    loadFacilities() {
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
        this.locations = new Set(this.facilities.map(facility => facility.location))
        this.locations.map(location => this.shown[location]=false)
      })
    },
    loadReports() {
      let now = new Date()
      for (let i = 0; i < 7; i++) {
        let date = new Date()
        date.setDate(now.getDate() - i)
        loadReport((errors, response) => {
              if (response === null || errors) return;
              console.log(response["LastModified"])
              this.changes.push({
                date: date.toISOString().substring(0, 10),
                websites: response["Body"].toString().split("\n").map(line => {
                  let fields = line.split(";")
                  return {
                    name: fields[0],
                    url: fields[1]
                  }
                })
              })
            },
            date.toISOString().substring(0, 10))
      }
    }
  },
  mounted() {
    this.loadFacilities()
    this.loadReports()
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

.facilityName, .facilityLocation, .diff {
  display: inline-block;
}

.facility {
  background-color: lightgray;
}
.location {
  background-color: #2c3e50;
}

.locationName {
  text-align: left;
  background-color: white;
}

.diff {
  font-size: xx-small;
  vertical-align: super;
  position: relative;
  top: -0.3em;
  border: 1px solid gray;
  padding: 1px;
  margin-left: 2px;
}
</style>
