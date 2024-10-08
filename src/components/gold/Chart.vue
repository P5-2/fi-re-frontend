<template>
  <div>
    <h2>Gold Price Chart</h2>
    <Bar :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'ChartComponent',
  components: {
    Bar,
  },
  setup() {
    const chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Gold Prices',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          borderColor: 'rgba(255, 215, 0, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>

<style scoped>
canvas {
  max-width: 600px;
  margin: 0 auto;
}
</style>
