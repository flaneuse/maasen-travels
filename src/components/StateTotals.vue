<template>
<div>
  <h3>Totals by state</h3>
  <table>
    <thead>
      <tr>
        <th class="px-2 text-right pointer" @click="sort('name')" rowspan="2">
          state
        </th>
        <th class="px-2 pointer" @click="sort('counties')" rowspan="2">
          counties
        </th>
        <template class="px-2" v-for="(person, phIdx) in people">
          <th :key="phIdx + 'header'" class="" colspan="4">
            {{person}}
          </th>
          <th :key="phIdx + 'header-spacer'">
          </th>
        </template>
      </tr>
      <tr>
        <template class="px-2" v-for="(person, phIdx2) in people">
          <th :key="phIdx2 + 'header'" class="px-2">
          </th>
          <th :key="phIdx2 + 'header2'" class="px-2 pointer" @click="sort(person, 'percent')">
            percent
          </th>
          <th :key="phIdx2 + 'header3'" class="px-2 pointer" @click="sort(person, 'total')">
            total
          </th>
          <th :key="phIdx2 + 'header4'" class="px-2 pointer" @click="sort(person, 'totalRemaining')">
            remaining
          </th>
          <th :key="phIdx2 + 'header5'">
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
          <td class="mx-2" :key="pIdx + 'pct'">
            {{stateData.value.people[person]["percentFormatted"]}}
          </td>

          <td class="mx-2" :key="pIdx + 'total'">
            {{stateData.value.people[person]["total"]}}
          </td>

          <td class="mx-2" :key="pIdx + 'remaining'">
            {{stateData.value.people[person]["totalRemaining"]}}
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
    sort(id, variable) {
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
        if (this.sortVar == `${id}${variable}`) {
          this.dataCopy.sort((a, b) => a.value.people[id][variable] - b.value.people[id][variable]);
          this.sortVar = `-${id}${variable}`;
        } else {
          this.dataCopy.sort((a, b) => b.value.people[id][variable] - a.value.people[id][variable]);
          this.sortVar = `${id}${variable}`;
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
