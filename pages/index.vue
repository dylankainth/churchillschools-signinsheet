<template>
  <div>
    <span>{{ signInData }}</span>

    <div id="chart-wrapper">
      <canvas id="chartReasonsToday" width="100" height="100"></canvas>
    </div>
  </div>
</template>

<style>
#chart-wrapper {
  display: inline-block;
  position: relative;
  width: 30%;
}
</style>

<script>
export default {
  mounted() {
    


    this.charts.reasonsToday.chart = new Chart(document.getElementById('chartReasonsToday').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 36)',
              'rgb(255, 215, 86)',
              'rgb(255, 205, 86)',

            ],
            hoverOffset: 4,
          },
        ],
      },

    })

    this.getsignins()
  },
  data() {
    return {
      signInData: null,
      charts:{
        reasonsToday: {}
      }
    }
  },
  methods: {
    getsignins() {
      this.$axios
        .get('/.netlify/functions/readtodayssignins')
        .then((response) => {
          this.signInData = response.data


          this.updateCharts()
        })

     

      setTimeout(this.getsignins, 5 * 1000)
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
    }
  },
}
</script>
