<template>
<div>
  <h1>{{name}}</h1>
</div>
</template>

<script>
export default {
  name: 'State',
  data() {
    return({
      name: null
    })
  },
  mounted() {
    this.name = this.$route.params.name;
  }
}</script>
