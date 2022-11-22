<template>
<table v-if="totals">
  <tr v-for="(person, pIdx) in people" :key="pIdx" class="text-right">
    <!-- <td class="px-2"> -->
    <!-- <input type="checkbox" :id="person" :value="person" v-model="selectedPeople"> -->

    <!-- <label class="b-contain m-auto">
              <input v-model="selectedPeople" :id="person" :value="person" type="checkbox" />
              <div class="b-input" />
            </label> -->
    <!-- </td> -->
    <td class="px-2">
      <h3>{{person}}</h3>
    </td>
    <td class="px-2">
      <h3>{{totals[person]["total"]}}</h3>
    </td>
    <td class="px-2">
      <svg :width="totalBarWidth" :height="totalBarHeight">
        <rect :width="totals[person]['barWidth']" :height="totalBarHeight" :fill="'red'"></rect>
        <rect :width="totalBarWidth/2" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="totalBarWidth/4" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="(totalBarWidth/4)*3" :height="totalBarHeight" fill="none" stroke-dasharray="4,4" stroke="#ccc"></rect>
        <rect :width="totalBarWidth" :height="totalBarHeight" fill="none" stroke="#000"></rect>
      </svg>
    </td>
    <td>
      {{totals[person]["percentFormatted"]}} complete
    </td>
  </tr>
</table>
</template>

<script>
import store from '@/store';

export default {
  name: 'BarGraphCompletion',
  props: {
    totals: Object,
  },
  data() {
    return({
      totalBarWidth: 300,
      totalBarHeight: 25
    })
  },
  computed: {
    people() {
      return store.state.people;
    }
  }
}
</script>
