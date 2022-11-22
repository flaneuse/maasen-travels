<template>
<div>
  <h1>{{name}}</h1>
  {{loading}}
  {{totals}}
</div>
</template>

<script>

import store from '@/store';

export default {
  name: 'State',
  computed: {
    loading() {
        return store.state.loading
      },
      totals() {
        return store.getters.getStateTotal(this.name);
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
