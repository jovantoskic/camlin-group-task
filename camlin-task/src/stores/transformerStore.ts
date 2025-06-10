import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';

import type { Transformer } from '@/types/Transformer';

const LOCAL_STORAGE_KEYS = {
  SELECTED: 'selectedTransformers',
  QUERY: 'searchQuery',
};

function getFromLocalStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const colorPalette = [
  '#e6194b',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
];

export const useTransformerStore = defineStore('transformer', () => {
  const transformers = ref<Transformer[]>([]);
  const selectedTransformers = ref<number[]>(
    getFromLocalStorage(LOCAL_STORAGE_KEYS.SELECTED, [])
  );
  const searchQuery = ref<string>(
    localStorage.getItem(LOCAL_STORAGE_KEYS.QUERY) || ''
  );

  watch(
    selectedTransformers,
    (val) =>
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED, JSON.stringify(val)),
    { deep: true }
  );

  watch(searchQuery, (val) =>
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUERY, val)
  );

  const colorMap = computed(() => {
    const map: Record<number, string> = {};
    transformers.value.forEach((t, index) => {
      map[t.assetId] = colorPalette[index % colorPalette.length];
    });
    return map;
  });

  async function loadTransformers() {
    try {
      const response = await fetch('/sampledata.json');
      transformers.value = await response.json();
    } catch (err) {
      console.error('Failed to load transformers:', err);
    }
  }

  return {
    transformers,
    selectedTransformers,
    searchQuery,
    loadTransformers,
    colorMap,
  };
});
