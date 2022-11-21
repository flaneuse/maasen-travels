<template>
<div>
  <div>
    Where in the United States have the Hughes family gone?
  </div>
  <template v-if="totals">
    <div v-for="(person, pIdx) in people" :key="pIdx">
      <h1>{{person}}: {{totals[person]["total"]}}</h1>
      <svg :width="totalBarWidth + 150" :height="totalBarHeight">
        <rect :width="totals[person]['barWidth']" :height="totalBarHeight" :fill="colorPalette[person]['color']"></rect>
        <rect :width="totalBarWidth/2" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="totalBarWidth/4" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="(totalBarWidth/4)*3" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="totalBarWidth" :height="totalBarHeight" fill="none" stroke="#000"></rect>
        <text :x="totalBarWidth" dx="5" :y="totalBarHeight/2" style="text-anchor: start; alignment-baseline: central;">{{totals[person]["percentFormatted"]}} complete</text>
      </svg>
    </div>
  </template>

  <div id="legend" class="d-flex">
    <div v-for="(item, idx) in colorPalette" :key="idx" class="d-flex mr-2">
      <div :style="{width: '20px', height: '20px', backgroundColor: item.color, marginRight: '10px'}">
      </div>
      <div>
        {{ item.label}}
      </div>
    </div>

  </div>

  <!-- TODO: git commit -->
  <!-- TODO: bar graph towards completion -->
  <!-- TODO: switch bar graph by number of counties, percent area, percent pop -->
  <!-- TODO: filters: on/off for people -->
  <!-- TODO: bar graphs by state -->
  <!-- TODO: zoom into a state -->
  <!-- TODO: loading spinner -->
  <!-- TODO: rm auth key; secret -->
  <!-- TODO: publish -->
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
  <!-- TODO: button to zoom to reset to full vide -->
  <!-- TODO: hawaii/AK inplay -->
  <!-- TODO: fix zoom/pan  extent -->
  <!-- TODO: dim other counties, highlight with stroke on mouseover -->
  <!-- TODO: remove unneccessary packages -->
  <!-- TODO switch data to updated maps -->
  <!-- TODO merge in additional data? -->

  <l-map :style="mapStyle" :zoom="zoom" :center="center">
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

export default {
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LGeoJson
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
  data() {
    return ({
      fetchData: true,
      fillOpacity: 0.6,
      height: 800, // height of map in px
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
      labelUrl: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png',
      // url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
      // labelUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      // url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      // labelUrl: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
      // url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      center: [38.967243, -103.771556],
      geojson: null,
      states: null,
      markerLatLng: [51.505, -0.09],
      zoom: 5,
      fillColor: "#e4ce7f",
      counties: null,
      totals: null,
      totalBarWidth: 300,
      totalBarHeight: 25,
      totalCounties: null,
      people: ["Rich", "Nancy", "Laura"],
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
          label: "none"
        }
      }
    })
  },
  async created() {
    this.loadData();
  },
  methods: {
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
          this.totals = {}
          this.totalCounties = results.length;
          // calculate totals
          this.people.forEach(person => {
            // calculate non-zero total

            const total = results.map(d => +d[person]).reduce((prev, curr) => curr + prev);
            const pct = total / this.totalCounties;
            const pctFormatted = format(".1%")(pct);
            const barWidth = pct * this.totalBarWidth;
            this.totals[person] = {
              total: total,
              percent: pct,
              percentFormatted: pctFormatted,
              barWidth: barWidth
            };
          })

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
.mr-2 {
    margin-right: 1.5rem;
}
</style>
