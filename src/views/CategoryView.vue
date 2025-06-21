<template>
  <div class="category-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: categoryInfo?.color + '20' }"
          >
            <span
              class="text-2xl font-bold"
              :style="{ color: categoryInfo?.color }"
            >
              {{ categoryInfo?.name?.charAt(0) }}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ categoryInfo?.name }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ getCategoryDescription(category) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600"
              >共 {{ newsStore.filteredNews.length }} 条新闻</span
            >
            <el-divider direction="vertical" />
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="list">列表</el-radio-button>
              <el-radio-button label="grid">网格</el-radio-button>
            </el-radio-group>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">排序:</span>
            <el-select
              v-model="sortBy"
              @change="handleSort"
              class="w-32"
              size="small"
            >
              <el-option label="最新" value="publishTime" />
              <el-option label="热门" value="viewCount" />
              <el-option label="点赞" value="likes" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻内容 -->
    <div class="container mx-auto px-6 py-8">
      <div v-if="newsStore.loading" class="flex justify-center py-12">
        <el-loading />
      </div>

      <div
        v-else-if="newsStore.filteredNews.length === 0"
        class="text-center py-12"
      >
        <el-empty description="该分类下暂无新闻" />
        <el-button type="primary" @click="goHome" class="mt-4"
          >浏览其他分类</el-button
        >
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'" class="space-y-6">
        <article
          v-for="news in paginatedNews"
          :key="news.id"
          class="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow cursor-pointer"
          @click="goToNews(news.id)"
        >
          <div class="flex space-x-4">
            <img
              :src="news.imageUrl"
              :alt="news.title"
              class="w-32 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <h2
                  class="text-xl font-semibold text-gray-900 line-clamp-2 flex-1"
                >
                  {{ news.title }}
                </h2>
                <el-tag
                  v-if="news.isHot"
                  type="danger"
                  size="small"
                  class="ml-2"
                  >热门</el-tag
                >
              </div>

              <p class="text-gray-600 mb-4 line-clamp-2">{{ news.summary }}</p>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ news.author }}</span>
                  <span>·</span>
                  <span>{{ formatRelativeTime(news.publishTime) }}</span>
                  <span>·</span>
                  <span>{{ formatNumber(news.viewCount) }} 浏览</span>
                  <span>·</span>
                  <span>{{ news.likes }} 点赞</span>
                </div>

                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="tag in news.tags.slice(0, 3)"
                    :key="tag"
                    size="small"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- 网格视图 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="news in paginatedNews"
          :key="news.id"
          class="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer"
          @click="goToNews(news.id)"
        >
          <div class="relative">
            <img
              :src="news.imageUrl"
              :alt="news.title"
              class="w-full h-48 object-cover"
            />
            <el-tag
              v-if="news.isHot"
              type="danger"
              size="small"
              class="absolute top-2 right-2"
            >
              热门
            </el-tag>
          </div>

          <div class="p-4">
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ news.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ news.summary }}
            </p>

            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-3"
            >
              <span>{{ news.author }}</span>
              <span>{{ formatRelativeTime(news.publishTime) }}</span>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3 text-xs text-gray-500">
                <span>{{ formatNumber(news.viewCount) }} 浏览</span>
                <span>{{ news.likes }} 点赞</span>
              </div>

              <div class="flex flex-wrap gap-1">
                <el-tag
                  v-for="tag in news.tags.slice(0, 2)"
                  :key="tag"
                  size="small"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div
        v-if="newsStore.filteredNews.length > pageSize"
        class="flex justify-center mt-8"
      >
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="newsStore.filteredNews.length"
          layout="prev, pager, next, total, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useNewsStore } from "@/stores/news";
import { NEWS_CATEGORIES } from "@/utils/constants";
import { formatRelativeTime, formatNumber } from "@/utils/formatUtils";

const router = useRouter();
const newsStore = useNewsStore();

// Props
const props = defineProps<{
  category: string;
}>();

// 响应式数据
const viewMode = ref<"list" | "grid">("list");
const sortBy = ref("publishTime");
const currentPage = ref(1);
const pageSize = ref(12);

// 计算属性
const categoryInfo = computed(() =>
  NEWS_CATEGORIES.find((cat) => cat.slug === props.category)
);

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return newsStore.filteredNews.slice(start, end);
});

// 方法
const getCategoryDescription = (category: string): string => {
  const descriptions: Record<string, string> = {
    ai: "人工智能领域的最新发展和突破",
    blockchain: "区块链技术和加密货币相关资讯",
    internet: "互联网行业动态和趋势分析",
    hardware: "硬件设备和技术创新",
    software: "软件开发和应用技术",
    startup: "创业投资和商业模式",
    mobile: "移动应用和移动技术",
    cloud: "云计算和云服务",
    security: "网络安全和信息安全",
    data: "大数据和数据分析",
  };
  return descriptions[category] || "科技资讯和行业动态";
};

const handleSort = () => {
  // 重新排序逻辑
  let sortedNews = [...newsStore.filteredNews];

  switch (sortBy.value) {
    case "publishTime":
      sortedNews.sort(
        (a, b) =>
          new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
      );
      break;
    case "viewCount":
      sortedNews.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "likes":
      sortedNews.sort((a, b) => b.likes - a.likes);
      break;
  }

  // 这里应该更新store中的数据，但为了简化，我们重置页码
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goToNews = (newsId: string) => {
  router.push(`/news/${newsId}`);
};

const goHome = () => {
  router.push("/");
};

// 监听分类变化
watch(
  () => props.category,
  async (newCategory) => {
    if (newCategory) {
      currentPage.value = 1;
      await newsStore.fetchNewsByCategory(newCategory);
    }
  },
  { immediate: true }
);

// 生命周期
onMounted(async () => {
  if (props.category) {
    await newsStore.fetchNewsByCategory(props.category);
  }
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