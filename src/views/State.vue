<template>
<div>
  <h1>{{name}}<span v-if="totalCounties">: {{totalCounties}} total counties</span></h1>
  <!-- {{loading}} -->
  <BarGraphCompletionTable :totals="totalsByPerson" />

<Choropleth :geojson="geojson" />

</div>
</template>

<script>

import store from '@/store';

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
        console.log(totals)
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
    })
  },
  mounted() {
    this.name = this.$route.params.name;
  },
  methods: {
  }
}</script>
