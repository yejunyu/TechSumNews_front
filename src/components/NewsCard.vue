<template>
  <article
    class="news-card tech-card rounded-lg overflow-hidden cursor-pointer"
    @click="handleClick"
  >
    <!-- 图片区域 -->
    <div class="relative overflow-hidden">
      <img
        :src="news.imageUrl"
        :alt="news.title"
        class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-2 left-2">
        <span
          :style="{ backgroundColor: getCategoryColor(news.category) }"
          class="badge badge-sm text-white border-0"
        >
          {{ getCategoryName(news.category) }}
        </span>
      </div>
      <div class="absolute top-2 right-2 flex flex-col gap-1">
        <span v-if="news.isHot" class="badge badge-error badge-sm">热门</span>
        <span v-if="news.hasTimeline" class="badge badge-primary badge-sm">
          <Clock class="w-3 h-3 mr-1" />
          时间线
        </span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <h3
        class="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
      >
        {{ news.title }}
      </h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ news.summary }}
      </p>

      <!-- 标签 -->
      <div v-if="news.tags && news.tags.length > 0" class="mb-3">
        <span
          v-for="tag in news.tags.slice(0, 3)"
          :key="tag"
          class="badge badge-outline badge-sm mr-1 mb-1"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <span>{{ news.author }}</span>
          <span>·</span>
          <span>{{ formatRelativeTime(news.publishTime) }}</span>
        </div>
        <div class="flex items-center space-x-3">
          <span class="flex items-center">
            <View class="w-4 h-4 mr-1" />
            {{ formatNumber(news.viewCount) }}
          </span>
          <span v-if="news.commentCount" class="flex items-center">
            <ChatDotRound class="w-4 h-4 mr-1" />
            {{ formatNumber(news.commentCount) }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { NewsItem } from "@/types/news";
import { NEWS_CATEGORIES } from "@/utils/constants";
import {
  formatRelativeTime,
  formatNumber,
  getCategoryColor,
} from "@/utils/formatUtils";
import {
  EyeIcon as View,
  ChatBubbleLeftRightIcon as ChatDotRound,
  ClockIcon as Clock,
} from "@heroicons/vue/24/outline";

interface Props {
  news: NewsItem;
}

interface Emits {
  (e: "click", news: NewsItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getCategoryName = (categorySlug: string): string => {
  const category = NEWS_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.name || categorySlug;
};

const handleClick = () => {
  emit("click", props.news);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-2px);
}
</style>