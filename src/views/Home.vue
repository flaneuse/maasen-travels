<template>
<div>
  <h1>
    How many counties in the United States have the Maasen family visited?
  </h1>
  <div class="d-flex align-items-center w-100 m-3" v-if="loading">
    <strong class="mx-5">Loading...</strong>
    <div class="spinner-border text-primary ml-auto" role="status" aria-hidden="true"></div>
  </div>

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


  <Legend :colorPalette="colorPalette"/>

  <!-- :bounds="bounds" :max-bounds="maxBounds"> -->
  <l-map :style="mapStyle" :zoom="zoom" :minZoom="minZoom" :maxZoom="maxZoom" :center="center">

    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-geo-json :geojson="geojson" :options="options" :options-style="styleFunction"></l-geo-json>
    <l-geo-json :geojson="states" :options-style="styleFunctionState"></l-geo-json>
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
  </l-map>

  <!-- State-by-state totals -->
  <StateTotals :data="stateTotals" :people="people" v-if="stateTotals" class="my-5" />

</div>
</template>

<script>
import {} from "leaflet";
import {
  LMap,
  LTileLayer,
  LGeoJson,
} from 'vue2-leaflet';

// basemap from https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html
// dictionary: https://www.census.gov/programs-surveys/geography/technical-documentation/records-layout/gaz-record-layouts.html
import STATES from "@/assets/cb_2018_us_state_20m.json";

import store from '@/store';

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    Legend: () => import(/* webpackPrefetch: true */ `@/components/Legend.vue`),
    StateTotals: () => import( /* webpackPrefetch: true */ `@/components/StateTotals.vue`)
  },
  data() {
    return ({
      fillOpacity: 0.6,
      height: 800, // height of map in px

      // basemaps
      url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png',
      labelUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

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
      states: null,

      totalBarWidth: 300,
      totalBarHeight: 25,

      // input options
      selectedPeople: ["Karol", "Bob"]
    })
  },
  computed: {
    loading() {
      return store.state.loading
    },
    people() {
      return store.state.people
    },
    geojson() {
      return store.state.geojson
    },
    totals() {
      return store.state.totals
    },
    stateTotals() {
      return store.state.stateTotals
    },
    colorPalette() {
      return store.state.colorPalette
    },
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
          fillColor: this.colorPalette[feature.properties.fillColor].color
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
          Karol: ${feature.properties.karol ? '<i class="fas fa-square"></i>' : '<i class="far fa-square"></i>'}
          </div>
          <div>
          Bob: ${feature.properties.bob ? '<i class="fas fa-square"></i>' : '<i class="far fa-square"></i>'}
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
    // load the state shapefile
    this.states = STATES;
  },
  methods: {}
}
</script>
<style lang="scss">
</style>
