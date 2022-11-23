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
      <BarGraphCompletion :totals="totals[person]" :fillColor="colorPalette[person].color"></BarGraphCompletion>
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
  name: 'BarGraphCompletionTable',
  props: {
    totals: Object,
  },
  components: {
    BarGraphCompletion: () => import( /* webpackPrefetch: true */ `@/components/BarGraphCompletion.vue`)
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
    },
    colorPalette() {
      return store.state.colorPalette;
    }
  }
}
</script>
