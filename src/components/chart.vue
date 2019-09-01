<template>
  <div class="chartItem">
    <h3>{{input.title}}</h3>
    <canvas :id="id"></canvas>
  </div>

</template>
<script>
  import Chart from 'chart.js'
  import moment from 'moment'

  Chart.defaults.global.defaultFontColor = "#fff";
  export default {
    name: 'chart',
    props: ['input'],
    data() {
      return {
        id: Math.random().toString(36).substr(2, 9)
      }
    },
    mounted() {
      const ctx = document.getElementById(this.id).getContext('2d');
      if (this.input.type === 'line') {
        new Chart(ctx, {
          type: 'scatter',
          data: {
            labels: this.input.labels,
            datasets: [{
              label: '',
              data: this.input.chartData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            legend: {display: false,},
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,

                }
              }],
              xAxes: [{
                ticks: {
                  beginAtZero: false,
                  min: this.input.start,
                  max: this.input.end,
                  callback: (value, index, values) => {
                    const indexLabel = Math.round((index / values.length) * (this.input.labels.length))
                    console.log(this.input.end)
                    console.log(indexLabel, this.input.labels[indexLabel], moment(value).format('MMM'), moment.unix(this.input.end).format('MMM d'))

                    return moment.unix(value).format('MMM D')

                  }
                }
              }]
            }
          }
        });
      } else {
        new Chart(ctx, {
          type: this.input.type,

          data: {
            labels: this.input.labels,
            datasets: [{
              labels: '',
              data: this.input.chartData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scaleFontColor: 'white',
            legend: {
              fontColor: 'white',
              defaultFontColor: 'white',
              position: 'bottom',
              display: false,
              labels: {
                // This more specific font property overrides the global property
                fontColor: 'white',
                defaultFontColor: 'white'
              }
            }
          }
        });
      }

    }
  }
</script>