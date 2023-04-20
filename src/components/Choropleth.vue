<template>
<div>
  <Legend :colorPalette="colorPalette"/>

  {{width}}

  <l-map :style="mapStyle" :zoom="zoom" :minZoom="minZoom" :maxZoom="maxZoom" :center="center">
    <!-- :bounds="bounds" :max-bounds="maxBounds"> -->
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-geo-json :geojson="geojson" :options="options" :options-style="styleFunction"></l-geo-json>
    <!-- <l-geo-json :geojson="states" :options-style="styleFunctionState"></l-geo-json> -->
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
    <l-tile-layer :url="labelUrl" :attribution="attribution"></l-tile-layer>
  </l-map>

</div>
</template>


<script>

import store from '@/store';

import {
  LMap,
  LTileLayer,
  LGeoJson
} from 'vue2-leaflet';

export default {
  name: 'Choropleth',
  props: {
    geojson: Object,
    center: Array,
    zoom: Number,
    width: Number
  },
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    Legend: () => import(/* webpackPrefetch: true */ `@/components/Legend.vue`)
  },
  data() {
    return ({
      height: 700, // height of map in px
      // basemaps
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
      labelUrl: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}{r}.png',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

      // map params
      minZoom: 3,
      maxZoom: 11,
      fillOpacity: 0.8
    })
  },
  mounted() {
  },
  computed: {
    colorPalette() {
      return store.state.colorPalette
    },
    mapStyle() {
      return (`height: ${this.height}px; width: ${this.width}px`)
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      return () => {
        return {
          weight: 2,
          color: "#fff",
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
          fillColor: this.colorPalette[feature.properties.fillColor]["color"]
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
  }
}
</script>
