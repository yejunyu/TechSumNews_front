<template>
  <div class="event-detail-view max-w-3xl mx-auto py-8 px-4">
    <div v-if="event">
      <h1 class="text-3xl font-bold mb-2">{{ event.group_title }}</h1>
      <div class="text-base-content/70 mb-4">{{ event.group_summary }}</div>
      <div
        v-if="event.suggested_headline"
        class="mb-2 text-lg font-semibold text-primary"
      >
        {{ event.suggested_headline }}
      </div>
      <div v-if="event.explanation" class="mb-4 text-base-content/80">
        {{ event.explanation }}
      </div>

      <!-- 图片轮播（daisyUI carousel，自动切换） -->
      <div v-if="event.images && event.images.length" class="mb-6">
        <div class="carousel w-full h-60 rounded-lg relative">
          <div
            v-for="(img, idx) in event.images"
            :key="img.image_link"
            class="carousel-item absolute w-full h-60 transition-opacity duration-700"
            :style="{
              opacity: idx === currentSlide ? 1 : 0,
              zIndex: idx === currentSlide ? 2 : 1,
            }"
          >
            <img
              :src="img.image_link"
              :alt="img.description"
              class="w-full h-60 object-cover"
            />
            <div
              class="absolute bottom-2 left-0 w-full text-center text-xs text-base-content/60 bg-base-100/70"
            >
              {{ img.description }}
            </div>
            <!-- 左右切换按钮 -->
            <button
              v-if="event.images.length > 1"
              @click="prevSlide"
              class="absolute left-2 top-1/2 -translate-y-1/2 btn btn-xs btn-circle"
            >
              ❮
            </button>
            <button
              v-if="event.images.length > 1"
              @click="nextSlide"
              class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs btn-circle"
            >
              ❯
            </button>
          </div>
        </div>
        <div class="text-xs text-right mt-1 text-base-content/50">
          图片来源: {{ event.image_source || "未知" }}
        </div>
      </div>

      <!-- 折叠面板（daisyUI collapse） -->
      <div class="space-y-2">
        <div tabindex="0" class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" checked />
          <div class="collapse-title text-base font-medium">
            相关文章 ({{ event.article_num || event.articles.length }})
          </div>
          <div class="collapse-content">
            <ul class="space-y-2">
              <li v-for="a in event.articles" :key="a.link">
                <a
                  :href="a.link"
                  target="_blank"
                  rel="noopener"
                  class="text-primary hover:underline"
                  >{{ a.title }}</a
                >
                <span class="ml-2 text-xs text-base-content/60"
                  >({{ a.feed }})</span
                >
                <span class="ml-2 text-xs text-base-content/50">{{
                  a.published
                }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div tabindex="0" class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">
            新闻来源 ({{ event.feed_num || event.feeds.length }})
          </div>
          <div class="collapse-content">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="f in event.feeds"
                :key="f"
                class="badge badge-neutral"
                >{{ f }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-16 text-lg text-error">未找到该新闻</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "@/stores/events";

const route = useRoute();
const eventsStore = useEventsStore();
const groupTitle = route.params.group_title as string;

const event = computed(() =>
  eventsStore.events.find((e) => e.group_title === groupTitle)
);

// 自动轮播逻辑
const currentSlide = ref(0);
let timer: any = null;

const startAutoPlay = () => {
  stopAutoPlay();
  if (!event.value?.images?.length || event.value.images.length <= 1) return;
  timer = setInterval(() => {
    if (event.value && event.value.images) {
      currentSlide.value = (currentSlide.value + 1) % event.value.images.length;
    }
  }, 3500);
};
const stopAutoPlay = () => {
  if (timer) clearInterval(timer);
  timer = null;
};
const prevSlide = (e?: Event) => {
  if (e) e.stopPropagation();
  if (!event.value?.images?.length) return;
  currentSlide.value =
    (currentSlide.value - 1 + event.value.images.length) %
    event.value.images.length;
  startAutoPlay();
};
const nextSlide = (e?: Event) => {
  if (e) e.stopPropagation();
  if (!event.value?.images?.length) return;
  currentSlide.value = (currentSlide.value + 1) % event.value.images.length;
  startAutoPlay();
};

onMounted(() => {
  startAutoPlay();
});
onUnmounted(() => {
  stopAutoPlay();
});
watch(event, () => {
  currentSlide.value = 0;
  startAutoPlay();
});
</script>

<style scoped>
.event-detail-view {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.carousel-item {
  transition: opacity 0.7s;
}
</style> 