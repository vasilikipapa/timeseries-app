<script setup>
import { ref, onMounted } from 'vue';

// Αποθήκευση των timeseries δεδομένων
const timeSeriesData = ref([]);

// Φόρτωση των δεδομένων από το timeseries.json
const loadData = async () => {
  try {
    const response = await fetch('/timeseries.json');
    timeSeriesData.value = await response.json();
  } catch (error) {
    console.error('Error loading timeseries data:', error);
  }
};

// Φόρτωσε τα δεδομένα όταν το component δημιουργηθεί
onMounted(loadData);
</script>

<template>
  <div>
    <h2>Timeseries Data</h2>
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
          <td>{{ entry.ENTSOE_DE_DAM_Price }}</td>
          <td>{{ entry.ENTSOE_GR_DAM_Price }}</td>
          <td>{{ entry.ENTSOE_FR_DAM_Price }}</td>
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

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #4CAF50;
  color: white;
}
</style>

