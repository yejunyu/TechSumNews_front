<template>
  <div class="timeline-item flex items-start space-x-4 pb-8 relative">
    <!-- 时间线连接线 -->
    <div
      v-if="!isLast"
      class="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-600"
    ></div>

    <!-- 时间点 -->
    <div class="timeline-dot flex-shrink-0 relative z-10">
      <div
        class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
        :class="{
          'bg-red-500': event.importance === 'high',
          'bg-yellow-500': event.importance === 'medium',
          'bg-green-500': event.importance === 'low',
          'bg-blue-500': event.importance === 'normal',
        }"
      >
        <el-icon class="text-white text-sm">
          <component :is="getEventIcon(event.category)" />
        </el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div
      class="timeline-content flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-card p-4 hover:shadow-card-hover transition-shadow"
    >
      <!-- 头部信息 -->
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ event.title }}
          </h3>
          <div
            class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <span>{{ formatDateTime(event.date) }}</span>
            <span>·</span>
            <el-tag
              :type="getImportanceType(event.importance)"
              size="small"
              effect="plain"
            >
              {{ getImportanceText(event.importance) }}
            </el-tag>
            <span>·</span>
            <span>{{ getCategoryName(event.category) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-2">
          <el-button
            @click="toggleExpand"
            :icon="isExpanded ? ArrowUp : ArrowDown"
            size="small"
            text
          />
        </div>
      </div>

      <!-- 描述 -->
      <p class="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
        {{ event.description }}
      </p>

      <!-- 展开内容 -->
      <div v-if="isExpanded" class="expanded-content">
        <!-- 相关链接 -->
        <div
          v-if="event.relatedLinks && event.relatedLinks.length > 0"
          class="mb-4"
        >
          <h4
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            相关链接
          </h4>
          <div class="space-y-1">
            <a
              v-for="link in event.relatedLinks"
              :key="link.url"
              :href="link.url"
              target="_blank"
              class="block text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {{ link.title }}
            </a>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="event.tags && event.tags.length > 0" class="mb-4">
          <h4
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            标签
          </h4>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tag in event.tags"
              :key="tag"
              size="small"
              type="info"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <!-- 影响范围 -->
        <div v-if="event.impact" class="mb-4">
          <h4
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            影响范围
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ event.impact }}
          </p>
        </div>
      </div>

      <!-- 底部操作 -->
      <div
        class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700"
      >
        <div
          class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <span class="flex items-center">
            <el-icon class="mr-1"><View /></el-icon>
            {{ formatNumber(event.viewCount || 0) }}
          </span>
          <span class="flex items-center">
            <el-icon class="mr-1"><ChatDotRound /></el-icon>
            {{ formatNumber(event.commentCount || 0) }}
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <el-button @click="handleShare" :icon="Share" size="small" text>
            分享
          </el-button>
          <el-button
            @click="handleBookmark"
            :icon="isFavorite ? StarFilled : Star"
            size="small"
            text
            :type="isFavorite ? 'primary' : 'default'"
          >
            {{ isFavorite ? "已收藏" : "收藏" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { TimelineEvent } from "@/types/timeline";
import { formatDateTime, formatNumber } from "@/utils/formatUtils";
import { useAppStore } from "@/stores/app";
import {
  ArrowUp,
  ArrowDown,
  View,
  ChatDotRound,
  Share,
  Star,
  StarFilled,
  TrendCharts,
  Monitor,
  Phone,
  Setting,
  DataBoard,
} from "@element-plus/icons-vue";

interface Props {
  event: TimelineEvent;
  isLast?: boolean;
}

interface Emits {
  (e: "share", event: TimelineEvent): void;
  (e: "bookmark", event: TimelineEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const appStore = useAppStore();

// 响应式数据
const isExpanded = ref(false);

// 计算属性
const isFavorite = computed(() => appStore.isFavorite(props.event.id));

// 方法
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const getEventIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    ai: TrendCharts,
    blockchain: DataBoard,
    internet: Monitor,
    mobile: Phone,
    software: Setting,
    default: TrendCharts,
  };
  return iconMap[category] || iconMap.default;
};

const getImportanceType = (importance: string) => {
  const typeMap: Record<string, string> = {
    high: "danger",
    medium: "warning",
    low: "success",
    normal: "info",
  };
  return typeMap[importance] || "info";
};

const getImportanceText = (importance: string) => {
  const textMap: Record<string, string> = {
    high: "重要",
    medium: "一般",
    low: "轻微",
    normal: "普通",
  };
  return textMap[importance] || "普通";
};

const getCategoryName = (category: string) => {
  const nameMap: Record<string, string> = {
    ai: "人工智能",
    blockchain: "区块链",
    internet: "互联网",
    mobile: "移动端",
    software: "软件",
    hardware: "硬件",
  };
  return nameMap[category] || category;
};

const handleShare = () => {
  emit("share", props.event);
};

const handleBookmark = () => {
  appStore.toggleFavorite(props.event.id);
  emit("bookmark", props.event);
};
</script>

<style scoped>
.timeline-item:hover .timeline-dot > div {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.expanded-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 300px;
  }
}
</style>