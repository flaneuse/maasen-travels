<template>
  <div>
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

import {
  LMap,
  LTileLayer,
  LGeoJson
} from 'vue2-leaflet';

export default {
  name: 'Choropleth',
  props: {
    geojson: Object,
  },
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data() {
    return({
      height: 700, // height of map in px
      width: 800,
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
        }},
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
      // center: [38.967243, -103.771556],
      // center: [28.681389,-82.46],
      center: [39.0, -76.7],
      minZoom: 3,
      maxZoom: 11,
      zoom: 8,
      fillOpacity: 0.8
    })
  },
  computed: {
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
  }
}
</script>
