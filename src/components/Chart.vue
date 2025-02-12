// eslint-disable-next-line vue/multi-word-component-names
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
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

const rawData = ref([])
const errorMessage = ref('')

const minDate = '2024-02-01T00:00:00'
const maxDate = '2024-02-12T23:00:00'

const startDate = ref(null)
const endDate = ref(null)

const activeSeries = ref({
  ENTSOE_DE_DAM_Price: true,
  ENTSOE_GR_DAM_Price: true,
  ENTSOE_FR_DAM_Price: true,
})

const chartData = ref({
  labels: [],
  datasets: [
    { label: 'ENTSOE_DE_DAM_Price', borderColor: '#42A5F5', backgroundColor: '#42A5F5', data: [] },
    { label: 'ENTSOE_GR_DAM_Price', borderColor: '#66BB6A', backgroundColor: '#66BB6A', data: [] },
    { label: 'ENTSOE_FR_DAM_Price', borderColor: '#FFA726', backgroundColor: '#FFA726', data: [] },
  ],
})

const filteredChartData = computed(() => {
  if (!startDate.value || !endDate.value || errorMessage.value) {
    return chartData.value
  }

  const filteredData = rawData.value.filter((entry) => {
    const entryDate = new Date(entry.DateTime)
    return entryDate >= new Date(startDate.value) && entryDate <= new Date(endDate.value)
  })

  return {
    labels: filteredData.map((entry) => entry.DateTime),
    datasets: chartData.value.datasets.map((dataset) => ({
      ...dataset,
      data: filteredData.map((entry) => entry[dataset.label]),
      hidden: !activeSeries.value[dataset.label],
    })),
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
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
    x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
    y: { beginAtZero: true },
  },
})

const validateDates = () => {
  if (!startDate.value || !endDate.value) {
    errorMessage.value = ''
    return
  }

  if (startDate.value < minDate || endDate.value > maxDate) {
    errorMessage.value = `❌ Invalid date range! Please select dates between February 1st, 2024 (2024-02-01T00:00:00) and February 12th, 2024 (2024-02-12T23:00:00).`
  } else {
    errorMessage.value = ''
  }
}

watch([startDate, endDate], validateDates)

onMounted(async () => {
  try {
    const response = await fetch('/timeseries.json')
    const data = await response.json()

    rawData.value = data
    chartData.value.labels = data.map((entry) => entry.DateTime)
    chartData.value.datasets[0].data = data.map((entry) => entry.ENTSOE_DE_DAM_Price)
    chartData.value.datasets[1].data = data.map((entry) => entry.ENTSOE_GR_DAM_Price)
    chartData.value.datasets[2].data = data.map((entry) => entry.ENTSOE_FR_DAM_Price)
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

<template>
  <div class="chart-container">
    <h2>Time Series Chart</h2>

    <div class="filter-container">
      <label>Start Date:</label>
      <input type="datetime-local" v-model="startDate" />

      <label>End Date:</label>
      <input type="datetime-local" v-model="endDate" />
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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

.filter-container {
  margin-bottom: 15px;
}

.checkbox-container {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
