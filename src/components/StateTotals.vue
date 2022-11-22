<template>
<div>
  <h3>Totals by state</h3>
  <table>
    <thead>
      <tr>
        <th class="px-2 text-right pointer" @click="sort('name')">
          state
        </th>
        <th class="px-2 pointer" @click="sort('counties')">
          counties
        </th>
        <template class="px-2" v-for="(person, phIdx) in people">
          <th :key="phIdx + 'header'" class="pointer" @click="sort(person)">
            {{person}}
          </th>
          <th :key="phIdx + 'header-spacer'">

          </th>

        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stateData, sIdx) in dataCopy" :key="sIdx">
        <!-- state name with link -->
        <td class="text-right px-2">
          <router-link :to="{name: 'State', params: {name: stateData.key}}">{{stateData.key}}</router-link>
        </td>

        <!-- total number of counties -->
        <td class="text-right px-2">
          {{stateData.value.total}}
        </td>

        <!-- completion by person -->
        <template v-for="(person, pIdx) in people">
          <td :key="pIdx + 'completion'">
            <BarGraphCompletion :totals="stateData.value.people[person]" />
          </td>
          <td :key="pIdx + 'completion-spacer'" class="table-spacer">
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default {
  name: 'StateTotals',
  props: {
    data: Array,
    people: Array
  },
  components: {
    BarGraphCompletion: () => import( /* webpackPrefetch: true */ `@/components/BarGraphCompletion.vue`)
  },
  data() {
    return ({
      sortVar: "name",
      dataCopy: null
    })
  },
  mounted() {
    this.dataCopy = this.data;
  },
  methods: {
    sort(id) {
      console.log(id)
      if (id === "counties") {
        if (this.sortVar == "-counties") {
          this.dataCopy.sort((a, b) => a.total - b.total);
          this.sortVar = "counties";
        } else {
          this.dataCopy.sort((a, b) => b.total - a.total);
          this.sortVar = "-counties";
        }

      }
      if (id === "name") {
        if (this.sortVar == "name") {
          this.dataCopy.sort((a, b) => a.key > b.key ? -1 : 1)
          this.sortVar = "-name"
        } else {
          this.dataCopy.sort((a, b) => a.key < b.key ? -1 : 1)
          this.sortVar = "name"
        }
      }

      if (this.people.includes(id)) {
        if (this.sortVar == id) {
          this.dataCopy.sort((a, b) => a.value.people[id].percent - b.value.people[id].percent);
          this.sortVar = `-${id}`
        } else {
          this.dataCopy.sort((a, b) => b.value.people[id].percent - a.value.people[id].percent);
          this.sortVar = id
        }
      }
    }
  }
}
</script>

<style lang="scss">
.text-left {
    text-align: start !important;
}
.text-right {
    text-align: end !important;
}

.table-spacer {
    min-width: 1.5rem;
}

.pointer {
    cursor: pointer !important;
}
</style>
