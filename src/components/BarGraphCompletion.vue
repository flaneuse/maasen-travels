<template>
    <svg :width="totalBarWidth" :height="totalBarHeight">
      <rect :width="totals['barWidth']" :height="totalBarHeight" :fill="fillColor"></rect>
      <rect :width="totalBarWidth/2" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
      <rect :width="totalBarWidth/4" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
      <rect :width="(totalBarWidth/4)*3" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
      <rect :width="totalBarWidth" :height="totalBarHeight" fill="none" stroke="#000"></rect>
    </svg>
</template>

<script>
export default {
  name: 'BarGraphCompletion',
  props: {
    totals: Object,
    fillColor: {
      type: String,
      default: "red"
    }
  },
  data() {
    return ({
      totalBarWidth: 300,
      totalBarHeight: 25
    })
  }
}
</script>
