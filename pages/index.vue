<template>
  <div>
    <!-- <span>{{ signInData }}</span> -->

    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 rounded-3 bg-white shadow">
          <div id="chart-wrapper">
            <canvas id="chartReasonsToday" width="100" height="100"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="h-100 p-5 rounded-3 bg-white shadow">
          <h2>Currently in the workshop</h2>
          <table class="table">
      <thead>
        <tr>
          <th scope="col">Surname</th>
          <th scope="col">Visit Reason</th>
          <th scope="col">Entry Time</th>
          <!-- <th scope="col">duration</th> -->
          <th scope="col">Exit Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="signin in currentlyInWorkshop" v-bind:key="signin._id">
          <td>{{ signin.surname }}</td>
          <td>{{ signin.visitReason }}</td>
          <td>{{ momentTime(new Date(signin.timestamp))}}</td>
          <!-- <td>{{ signin.duration }}</td> -->
          <td>{{ momentTime(signin.timeOfExit)}}</td>
        </tr>
      </tbody>
    </table>
        </div>
      </div>
    </div>

    
  </div>
</template>

<style>
#chart-wrapper {
  display: inline-block;
  position: relative;
  width: 100%;
}
</style>

<script>
export default {
  middleware: 'auth',
  mounted() {
    this.charts.reasonsToday.chart = new Chart(
      document.getElementById('chartReasonsToday').getContext('2d'),
      {
        type: 'doughnut',
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Top Sign in Reasons Today',
            },
          },
        },
        data: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [
            {
              label: 'My First Dataset',
              data: [300, 50, 100],
              backgroundColor: [
                'rgba(154,202,32,255)',
                'rgba(36,125,195,255)',
                'rgba(255, 126, 122,255)',
                'rgba(254,120,0,255)',
                'rgba(160,31,28,255)',
                'rgba(248,98,0,255)',
                'rgba(189,119,178,255)',
                'rgba(128,119,184,255)'
              ],
              hoverOffset: 4,
            },
          ],
        },
      }
    )

    this.getsignins()
    this.getleaderboard()
  },
  data() {
    return {
      signInData: null,
      currentlyInWorkshop: null,
      charts: {
        reasonsToday: {},
      },
      leaderBoardData: null,
    }
  },
  methods: {
    momentTime(date) {
      return moment(date).format('h:mm a')
    },
    getsignins() {
      this.$axios
        .get('/.netlify/functions/readtodayssignins')
        .then((response) => {
          this.signInData = response.data

          this.updateCharts()

          this.filterCurrentlyInWorkshop()
          
        })
      
        

      setTimeout(this.getsignins, 5 * 1000)
    },
    getleaderboard() {
      this.$axios
        .get('/.netlify/functions/readleaderboard')
        .then((response) => {
          this.leaderBoardData = response.data
        })
      setTimeout(this.getsignins, 60 * 30 * 1000)
    },
    filterCurrentlyInWorkshop() {
      // add items to currentlyInWorkshop from signInData if their duration (minutes) plus timestamp is greater than now
      this.currentlyInWorkshop = this.signInData.filter((item) => {
        const now = new Date()
        const timestamp = new Date(item.timestamp)
        const duration = item.duration

        const timeOfExit = new Date(timestamp.getTime() + duration * 60000)
        item.timeOfExit = timeOfExit
        return timeOfExit > Date.now()
      })

   
    },
    updateCharts() {
      // count the frequency of each visitReason in the signins
      const reasons = this.signInData.reduce((acc, cur) => {
        if (acc[cur.visitReason]) {
          acc[cur.visitReason]++
        } else {
          acc[cur.visitReason] = 1
        }
        return acc
      }, {})

      // seperate the keys and values into seperate arrays
      const reasonsLabels = Object.keys(reasons)
      const reasonsData = Object.values(reasons)

      this.charts.reasonsToday.chart.data.datasets[0].data = reasonsData
      this.charts.reasonsToday.chart.data.labels = reasonsLabels
      this.charts.reasonsToday.chart.update()
    },
  },

 
}
</script>
