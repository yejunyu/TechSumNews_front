<template>
  <div class="highlights-view min-h-screen bg-gradient-bg">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold gradient-text mb-4">Tech Highlights</h1>
        <p class="tech-subtitle text-lg max-w-2xl mx-auto">
          Curating the latest tech trends and tracking important event timelines
        </p>
      </div>

      <!-- 主要内容区域 -->
      <div class="max-w-6xl mx-auto">
        <!-- 分类标签 -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            v-for="category in categories"
            :key="category.slug"
            @click="selectCategory(category.slug)"
            :class="[
              'badge badge-lg px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105',
              selectedCategory === category.slug
                ? 'tech-badge-primary shadow-lg'
                : 'badge-outline hover:badge-primary',
            ]"
          >
            <span class="flex items-center gap-2">
              <span
                v-if="selectedCategory === category.slug"
                class="w-2 h-2 bg-current rounded-full animate-pulse"
              ></span>
              {{ category.name }}
            </span>
          </button>
        </div>

        <!-- 新闻网格 -->
        <div v-if="loading" class="text-center p-12">
          <span class="loading loading-lg loading-spinner text-primary"></span>
        </div>
        <div v-else-if="error" class="text-center p-12">
          <div class="alert alert-error">
            <span>Error: {{ error }}</span>
          </div>
        </div>
        <div
          v-else-if="highlightsList.length === 0 && !loading"
          class="text-center p-12"
        >
          <div class="alert alert-info">
            <span>No highlights found for this category.</span>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 gap-6">
          <HighlightCard
            v-for="(highlight, index) in highlightsList"
            :key="highlight.articles[0]?.link || index"
            :highlight="highlight"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { HighlightsAPI } from "@/services/api";
import HighlightCard from "@/components/highlights/HighlightCard.vue";
import type { HighlightEvent } from "@/types/highlights";

// Categories with slugs matching the API endpoints
const categories = ref([
  { name: "Product", slug: "products" },
  { name: "Affairs", slug: "affairs" },
  { name: "Innovation", slug: "innovation" },
]);

const selectedCategory = ref("products"); // Default to 'products'
const highlightsList = ref<HighlightEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchHighlights = async (category: string) => {
  loading.value = true;
  error.value = null;
  highlightsList.value = [];
  try {
    highlightsList.value = await HighlightsAPI.getHighlights(category);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    error.value = `Failed to load highlights for ${category}: ${errorMessage}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const selectCategory = (categorySlug: string) => {
  selectedCategory.value = categorySlug;
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchHighlights(selectedCategory.value);
});

// Watch for changes in the selected category and fetch new data
watch(selectedCategory, (newCategory) => {
  fetchHighlights(newCategory);
});
</script>

<style scoped>
/* Scoped styles can remain if any are specific to this view's layout */
</style>