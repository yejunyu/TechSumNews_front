<template>
  <div class="timeline-view min-h-screen bg-gradient-bg">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold gradient-text mb-4">科技时间线</h1>
        <p class="tech-subtitle text-lg max-w-2xl mx-auto">
          按时间顺序展示重要科技事件的发展历程
        </p>
      </div>

      <!-- 时间线内容 -->
      <div class="max-w-4xl mx-auto">
        <div class="relative">
          <!-- 主时间线 -->
          <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <!-- 时间线事件 -->
          <div class="space-y-8">
            <div
              v-for="event in events"
              :key="event.id"
              class="relative flex items-start space-x-6"
            >
              <!-- 时间点 -->
              <div
                class="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0 z-10"
                :class="{
                  'bg-red-500': event.importance === 'high',
                  'bg-yellow-500': event.importance === 'medium',
                  'bg-green-500': event.importance === 'low',
                  'bg-blue-500': event.importance === 'normal',
                }"
              >
                <el-icon class="text-white text-xl">
                  <component :is="getEventIcon(event.category)" />
                </el-icon>
              </div>

              <!-- 事件内容 -->
              <div
                class="flex-1 bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow"
              >
                <!-- 头部信息 -->
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">
                      {{ event.title }}
                    </h3>
                    <div
                      class="flex items-center space-x-3 text-sm text-gray-500"
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
                  <span class="text-sm text-gray-400">{{
                    formatRelativeTime(event.date)
                  }}</span>
                </div>

                <!-- 描述 -->
                <p class="text-gray-600 mb-4 leading-relaxed">
                  {{ event.description }}
                </p>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-4">
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

                <!-- 相关新闻链接 -->
                <div
                  v-if="event.relatedNews && event.relatedNews.length > 0"
                  class="border-t border-gray-100 pt-4"
                >
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    相关新闻
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <el-button
                      v-for="newsId in event.relatedNews"
                      :key="newsId"
                      @click="goToNews(newsId)"
                      size="small"
                      text
                      type="primary"
                    >
                      查看新闻详情 →
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="text-center mt-12">
          <el-button
            @click="loadMore"
            :loading="loading"
            size="large"
            class="btn-primary"
          >
            加载更多时间线
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTimelineStore } from "@/stores/timeline";
import { formatRelativeTime, formatDateTime } from "@/utils/formatUtils";
import {
  ChartBarIcon as TrendCharts,
  ComputerDesktopIcon as Monitor,
  DevicePhoneMobileIcon as Phone,
  CogIcon as Setting,
  CircleStackIcon as DataBoard,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const timelineStore = useTimelineStore();

// 响应式数据
const loading = ref(false);

// 计算属性
const events = computed(() => timelineStore.events);

// 方法
const getEventIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    ai: TrendCharts,
    blockchain: DataBoard,
    internet: Monitor,
    mobile: Phone,
    software: Setting,
    hardware: DataBoard,
    default: TrendCharts,
  };
  return iconMap[category] || iconMap.default;
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

const goToNews = (newsId: string) => {
  router.push(`/news/${newsId}`);
};

const loadMore = async () => {
  loading.value = true;
  try {
    // 模拟加载更多数据
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    loading.value = false;
  }
};

// 生命周期
onMounted(async () => {
  await timelineStore.fetchTimelineEvents();
});
</script>

<style scoped>
.timeline-view {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

@media (max-width: 768px) {
  .absolute.left-8 {
    left: 2rem;
  }

  .space-x-6 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1rem;
  }
}
</style>