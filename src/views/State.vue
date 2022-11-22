<template>
<div>
  <h1>{{name}}</h1>
  <!-- {{loading}} -->
  <BarGraphCompletion :totals="totalsByPerson" />

</div>
</template>

<script>

import store from '@/store';

export default {
  name: 'State',
  components: {
    BarGraphCompletion: () => import(/* webpackPrefetch: true */ `@/components/BarGraphCompletion.vue`)
  },
  computed: {
    loading() {
        return store.state.loading
      },
      totals() {
        const totals = store.getters.getStateTotal(this.name);
        return totals ? totals[0] : null;
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
