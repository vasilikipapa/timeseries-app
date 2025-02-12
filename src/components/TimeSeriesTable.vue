<script setup>
import { ref, onMounted } from 'vue'
import { useChart } from '@/composables/useChart'

const timeSeriesData = ref([])
const originalData = ref([])
const errorMessage = ref(null)

const MIN_VALUE = -2000
const MAX_VALUE = 2000

const { updateChartFromTable } = useChart()

const loadData = async () => {
  try {
    const response = await fetch('/timeseries.json')
    const data = await response.json()
    timeSeriesData.value = JSON.parse(JSON.stringify(data))
    originalData.value = JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('Error loading timeseries data:', error)
  }
}

const updateValue = (event, index, key) => {
  const newValue = event.target.value.trim()

  if (isNaN(newValue) || newValue === '') {
    errorMessage.value = `Invalid value! Please enter a number between ${MIN_VALUE} and ${MAX_VALUE}.`
    return
  }

  const numericValue = parseFloat(newValue)

  if (numericValue < MIN_VALUE || numericValue > MAX_VALUE) {
    errorMessage.value = ` Value out of range! Allowed range: ${MIN_VALUE} to ${MAX_VALUE}.`
    return
  }

  errorMessage.value = null
  timeSeriesData.value[index][key] = numericValue

  updateChartFromTable(timeSeriesData.value)
}

const resetTable = () => {
  const userConfirmed = window.confirm(
    'Are you sure you want to reset all values to their original state?',
  )

  if (userConfirmed) {
    timeSeriesData.value = JSON.parse(JSON.stringify(originalData.value))
    updateChartFromTable(timeSeriesData.value)
  }
}

onMounted(loadData)
</script>

<template>
  <div>
    <h2>Timeseries Data</h2>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button @click="resetTable" class="reset-btn">Reset</button>

    <table>
      <thead>
        <tr>
          <th>DateTime</th>
          <th>ENTSOE_DE_DAM_Price</th>
          <th>ENTSOE_GR_DAM_Price</th>
          <th>ENTSOE_FR_DAM_Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in timeSeriesData" :key="index">
          <td>{{ entry.DateTime }}</td>
          <td>
            <input
              type="text"
              v-model="entry.ENTSOE_DE_DAM_Price"
              @input="updateValue($event, index, 'ENTSOE_DE_DAM_Price')"
            />
          </td>
          <td>
            <input
              type="text"
              v-model="entry.ENTSOE_GR_DAM_Price"
              @input="updateValue($event, index, 'ENTSOE_GR_DAM_Price')"
            />
          </td>
          <td>
            <input
              type="text"
              v-model="entry.ENTSOE_FR_DAM_Price"
              @input="updateValue($event, index, 'ENTSOE_FR_DAM_Price')"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #4caf50;
  color: white;
}

input {
  width: 100%;
  border: none;
  text-align: center;
  font-size: 1rem;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 🆕 Στυλ για το κουμπί Reset */
.reset-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
  margin-bottom: 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}

.reset-btn:hover {
  background-color: #cc0000;
}
</style>
