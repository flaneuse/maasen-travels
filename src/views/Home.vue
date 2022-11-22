<template>
<div>
  <h1>
    How many counties in the United States have the Hughes family visited?
  </h1>
  <table v-if="totals">
    <tr v-for="(person, pIdx) in people" :key="pIdx" class="text-right">
      <!-- <td class="px-2"> -->
      <!-- <input type="checkbox" :id="person" :value="person" v-model="selectedPeople"> -->

      <!-- <label class="b-contain m-auto">
              <input v-model="selectedPeople" :id="person" :value="person" type="checkbox" />
              <div class="b-input" />
            </label> -->
      <!-- </td> -->
      <td class="px-2">
        <h3>{{person}}</h3>
      </td>
      <td class="px-2">
        <h3>{{totals[person]["total"]}}</h3>
      </td>
      <td class="px-2">
        <svg :width="totalBarWidth" :height="totalBarHeight">
          <rect :width="totals[person]['barWidth']" :height="totalBarHeight" :fill="colorPalette[person]['color']"></rect>
          <rect :width="totalBarWidth/2" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
          <rect :width="totalBarWidth/4" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
          <rect :width="(totalBarWidth/4)*3" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
          <rect :width="totalBarWidth" :height="totalBarHeight" fill="none" stroke="#000"></rect>
        </svg>
      </td>
      <td>
        {{totals[person]["percentFormatted"]}} complete
      </td>
    </tr>
  </table>

  <div id="legend" class="d-flex flex-wrap my-4 mx-5">
    <div v-for="(item, idx) in colorPalette" :key="idx" class="d-flex mx-3">
      <div :style="{width: '20px', height: '20px', backgroundColor: item.color, marginRight: '10px'}">
      </div>
      <div>
        {{ item.label}}
      </div>
    </div>

  </div>

  <!-- TODO: switch bar graph by number of counties, percent area, percent pop -->
  <!-- TODO: filters: on/off for people -->
  <!-- TODO: bar graphs by state -->
  <!-- TODO: zoom into a state -->
  <!-- TODO: loading spinner -->
  <!-- TODO: avoid too many API calls? cache? -->
  <!-- TODO: button to check for new data, save as .geojson -->
  <!-- TODO: add data last fetched info -->
  <!-- TODO: migrate to real Google API -->
  <!-- TODO: fix styling -->
  <!-- TODO: fix nav bar -->
  <!-- TODO: font awesome import fix -->
  <!-- TODO: bootstrap import, styling, classes -->
  <!-- TODO: basemap: get hwys, opacity slider, city labels on top -->
  <!-- TODO: refactor for multiple people -->
  <!-- TODO: Weight by pop, area, percent -->
  <!-- TODO: zoom to state (sep page?), mini map, table (missing, completed x person with name/pop/area + total), % complete bar-->
  <!-- TODO: mobile responsiveness -->
  <!-- TODO: button to zoom to reset to full view -->
  <!-- TODO: fix zoom/pan extent -->
  <!-- TODO: dim other counties, highlight with stroke on mouseover -->
  <!-- TODO: remove unneccessary packages -->
  <!-- TODO: switch data to updated maps -->
  <!-- TODO: merge in additional data? -->
  <!-- TODO: fix API Key -->

  <l-map :style="mapStyle" :zoom="zoom" :minZoom="minZoom" :maxZoom="maxZoom" :center="center">
    <!-- :bounds="bounds" :max-bounds="maxBounds"> -->
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-geo-json :geojson="geojson" :options="options" :options-style="styleFunction"></l-geo-json>
    <l-geo-json :geojson="states" :options-style="styleFunctionState"></l-geo-json>
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
  </l-map>


</div>
</template>

<script>
// @ is an alias to /src

// import L from 'leaflet';
import {
  // latLngBounds
} from "leaflet";
import {
  LMap,
  LTileLayer,
  LGeoJson
} from 'vue2-leaflet';

// basemap from https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html
// dictionary: https://www.census.gov/programs-surveys/geography/technical-documentation/records-layout/gaz-record-layouts.html
import COUNTIES from "@/assets/cb_2018_us_county_20m.json";
import STATES from "@/assets/cb_2018_us_state_20m.json";

import {
  format
} from "d3-format";

