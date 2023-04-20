import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import {
  format
} from "d3-format";

import {
  nest
} from "d3-collection";

// basemap from https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html
// dictionary: https://www.census.gov/programs-surveys/geography/technical-documentation/records-layout/gaz-record-layouts.html
import COUNTIES from "@/assets/cb_2018_us_county_20m.json";
import STATES from "@/assets/cb_2018_us_state_20m.json";



const calcTotal = function(results, person, totalCounties, totalBarWidth = 300) {
  // calculate non-zero total

  const total = results.map(d => +d[person]).reduce((prev, curr) => curr + prev);
  const pct = total / totalCounties;
  const pctFormatted = format(".1%")(pct);
  const barWidth = pct * totalBarWidth;

  return ({
    total: total,
    percent: pct,
    totalRemaining: totalCounties - total,
    percentFormatted: pctFormatted,
    barWidth: barWidth
  })
}


export default new Vuex.Store({
  state: {
    loading: false,
    people: ["Karol", "Bob"],
    geojson: null,
    states: null,
    totals: null,
    stateTotals: null,
    totalCounties: null,
    colorPalette: {
      // "all": {
      //   color: "#a65628",
      //   label: "all"
      // },
      "Bob": {
        color: "#e41a1c",
        lightColor: "#fdd3d3",
        label: "Bob"
      },
      "Karol": {
        color: "#3773b8",
        lightColor: "#cee5ff",
        label: "Karol"
      },
      // "Laura": {
      //   color: "#ffff33",
      //   lightColor: "#ffffc1",
      //   label: "Laura"
      // },
      // "rhlh": {
      //   color: "#ff7f00",
      //   label: "Rich & Laura"
      // },
      // "nhlh": {
      //   color: "#4daf4a",
      //   label: "Nancy & Laura"
      // },
      "kb": {
        color: "#984ea3",
        label: "Karol & Bob"
      },
      "unknown": {
        color: "#babab0",
        label: "no one"
      }
    }
  },
  mutations: {},
  actions: {
    fetchData(context) {
      context.state.loading = true;

      const reader = require('g-sheets-api');
      const readerOptions = {
        apiKey: process.env.VUE_APP_GOOGLESHEETS_API_KEY,
        sheetId: '1_nvgo6gKDWsB38Csn2yX1rbcVQQ2IBOaFic1rz4KBV0', // Link to Google sheet. Should have permissions set to "anyone with link can view"
        sheetName: 'us_counties',
        returnAllResults: true
      };

      reader(readerOptions, (results) => {
        // calculate overall totals by person
        context.state.totals = {}
        context.state.totalCounties = results.length;
        // calculate totals
        context.state.people.forEach(person => {
          context.state.totals[person] = calcTotal(results, person, results.length);
        })

        // calculate totals by state
        const nested = nest()
          .key(d => d.state)
          .rollup(values => {
            let obj = {}

            context.state.people.forEach(person => {
              obj[person] = calcTotal(values, person, values.length);
            })

            return ({
              total: values.length,
              people: obj,
              values: values
            })
          })
          .entries(results);

          nested.forEach(d => {
            d.total = d.value.total;
          })

        context.state.stateTotals = nested;

        // process the google sheets: Merge together
        context.state.geojson = COUNTIES;
        context.state.states = STATES;

        context.state.geojson["features"].forEach(d => {
          const filtered = results.filter(row => row.id == d.properties.AFFGEOID);
          if (filtered.length == 1) {
            d["properties"]["population"] = filtered[0].population_2019;
            d["properties"]["state"] = filtered[0].state;

            const karol = filtered[0].Karol === "1";
            const bob = filtered[0].Bob === "1";

            // calculating the color
            const value = karol && bob ? "kb" :
              karol ? "Karol" :
              bob ? "Bob" :
              "unknown";
            d["properties"]["karol"] = karol;
            d["properties"]["bob"] = bob;

            d["properties"]["fillColor"] = value; //this.colorPalette[value].color;
          }
        })

        context.state.loading = false;
      });

    }
  },
  getters: {
    getStateTotal: (state) => (name) => {
      return (state.stateTotals ? state.stateTotals.filter(d => d.key == name) : null)
    },
    getStateGeojson: (state) => (name) => {
      if(state.geojson){
        const geo = state.geojson.features.filter(d => d.properties.state == name);
      return {features: geo}
      } else {
        return(null)
      }

    }
  },
  modules: {},
});
