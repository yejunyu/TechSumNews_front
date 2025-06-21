<template>
  <article
    class="news-card bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 cursor-pointer"
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
        <el-tag
          :color="getCategoryColor(news.category)"
          class="text-white border-0"
          size="small"
        >
          {{ getCategoryName(news.category) }}
        </el-tag>
      </div>
      <div class="absolute top-2 right-2 flex flex-col gap-1">
        <el-tag v-if="news.isHot" type="danger" size="small">热门</el-tag>
        <el-tag v-if="news.hasTimeline" type="primary" size="small">
          <el-icon class="mr-1"><Clock /></el-icon>
          时间线
        </el-tag>
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
        <el-tag
          v-for="tag in news.tags.slice(0, 3)"
          :key="tag"
          size="small"
          class="mr-1 mb-1"
          type="info"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
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
            <el-icon class="mr-1"><View /></el-icon>
            {{ formatNumber(news.viewCount) }}
          </span>
          <span v-if="news.commentCount" class="flex items-center">
            <el-icon class="mr-1"><ChatDotRound /></el-icon>
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
import { View, ChatDotRound, Clock } from "@element-plus/icons-vue";

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