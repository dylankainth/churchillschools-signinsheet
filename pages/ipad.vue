<template>
  <div>
    <div class="mb-4">
      <div class="row">
        <div class="col">
          <h1 class="mb-3">What's your surname?</h1>
        </div>
        <div class="col">
          <h1
            v-if="surnameSelected"
            class="mb-3 text-secondary float-end"
            @click="surnameSelected = null"
          >
            <img
              src="~/assets/edit.png"
              style="opacity: 0.5; cursor: pointer"
            />
          </h1>
        </div>
      </div>

      <div
        v-if="!surnameSelected"
        class="dropdown-menu d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px py- border-0"
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

        <ul class="list-unstyled mb-0" v-show="!surnameSelected">
          <li v-for="surname in surnameResults" v-bind:key="surname._id">
            <div
              class="dropdown-item d-flex align-items-center gap-2 py-2"
              @click="surnameSelected = surname"
            >
              <span class="d-inline-block bg-danger rounded-circle p-1"></span>
              <span>{{ surname.name }}</span>

              <span class="text-secondary">
                {{ surname.email }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="surnameSelected"
        class="d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px"
      >
        <input
          type="search"
          class="form-control-lg w-100"
          style="border: 0px; background-color: white; color: black"
          autocomplete="false"
          v-model="surnameSelected.name"
          disabled
        />
      </div>
    </div>

    <div class="row" v-if="surnameSelected">
      <div class="col">
        <h1 class="mb-3">What's the reason for your visit?</h1>
      </div>
      <div class="col">
        <h1
          v-if="visitReasonSelected"
          class="mb-3 text-secondary float-end"
          @click="visitReasonSelected = null"
        >
          <img src="~/assets/edit.png" style="opacity: 0.5; cursor: pointer" />
        </h1>
      </div>
    </div>

    <div v-if="surnameSelected && !visitReasonSelected">
      <div class="row row-cols-2 row-cols-lg-3 align-items-stretch g-4 py-3">
        <div
          class="col"
          style="height: 30vh"
          v-for="visitReason in visitReasonList"
          v-bind:key="visitReason.name"
        >
          <div
            class="card displaycard card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
            @click="visitReasonSelected = visitReason"
            v-bind:style="
              'cursor:pointer;background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' +
              require(`~/assets/${visitReason.image}`) +
              '); '
            "
          >
            <div class="d-flex flex-column h-100 p-5 text-white text-shadow-1">
              <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                {{ visitReason.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="surnameSelected && visitReasonSelected">
      <div class="row row-cols-2 row-cols-lg-3 align-items-stretch g-4 py-3">
        <div class="col" style="height: 30vh">
          <div
            class="card displaycard card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg"
            v-bind:style="
              'background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(' +
              require(`~/assets/${visitReasonSelected.image}`) +
              '); '
            "
          >
            <div class="d-flex flex-column h-100 p-5 text-white text-shadow-1">
              <h3 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">
                {{ visitReasonSelected.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="surnameSelected && visitReasonSelected">
      <h1 class="mb-3">How long do you plan to stay for?</h1>

      <div class="card text-center rounded-4 shadow border-0 mb-3">
        <div class="card-body p-5">
          <h2 style="font-size: 5rem">{{ durationBuffer }}</h2>
          <h2>minutes</h2>
          <input
            type="range"
            class="form-range"
            min="15"
            max="210"
            step="15"
            id="customRange3"
            v-model="durationBuffer"
            :disabled="durationSelected"
          />
          <button
            @click="durationSelected = durationBuffer"
            class="btn btn-primary"
            :disabled="durationSelected"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div v-if="surnameSelected && visitReasonSelected && durationSelected">
      <h1 class="mb-3">Complete Sign in</h1>
      <button @click="signin" class="btn btn-primary btn-lg" v-if="sendStatus != 10">
        <span v-if="sendStatus == 0">Sign in</span>
        <span v-if="sendStatus == 1"
          ><div class="spinner-border text-light" role="status">
          </div></span
        >
        <span v-if="sendStatus == 2">✔️</span>
      </button>
      <button @click="signin" class="btn btn-danger btn-lg" v-if="sendStatus == 10" disabled>
        <span>An error occurred.</span>
      </button>
      <span v-if="sendStatus == 10">{{signInErr}}</span>
    </div>
  </div>
</template>

<style scoped>
.displaycard {
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover !important;
  transition: 0.3s;
  border: none;
  height: 30vh;
}

.displaycard:active {
  animation: shake 0.5s;
}
</style>

<script>
export default {
  data() {
    return {
      surnameSearch: null,
      surnameResults: [],
      surnameSelected: null,
      visitReasonList: [
        {
          name: 'Greenpower',
          image: 'greenpower.jpg',
        },
        {
          name: 'F1 in Schools',
          image: 'f1inschool.jpg',
        },
        {
          name: 'Coursework',
          image: 'coursework.jpg',
        },
        {
          name: 'Drone Society',
          image: 'drone.jpg',
        },
        {
          name: 'Sculpture Studio',
          image: 'sculpture.jpg',
        },
        {
          name: 'Aviation Society',
          image: 'aviation.jpg',
        },
        {
          name: 'FTC Robotics',
          image: 'ftc.jpg',
        },
        {
          name: 'Motorsport Society',
          image: 'motorsport.jpg',
        },
        {
          name: 'Design and Innovation Society',
          image: 'designandinnovation.jpg',
        },
      ],
      visitReasonSelected: null,
      durationBuffer: 60,
      durationSelected: null,
      sendStatus: 0,
      signInErr: null
    }
  },
  watch: {
    surnameSearch: async function (val) {
      if (val.length > 1) {
        this.surnameResults = await this.$axios.$get(
          '/.netlify/functions/searchusers',
          {
            params: {
              name: val,
            },
          }
        )
      } else {
        this.surnameResults = []
      }
    },
  },
  methods: {
    signin() {
      this.sendStatus = 1
      this.$axios.$post('/.netlify/functions/writesignins', {
        surname: this.surnameSelected.name,
        visitReason: this.visitReasonSelected.name,
        duration: this.durationSelected,
      }).then(() => {
        this.sendStatus = 2
      }).catch((err) => {
        this.signInErr = err
        this.sendStatus = 10
      })
    },
  },
}
</script>
