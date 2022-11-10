<template>
  <div>
    <div class="mb-4">
      <div class="p-5 mb-4 bg-light rounded-3" v-if="stage==0">
        <div class="container-fluid py-5 justify-content-center row">
          <img src="~/assets/tool.svg" style="height:5rem;width:auto;opacity: 0.9;">
          <h1 class="display-3 fw-bold text-center">Welcome to Churchill Schools</h1>
          <p class="fs-4 text-center">Use this system to sign in.</p>
          <p class="fs-4 text-center" v-if="minstillclosure()>0">The workshop's open for another {{minstillclosure()}} minutes</p>
          <button class="btn btn-primary btn-lg w-25 fs-4" @click="stage+=1" type="button" v-if="minstillclosure()>0">Get Started</button>
          <button class="btn btn-danger btn-lg w-25 fs-4" disabled type="button" v-if="minstillclosure()<0">The workshop is closed</button>
        </div>
      </div>

      <div class="row" v-if="stage>=1">
        <div class="col">
          <h1 class="mb-3">What's your surname?</h1>
        </div>
        <div class="col-1">
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
        v-if="!surnameSelected && stage>=1" 
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
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()-5).toString().slice(2,4)" class="d-inline-block bg-dark rounded-circle p-1"></span> <!-- overflow sixth -->
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()-4).toString().slice(2,4)" class="d-inline-block bg-primary rounded-circle p-1"></span> <!-- upper sixth -->
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()-3).toString().slice(2,4)" class="d-inline-block bg-danger rounded-circle p-1"></span> <!-- lower sixth -->
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()-2).toString().slice(2,4)" class="d-inline-block bg-warning rounded-circle p-1"></span> <!-- fifth form -->
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()-1).toString().slice(2,4)" class="d-inline-block bg-success rounded-circle p-1"></span> <!-- remove -->
              <span v-if="surname.email.slice(0,2)==(new Date().getFullYear()).toString().slice(2,4)" class="d-inline-block bg-info rounded-circle p-1"></span> <!-- shell form -->
              <span>{{ surname.name }} </span>

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
      <div class="col-1">
        
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

    <div class="row" v-if="surnameSelected && visitReasonSelected">
      <div class="col">
        <h1 class="mb-3">What's the reason for your visit?</h1>
      </div>
      <div class="col-1">
        <h1
          v-if="durationSelected"
          class="mb-3 text-secondary float-end"
          @click="durationSelected = null"
        >
          <img src="~/assets/edit.png" style="opacity: 0.5; cursor: pointer" />
        </h1>
      </div>
    </div>

    <div v-if="surnameSelected && visitReasonSelected">
      
      <div class="card text-center rounded-4 shadow border-0 mb-3">
        <div class="card-body p-5">
          <h2 style="font-size: 5rem">{{ durationBuffer }}</h2>
          <h2>minutes</h2>
          <h2 class="text-secondary">leave at {{ momentTime(new Date(Date.now() + durationBuffer * 60000)) }}</h2>
          <input
            type="range"
            class="form-range"
            min="15"
            :max="minstillclosure()"
            step="5"
            id="customRange3"
            v-model="durationBuffer"
            :disabled="durationSelected"
          />
          <button
            @click="durationBuffer = minstillclosure();"
            class="btn btn-info"
            :disabled="durationSelected"
          >
            Set to closing time
          </button>
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

    <div v-if="surnameSelected && visitReasonSelected && durationSelected" href="#finish">
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
  middleware : 'auth',
  data() {
    return {
      stage:0,
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
        {
          name: 'Shell Project',
          image: 'shell.jpg',
        },
        {
          name: 'Personal Project',
          image: 'personalproject.jpg',
        },
        {
          name: 'Prep',
          image: 'solidworks.jpg',
        },
        {
          name: 'Other',
          image: 'other.jpg',
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
    momentTime(date) {
      return moment(date).format('h:mm a')
    },
    minstillclosure() {
      // calculate how many minutes until 6pm
      var now = new Date()
      var close = new Date()
      close.setHours(18, 0, 0, 0)
      return Math.round((close - now) / 60000)
    },
    signin() {
      this.sendStatus = 1
      this.$axios.$post('/.netlify/functions/writesignins', {
        surname: this.surnameSelected.name,
        visitReason: this.visitReasonSelected.name,
        duration: this.durationSelected,
      }).then(() => {
        this.sendStatus = 2

        // refresh page after 2 seconds
        setTimeout(() => {
          location.reload()
        }, 2000)
      }).catch((err) => {
        this.signInErr = err
        this.sendStatus = 10
      })
    },
  },
}
</script>

<style>
.btn-primary {
  background-color: #001844;
}
.btn-primary:hover {
  background-color: #002a78;
}
</style>