<template>
  <div class="events-view min-h-screen bg-gradient-bg">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold gradient-text mb-4">Tech Events</h1>
        <p class="tech-subtitle text-lg max-w-2xl mx-auto">
          Tech event summaries from 3,000+ articles, curated weekly from 30+
          publishers
        </p>
      </div>

      <!-- 筛选栏 -->
      <EventsFilterBar />

      <!-- 加载与错误状态 -->
      <div v-if="eventsStore.loading" class="text-center py-16">
        <span class="loading loading-lg loading-spinner text-primary"></span>
      </div>
      <div v-else-if="eventsStore.error" class="text-center py-16">
        <div class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {{ eventsStore.error }}</span>
        </div>
      </div>

      <!-- 事件卡片列表 -->
      <div v-else class="space-y-6">
        <StoryCard
          v-for="(event, index) in eventsStore.filteredEvents"
          :key="event.group_title"
          :event="event"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useEventsStore } from "@/stores/events";
import EventsFilterBar from "@/components/events/EventsFilterBar.vue";
import StoryCard from "@/components/events/StoryCard.vue";

const eventsStore = useEventsStore();

onMounted(() => {
  eventsStore.fetchEvents();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>