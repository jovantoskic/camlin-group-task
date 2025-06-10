<template>
  <div class="transformer-table">
    <div class="table-controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or region..."
        class="search-input"
      />

      <select v-model="regionFilter" class="region-select">
        <option value="">All Regions</option>
        <option
          v-for="region in availableRegions"
          :key="region"
          :value="region"
        >
          {{ region }}
        </option>
      </select>
    </div>

    <table class="transformer-table-grid">
      <thead>
        <tr>
          <th>Name</th>
          <th>Region</th>
          <th>Health</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transformer in filteredTransformers"
          :key="transformer.assetId"
        >
          <td :style="{ color: colorMap[transformer.assetId] }">
            {{ transformer.name }}
          </td>
          <td>{{ transformer.region }}</td>
          <td>{{ transformer.health }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';

import { useTransformerStore } from '@/stores/transformerStore';

import '@/styles/transformers-table.scss';

const { transformers, searchQuery, colorMap } = storeToRefs(
  useTransformerStore()
);
const regionFilter = ref('');

const channel = new BroadcastChannel('transformer_table_sync');
const TAB_ID = Math.random().toString(36).slice(2);

channel.onmessage = (event) => {
  const { type, payload, source } = event.data;

  if (source === TAB_ID) return;

  if (type === 'updateTableFilters') {
    const { search, region } = payload;

    if (search !== searchQuery.value) {
      searchQuery.value = search;
    }

    if (region !== regionFilter.value) {
      regionFilter.value = region;
    }
  }
};

watch([searchQuery, regionFilter], ([search, region]) => {
  searchQuery.value = search;
  localStorage.setItem('searchQuery', search);

  channel.postMessage({
    type: 'updateTableFilters',
    payload: { search, region },
    source: TAB_ID,
  });
});

const availableRegions = computed(() => {
  const regions = new Set(transformers.value.map((t) => t.region));
  return Array.from(regions);
});

const filteredTransformers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const region = regionFilter.value;
  return transformers.value.filter((t) => {
    const matchText =
      t.name.toLowerCase().includes(query) ||
      t.region.toLowerCase().includes(query);
    const matchRegion = !region || t.region === region;
    return matchText && matchRegion;
  });
});

onBeforeUnmount(() => {
  channel.close();
});
</script>
