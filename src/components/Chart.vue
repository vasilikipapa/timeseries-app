// eslint-disable-next-line vue/multi-word-component-names
<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const chartData = ref({
  labels: [],
  datasets: [
    { label: 'ENTSOE_DE_DAM_Price', backgroundColor: '#42A5F5', borderColor: '#42A5F5', data: [] },
    { label: 'ENTSOE_GR_DAM_Price', backgroundColor: '#66BB6A', borderColor: '#66BB6A', data: [] },
    { label: 'ENTSOE_FR_DAM_Price', backgroundColor: '#FFA726', borderColor: '#FFA726', data: [] },
  ],
})

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

const activeSeries = ref({
  ENTSOE_DE_DAM_Price: true,
  ENTSOE_GR_DAM_Price: true,
  ENTSOE_FR_DAM_Price: true,
})

const filteredChartData = computed(() => {
  return {
    labels: chartData.value.labels,
    datasets: chartData.value.datasets.filter((dataset) => activeSeries.value[dataset.label]),
  }
})

onMounted(async () => {
  try {
    const response = await fetch('/timeseries.json')
    const data = await response.json()

    console.log('Loaded Data:', data)

    chartData.value.labels = data
      .filter((_, index) => index % 20 === 0)
      .map((entry) => entry.DateTime)

    chartData.value.datasets[0].data = data.map((entry) => entry.ENTSOE_DE_DAM_Price)
    chartData.value.datasets[1].data = data.map((entry) => entry.ENTSOE_GR_DAM_Price)
    chartData.value.datasets[2].data = data.map((entry) => entry.ENTSOE_FR_DAM_Price)

    console.log('Before Update:', chartData.value)
    chartData.value = { ...chartData.value }
    console.log('After Update:', chartData.value)

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

    <div class="checkbox-container">
      <label v-for="(value, key) in activeSeries" :key="key">
        <input type="checkbox" v-model="activeSeries[key]" />
        {{ key }}
      </label>
    </div>

    <Line
      :key="filteredChartData.labels.length"
      :data="filteredChartData"
      :options="chartOptions"
    />
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
  flex-direction: column;
  align-items: center;
}

.checkbox-container {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}
</style>
