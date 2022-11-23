<template>
<div>
  <h3>Totals by state</h3>
  <table class="mx-4">
    <thead>
      <!-- main row -->
      <tr>
        <template class="px-2" v-for="(person, phIdx) in people">
          <!-- sort on state -->
          <th :key="phIdx + 'state'" class="px-2 text-right pointer" @click="sort('name')" rowspan="2">
            state
            <svg height="20px" class="px-2" v-if="sortVar == `-name`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" v-if="sortVar == `name`" viewBox="0 0 576 512" height="20px" class="px-2">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </th>

          <!-- sort on counties -->
          <th :key="phIdx + 'county'" class="px-2 text-center pointer" @click="sort('counties')" rowspan="2" v-if="phIdx === 0">
            counties
            <svg height="20px" class="px-2" v-if="sortVar == `-counties`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" v-if="sortVar == `counties`" viewBox="0 0 576 512" height="20px" class="px-2">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </th>
          <th :key="phIdx + 'header'" class="" colspan="4" :style="{backgroundColor: colorPalette[person].lightColor}">
            {{person}}
          </th>
          <th :key="phIdx + 'header-spacer'">
          </th>
        </template>
      </tr>
      <!-- per-person row -->
      <tr>
        <template class="px-2" v-for="(person, phIdx2) in people">
          <th :key="phIdx2 + 'header1'" class="px-2">
          </th>
          <!-- sort on percent -->
          <th :key="phIdx2 + 'header2'" class="px-2 pointer" @click="sort(person, 'percent')">
            percent
            <svg height="20px" class="px-2" v-if="sortVar == `${person}percent`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" v-if="sortVar == `-${person}percent`" viewBox="0 0 576 512" height="20px" class="px-2">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </th>

          <!-- sort on total  -->
          <th :key="phIdx2 + 'header3'" class="px-2 pointer" @click="sort(person, 'total')">
            total
            <svg height="20px" class="px-2" v-if="sortVar == `${person}total`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" v-if="sortVar == `-${person}total`" viewBox="0 0 576 512" height="20px" class="px-2">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </th>

          <!-- sort on total remaining -->
          <th :key="phIdx2 + 'header4'" class="px-2 pointer" @click="sort(person, 'totalRemaining')">
            remaining
            <svg height="20px" class="px-2" v-if="sortVar == `${person}totalRemaining`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" v-if="sortVar == `-${person}totalRemaining`" viewBox="0 0 576 512" height="20px" class="px-2">
              <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320zm0 128c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </th>
          <th :key="phIdx2 + 'header5'">
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stateData, sIdx) in dataCopy" :key="sIdx">
        <!-- completion by person -->
        <template v-for="(person, pIdx) in people">
          <!-- state name with link -->
          <td class="text-right line-height-1 px-2" :key="pIdx + 'personstate'">
            <router-link :to="{name: 'State', params: {name: stateData.key}}">{{stateData.key}}</router-link>
          </td>

          <!-- total number of counties -->
          <td class="px-2" v-if="pIdx === 0" :key="pIdx + 'personcounty'">
            {{stateData.value.total}}
          </td>

          <td :key="pIdx + 'completion'">
            <BarGraphCompletion :totals="stateData.value.people[person]" :fillColor="colorPalette[person].color" />
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
import store from '@/store';

export default {
  name: 'StateTotals',
  props: {
    data: Array,
    people: Array
  },
  components: {
    BarGraphCompletion: () => import( /* webpackPrefetch: true */ `@/components/BarGraphCompletion.vue`)
  },
  computed: {
    colorPalette() {
      return store.state.colorPalette
    }
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

.line-height-1 {
    line-height: 1.1rem;
}
</style>
