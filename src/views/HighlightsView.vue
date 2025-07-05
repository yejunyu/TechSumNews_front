<template>
  <div class="highlights-view min-h-screen bg-gradient-bg">
    <div class="container mx-auto px-6 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold gradient-text mb-4">Tech Highlights</h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Curating the latest tech trends and tracking important event timelines
        </p>
      </div>

      <!-- 热门新闻轮播 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Hot News</h2>
        <el-carousel
          :interval="5000"
          arrow="hover"
          indicator-position="outside"
          height="400px"
          class="rounded-lg overflow-hidden shadow-lg"
        >
          <el-carousel-item
            v-for="news in hotNews"
            :key="news.id"
            class="relative cursor-pointer"
            @click="goToNews(news.id)"
          >
            <div class="relative w-full h-full">
              <img
                :src="news.imageUrl"
                :alt="news.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div class="flex items-center gap-2 mb-3">
                  <el-tag
                    :color="getCategoryColor(news.category)"
                    class="text-white border-0"
                    size="small"
                  >
                    {{ getCategoryName(news.category) }}
                  </el-tag>
                  <el-tag v-if="news.hasTimeline" type="primary" size="small">
                    <el-icon class="mr-1"><Clock /></el-icon>
                    Timeline
                  </el-tag>
                </div>
                <h3 class="text-2xl font-bold mb-2 line-clamp-2">
                  {{ news.title }}
                </h3>
                <p class="text-gray-200 text-sm line-clamp-2 mb-3">
                  {{ news.summary }}
                </p>
                <div class="flex items-center justify-between text-sm">
                  <span>{{ news.author }}</span>
                  <span>{{ formatRelativeTime(news.publishTime) }}</span>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：新闻列表 -->
        <div class="lg:col-span-2">
          <!-- 分类标签 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <el-tag
              v-for="category in categories"
              :key="category.id"
              :type="selectedCategory === category.slug ? 'primary' : 'info'"
              :effect="selectedCategory === category.slug ? 'dark' : 'plain'"
              class="cursor-pointer"
              @click="selectCategory(category.slug)"
            >
              {{ category.name }}
            </el-tag>
          </div>

          <!-- 新闻网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NewsCard
              v-for="news in displayNews"
              :key="news.id"
              :news="news"
              @click="(news) => goToNews(news.id)"
            />
          </div>

          <!-- 加载更多 -->
          <div class="text-center mt-8">
            <el-button
              @click="loadMore"
              :loading="loading"
              size="large"
              class="btn-primary"
            >
              Load More
            </el-button>
          </div>
        </div>

        <!-- 右侧：时间线 -->
        <div class="space-y-6" v-show="false">
          <!-- 时间线标题 -->
          <div class="bg-white rounded-lg shadow-card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <el-icon class="mr-2 text-blue-600"><Clock /></el-icon>
              Tech Event Timeline
            </h3>
            <p class="text-gray-600 text-sm">
              Track the development of important tech events
            </p>
          </div>

          <!-- 时间线内容 -->
          <div class="bg-white rounded-lg shadow-card p-6">
            <div class="space-y-6">
              <div
                v-for="(event, index) in timelineEvents"
                :key="event.id"
                class="relative"
              >
                <!-- 时间线连接线 -->
                <div
                  v-if="index < timelineEvents.length - 1"
                  class="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"
                ></div>

                <!-- 时间线项目 -->
                <div class="flex items-start space-x-4">
                  <!-- 时间点 -->
                  <div
                    class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center flex-shrink-0"
                    :class="{
                      'bg-red-500': event.importance === 'high',
                      'bg-yellow-500': event.importance === 'medium',
                      'bg-green-500': event.importance === 'low',
                      'bg-blue-500': event.importance === 'normal',
                    }"
                  >
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>

                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs text-gray-500">
                        {{ formatRelativeTime(event.date) }}
                      </span>
                      <el-tag
                        :type="getImportanceType(event.importance)"
                        size="small"
                        effect="plain"
                      >
                        {{ getImportanceText(event.importance) }}
                      </el-tag>
                    </div>
                    <h4 class="font-medium text-gray-900 mb-1 line-clamp-2">
                      {{ event.title }}
                    </h4>
                    <p class="text-gray-600 text-sm line-clamp-2">
                      {{ event.description }}
                    </p>

                    <!-- 关联新闻链接 -->
                    <div
                      v-if="event.relatedNews && event.relatedNews.length > 0"
                      class="mt-2"
                    >
                      <el-button
                        v-for="newsId in event.relatedNews.slice(0, 1)"
                        :key="newsId"
                        @click="goToNews(newsId)"
                        size="small"
                        text
                        type="primary"
                      >
                        View Related News →
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 查看更多时间线 -->
            <div class="text-center mt-6 pt-4 border-t border-gray-100">
              <el-button
                @click="viewMoreTimeline"
                size="small"
                text
                type="primary"
              >
                View Full Timeline →
              </el-button>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="bg-white rounded-lg shadow-card p-6">
            <h4 class="font-semibold text-gray-900 mb-4">Statistics</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Hot News</span>
                <span class="font-semibold text-red-600">{{
                  hotNews.length
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Timeline Events</span>
                <span class="font-semibold text-blue-600">{{
                  timelineEvents.length
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Today's Updates</span>
                <span class="font-semibold text-green-600">{{
                  todayCount
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNewsStore } from "@/stores/news";
import { useTimelineStore } from "@/stores/timeline";
import { NEWS_CATEGORIES } from "@/utils/constants";
import {
  formatRelativeTime,
  formatNumber,
  getCategoryColor,
} from "@/utils/formatUtils";
import { Clock } from "@element-plus/icons-vue";
import NewsCard from "@/components/NewsCard.vue";
import type { NewsItem } from "@/types/news";

const router = useRouter();
const newsStore = useNewsStore();
const timelineStore = useTimelineStore();

// 响应式数据
const loading = ref(false);
const selectedCategory = ref("all");

// 计算属性
const categories = computed(() => NEWS_CATEGORIES);

const hotNews = computed(() => newsStore.hotNews.slice(0, 5));

const displayNews = computed(() => {
  const filtered =
    selectedCategory.value === "all"
      ? newsStore.newsList
      : newsStore.newsList.filter(
          (news) => news.category === selectedCategory.value
        );

  return filtered.slice(0, 8);
});

const timelineEvents = computed(() => timelineStore.recentEvents.slice(0, 8));

const todayCount = computed(() => {
  const today = new Date();
  const todayStr = today.toDateString();
  return newsStore.newsList.filter(
    (news) => new Date(news.publishTime).toDateString() === todayStr
  ).length;
});

// 方法
const getCategoryName = (categorySlug: string): string => {
  const category = NEWS_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.name || categorySlug;
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
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

const viewMoreTimeline = () => {
  router.push("/timeline");
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

// 生命周期
onMounted(async () => {
  await Promise.all([
    newsStore.fetchNews(),
    newsStore.fetchHotNews(),
    timelineStore.fetchTimelineEvents(),
  ]);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.el-carousel :deep(.el-carousel__indicator) {
  background-color: rgba(255, 255, 255, 0.3);
}

.el-carousel :deep(.el-carousel__indicator.is-active) {
  background-color: white;
}
</style>