<template>
<div class="d-flex flex-column align-items-center">
  <h1>{{name}}<span v-if="totalCounties">: {{totalCounties}} total counties</span></h1>
  <!-- {{loading}} -->
  <BarGraphCompletionTable :totals="totalsByPerson" />

  <Choropleth :zoom="zoom" :center="center" :width="widthChoro" :geojson="geojson" class="my-5" v-if="center"/>

</div>
</template>

<script>

import store from '@/store';

import CENTROIDS from "@/assets/state_centroids.json";

export default {
  name: 'State',
  components: {
    BarGraphCompletionTable: () => import(/* webpackPrefetch: true */ `@/components/BarGraphCompletionTable.vue`),
    Choropleth: () => import(/* webpackPrefetch: true */ `@/components/Choropleth.vue`)
  },
  computed: {
    loading() {
        return store.state.loading
      },
      totals() {
        const totals = store.getters.getStateTotal(this.name);
        return totals ? totals[0] : null;
      },
      geojson() {
        return store.getters.getStateGeojson(this.name);
      },
      totalCounties() {
        return(this.totals ? this.totals['value']['total'] : null)
      },
      totalsByPerson(){
        return this.totals ? this.totals['value']['people'] : null
      }
  },
  data() {
    return({
      name: null,
      zoom: null,
      center: null,
      widthChoro: null
    })
  },
  mounted() {
    this.name = this.$route.params.name;

    const stateParams = CENTROIDS[this.name];
    if (stateParams) {
      this.zoom = stateParams.zoom;
      this.center = [stateParams.lat, stateParams.lon];
      this.widthChoro = stateParams.aspectRatio ? this.height * stateParams.aspectRatio : this.height;
    }
  },
  methods: {
  }
}</script>
