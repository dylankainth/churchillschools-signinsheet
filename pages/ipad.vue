<template>
  <div>
    <div
      class="dropdown-menu d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px"
    >
      <div class="p-2 mb-2 bg-light border-bottom">
        <input
          type="search"
          class="form-control-lg w-100"
          style="border: 0px"
          autocomplete="false"
          placeholder="Type to search surname..."
          v-model="surnameSearch"
        />
      </div>

      <ul class="list-unstyled mb-0">
        <li v-for="surname in surnameResults" v-bind:key="surname._id">
          <div
            class="dropdown-item d-flex align-items-center gap-2 py-2"
            @click="surnameSelected=surname"
          >
            <span class="d-inline-block bg-danger rounded-circle p-1"></span>
            <span>{{surname.name}}</span>

            <span class="text-secondary">
            {{surname.email}}
            </span>
          </div>
        </li>

      </ul>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      surnameSearch: null,
      surnameResults: [],
      surnameSelected: null
    }
  },
  watch: {
    surnameSearch: async function (val) {
      if (val.length > 1) {
        this.surnameResults = await this.$axios.$get('/.netlify/functions/searchusers', {
          params: {
            name: val,
          },
        })
      } else {
        this.surnameResults = []
      }
    },
  },
}
</script>
