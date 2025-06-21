<template>
  <div class="events-view min-h-screen bg-gradient-bg">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold gradient-text mb-4">Tech Events</h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Track important tech events and industry developments
        </p>
      </div>

      <!-- 事件列表 -->
      <div class="max-w-4xl mx-auto">
        <div class="space-y-6">
          <div
            v-for="event in events"
            :key="event.id"
            class="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow"
          >
            <div class="flex items-start space-x-4">
              <!-- 重要性指示器 -->
              <div
                class="w-4 h-4 rounded-full mt-2 flex-shrink-0"
                :class="{
                  'bg-red-500': event.importance === 'high',
                  'bg-yellow-500': event.importance === 'medium',
                  'bg-green-500': event.importance === 'low',
                  'bg-blue-500': event.importance === 'normal',
                }"
              ></div>

              <!-- 事件内容 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ event.title }}
                  </h3>
                  <span class="text-sm text-gray-500">{{
                    formatRelativeTime(event.date)
                  }}</span>
                </div>

                <p class="text-gray-600 mb-3 leading-relaxed">
                  {{ event.description }}
                </p>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-3">
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

                <!-- 底部信息 -->
                <div
                  class="flex items-center justify-between text-sm text-gray-500"
                >
                  <div class="flex items-center space-x-4">
                    <span>{{ getCategoryName(event.category) }}</span>
                    <el-tag
                      :type="getImportanceType(event.importance)"
                      size="small"
                      effect="plain"
                    >
                      {{ getImportanceText(event.importance) }}
                    </el-tag>
                  </div>
                  <span>{{ formatDateTime(event.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="text-center mt-8">
          <el-button
            @click="loadMore"
            :loading="loading"
            size="large"
            class="btn-primary"
          >
            Load More Events
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTimelineStore } from "@/stores/timeline";
import { formatRelativeTime, formatDateTime } from "@/utils/formatUtils";

const timelineStore = useTimelineStore();

// 响应式数据
const loading = ref(false);

// 计算属性
const events = computed(() => timelineStore.events);

// 方法
const getCategoryName = (category: string) => {
  const nameMap: Record<string, string> = {
    ai: "AI",
    blockchain: "Blockchain",
    internet: "Internet",
    mobile: "Mobile",
    software: "Software",
    hardware: "Hardware",
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
    high: "High",
    medium: "Medium",
    low: "Low",
    normal: "Normal",
  };
  return textMap[importance] || "Normal";
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>