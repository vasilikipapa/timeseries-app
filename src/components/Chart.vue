// eslint-disable-next-line vue/multi-word-component-names
<script setup>
import { ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// 📌 **Καταχώρηση των modules του Chart.js**
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartData = ref({
  labels: [],
  datasets: [
    { label: 'ENTSOE_DE_DAM_Price', backgroundColor: '#42A5F5', data: [] },
    { label: 'ENTSOE_GR_DAM_Price', backgroundColor: '#66BB6A', data: [] },
    { label: 'ENTSOE_FR_DAM_Price', backgroundColor: '#FFA726', data: [] },
  ],
})

// 📌 **Προσθέτουμε τις επιλογές του Chart**
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1.5,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.raw} €/MWh`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { autoSkip: true, maxTicksLimit: 10 },
    },
    y: { beginAtZero: true },
  },
})

// 📌 **Ανάκτηση δεδομένων από το JSON**
onMounted(async () => {
  try {
    const response = await fetch('/timeseries.json')
    const data = await response.json()

    console.log('Loaded Data:', data)

    // 📌 **Ενημέρωση των δεδομένων στο γράφημα**
    chartData.value.labels = data
      .filter((_, index) => index % 20 === 0)
      .map((entry) => entry.DateTime)

    chartData.value.datasets[0].data = data.map((entry) => entry.ENTSOE_DE_DAM_Price)
    chartData.value.datasets[1].data = data.map((entry) => entry.ENTSOE_GR_DAM_Price)
    chartData.value.datasets[2].data = data.map((entry) => entry.ENTSOE_FR_DAM_Price)

    console.log('Before Update:', chartData.value)
    chartData.value = { ...chartData.value }
    console.log('After Update:', chartData.value)

    // 📌 **Κάνουμε το `chartData` διαθέσιμο στην κονσόλα για debugging**
    window.chartData = chartData
    console.log('chartData added to window:', window.chartData)
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<template>
  <div class="chart-container">
    <h2>Time Series Chart</h2>
    <Bar :key="chartData.labels.length" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  width: 90%;
  max-width: 900px;
  height: 500px;
  max-height: 500px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
