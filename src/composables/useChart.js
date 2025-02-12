import { ref } from 'vue'

export function useChart() {
  const chartData = ref({
    labels: [],
    datasets: [
      {
        label: 'ENTSOE_DE_DAM_Price',
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        data: [],
      },
      {
        label: 'ENTSOE_GR_DAM_Price',
        borderColor: '#66BB6A',
        backgroundColor: '#66BB6A',
        data: [],
      },
      {
        label: 'ENTSOE_FR_DAM_Price',
        borderColor: '#FFA726',
        backgroundColor: '#FFA726',
        data: [],
      },
    ],
  })

  const updateChartFromTable = (newData) => {
    chartData.value.labels = newData.map((entry) => entry.DateTime)
    chartData.value.datasets[0].data = newData.map((entry) => entry.ENTSOE_DE_DAM_Price)
    chartData.value.datasets[1].data = newData.map((entry) => entry.ENTSOE_GR_DAM_Price)
    chartData.value.datasets[2].data = newData.map((entry) => entry.ENTSOE_FR_DAM_Price)
  }

  return { chartData, updateChartFromTable }
}