import {
  nest
} from "d3-collection";

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data() {
    return ({
      fetchData: true,
      fillOpacity: 0.6,
      height: 800, // height of map in px

      // basemaps
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
      labelUrl: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png',
      // url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
      // labelUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      // url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      // labelUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
      // url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      // map params
      center: [38.967243, -103.771556],
      // bounds: latLngBounds([
      //   [40.70081290280357, -74.26963806152345],
      //   [40.82991732677597, -74.08716201782228]
      // ]),
      // maxBounds: latLngBounds([
      //   [40.70081290280357, -74.26963806152345],
      //   [40.82991732677597, -74.08716201782228]
      // ]),
      minZoom: 3,
      maxZoom: 11,
      zoom: 5,

      // data
      geojson: null,
      states: null,
      counties: null,

      // computed
      totals: null,
      totalsByState: null,
      totalCounties: null,
      totalBarWidth: 300,
      totalBarHeight: 25,

      // input options
      people: ["Rich", "Nancy", "Laura"],
      selectedPeople: ["Rich", "Nancy", "Laura"],
      colorPalette: {
        "all": {
          color: "#a65628",
          label: "all"
        },
        "Rich": {
          color: "#e41a1c",
          label: "Rich"
        },
        "Nancy": {
          color: "#3773b8",
          label: "Nancy"
        },
        "Laura": {
          color: "#ffff33",
          label: "Laura"
        },
        "rhlh": {
          color: "#ff7f00",
          label: "Rich & Laura"
        },
        "nhlh": {
          color: "#4daf4a",
          label: "Nancy & Laura"
        },
        "rhnh": {
          color: "#984ea3",
          label: "Rich & Nancy"
        },
        "unknown": {
          color: "#babab0",
          label: "no one"
        }
      }
    })
  },
  computed: {
    mapStyle() {
      return (`height: ${this.height}px`)
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      return () => {
        return {
          weight: 0.25,
          color: "#000000",
          opacity: 1,
          fillOpacity: this.fillOpacity
        };
      };
    },
    styleFunctionState() {
      return () => {
        return {
          fill: null,
          weight: 1.5,
          color: "#000000",
          opacity: 1,
          fillOpacity: 0
        };
      };
    },
    onEachFeatureFunction() {
      return (feature, layer) => {

        layer.setStyle({
          fillColor: feature.properties.fillColor
        });

        layer.bindTooltip(
          `<div class="text-left">
          <div>
          <b>${feature.properties.NAME} County, ${feature.properties.state}</b>
          </div>
          <div>
          population (est. 2019): ${feature.properties.population}
          </div>
          <div>
          Rich: ${feature.properties.rich ? '<i class="fas fa-square"></i>' : '<i class="far fa-square"></i>'}
          </div>
          <div>
          Nancy: ${feature.properties.nancy ? '<i class="fas fa-square"></i>' : '<i class="far fa-square"></i>'}
          </div>
          <div>
          Laura: ${feature.properties.laura ? '<i class="fas fa-square"></i>' : '<i class="far fa-square"></i>'}
          </div>
          <div>
          land area: ${feature.properties.ALAND.toLocaleString()} sq. m
          </div>
          </div>
          `, {
            permanent: false,
            sticky: true
          }
        );
      };
    }
  },
  async created() {
    this.loadData();
  },
  methods: {
    calcTotal(results, person, totalCounties) {
      // calculate non-zero total

      const total = results.map(d => +d[person]).reduce((prev, curr) => curr + prev);
      const pct = total / totalCounties;
      const pctFormatted = format(".1%")(pct);
      const barWidth = pct * this.totalBarWidth;

      return ({
        total: total,
        percent: pct,
        percentFormatted: pctFormatted,
        barWidth: barWidth
      })
    },
    loadData() {
      this.loading = true;
      const reader = require('g-sheets-api');
      const readerOptions = {
        apiKey: process.env.VUE_APP_GOOGLESHEETS_API_KEY,
        sheetId: '1Jmjx3MKxUlREiJ0lul9gdQ73YPKSydAbX-ZLq9MDCVY',
        sheetName: 'us_counties',
        returnAllResults: true
      };

      if (this.fetchData) {
        reader(readerOptions, (results) => {
          // calculate overall totals by person
          this.totals = {}
          this.totalCounties = results.length;
          // calculate totals
          this.people.forEach(person => {
            this.totals[person] = this.calcTotal(results, person, this.totalCounties);
          })

          // calculate totals by state
          const nested = nest()
            .key(d => d.state)
            .rollup(values => {
              let obj = {}

              this.people.forEach(person => {
                obj[person] = this.calcTotal(values, person, values.length);
              })

              return ({
                total: values.length,
                people: obj
              })
            })
            .entries(results);
          console.log(nested)

          // process the google sheets: Merge together
          this.loading = false;
          this.geojson = COUNTIES;
          this.states = STATES;

          this.geojson["features"].forEach(d => {
            const filtered = results.filter(row => row.id == d.properties.AFFGEOID);
            if (filtered.length == 1) {
              d["properties"]["population"] = filtered[0].population_2019;
              d["properties"]["state"] = filtered[0].state;

              const rich = filtered[0].Rich === "1";
              const nancy = filtered[0].Nancy === "1";
              const laura = filtered[0].Laura === "1";
              // calculating the color
              const value = rich && nancy && laura ? "all" :
                rich && nancy ? "rhnh" :
                rich && laura ? "rhlh" :
                nancy && laura ? "nhlh" :
                rich ? "Rich" :
                nancy ? "Nancy" :
                laura ? "Laura" :
                "unknown";
              d["properties"]["rich"] = rich;
              d["properties"]["nancy"] = nancy;
              d["properties"]["laura"] = laura;

              d["properties"]["fillColor"] = this.colorPalette[value].color;
            }
          })
        });
      }
    }
  }
}
</script>
<style lang="scss">
</style>
