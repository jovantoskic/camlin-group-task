<template>
  <div class="transformer-chart">
    <div class="checkboxes">
      <label v-for="transformer in transformers" :key="transformer.assetId">
        <input
          type="checkbox"
          :value="transformer.assetId"
          v-model="selectedIds"
        />
        {{ transformer.name }}
      </label>
    </div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useTransformerStore } from '@/stores/transformerStore';

import '@/styles/transformers-chart.scss';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const { selectedTransformers, transformers, colorMap } = storeToRefs(
  useTransformerStore()
);

const TAB_ID = Math.random().toString(36).slice(2);
const selectedIds = ref<number[]>([...selectedTransformers.value]);

const channel = new BroadcastChannel('transformer_selection_sync');

channel.onmessage = async (event) => {
  const { type, payload, source } = event.data;

  if (source === TAB_ID) return;

  if (type === 'updateSelected') {
    const isEqual =
      selectedIds.value.length === payload.length &&
      selectedIds.value.every((id, i) => id === payload[i]);

    if (!isEqual) {
      selectedIds.value = [...payload];
    }
  }
};

watch(
  selectedIds,
  (val) => {
    selectedTransformers.value = val;

    localStorage.setItem('selectedTransformers', JSON.stringify(val));

    channel.postMessage({
      type: 'updateSelected',
      payload: [...val],
      source: TAB_ID,
    });
    renderChart();
  },
  { deep: true }
);

watch(
  () => transformers.value,
  (newTransformers) => {
    if (newTransformers.length > 0) {
      renderChart();
    }
  }
);

function renderChart() {
  if (!chartCanvas.value) return;

  const datasets = transformers.value
    .filter((t) => selectedIds.value.includes(t.assetId))
    .map((t) => ({
      label: t.name,
      data: t.lastTenVoltgageReadings.map((r) => ({
        x: new Date(r.timestamp).getTime(),
        y: parseFloat(r.voltage),
      })),
      borderColor: colorMap.value[t.assetId],
      backgroundColor: colorMap.value[t.assetId],
      fill: false,
      tension: 0.3,
      borderWidth: 2,
    }));

  const config = {
    type: 'line' as const,
    data: { datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Voltage Readings Over Time',
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: { unit: 'day' as const },
          title: { display: true, text: 'Date' },
        },
        y: {
          title: { display: true, text: 'Voltage' },
        },
      },
    },
  };

  if (chart) chart.destroy();
  chart = new Chart(chartCanvas.value, config);
}

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  if (chart) chart.destroy();
  channel.close();
});
</script>
