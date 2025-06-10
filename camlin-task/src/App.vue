<template>
  <main class="main-container">
    <h1 class="headline">Transformer Dashboard</h1>
    <TransformersTable />
    <hr class="separator" />
    <TransformersChart />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useTransformerStore } from '@/stores/transformerStore';
import TransformersTable from '@/components/TransformersTable.vue';
import TransformersChart from '@/components/TransformersChart.vue';

import '@/styles/app.scss';

const store = useTransformerStore();

onMounted(() => {
  store.loadTransformers();
});
</script>
