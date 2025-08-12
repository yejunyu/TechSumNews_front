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

    <!-- 筛选和排序（DaisyUI） -->
    <div class="bg-base-100 shadow-sm border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-sm text-base-content/70">
              共 {{ newsStore.filteredNews.length }} 条新闻
            </span>
            <div class="join">
              <button
                class="btn btn-sm join-item"
                :class="{ 'btn-active btn-primary': viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                列表
              </button>
              <button
                class="btn btn-sm join-item"
                :class="{ 'btn-active btn-primary': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                网格
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/70">排序:</span>
            <select
              v-model="sortBy"
              @change="handleSort"
              class="select select-bordered select-sm w-36"
            >
              <option value="publishTime">最新</option>
              <option value="viewCount">热门</option>
              <option value="likes">点赞</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻内容 -->
    <div class="container mx-auto px-6 py-8">
      <div v-if="newsStore.loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div
        v-else-if="newsStore.filteredNews.length === 0"
        class="text-center py-12"
      >
        <div class="text-6xl mb-3">📰</div>
        <p class="text-base-content/70 mb-4">该分类下暂无新闻</p>
        <button class="btn btn-primary" @click="goHome">浏览其他分类</button>
      </div>

      <!-- 列表视图（Card + Collapse） -->
      <div v-else-if="viewMode === 'list'" class="space-y-4">
        <div
          v-for="news in paginatedNews"
          :key="news.id"
          class="card bg-base-100 shadow tech-card"
        >
          <div class="card-body p-0">
            <div class="collapse collapse-arrow">
              <input type="checkbox" />
              <div class="collapse-title">
                <div class="flex gap-4 items-start">
                  <img
                    :src="news.imageUrl"
                    :alt="news.title"
                    class="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <h2
                        class="text-lg font-semibold text-base-content line-clamp-2 flex-1"
                      >
                        {{ news.title }}
                      </h2>
                      <span
                        v-if="news.isHot"
                        class="badge badge-error badge-sm ml-2"
                        >热门</span
                      >
                    </div>
                    <div
                      class="mt-2 flex items-center gap-3 text-sm text-base-content/60"
                    >
                      <span>{{ news.author }}</span>
                      <span>·</span>
                      <span>{{ formatRelativeTime(news.publishTime) }}</span>
                      <span>·</span>
                      <span>{{ formatNumber(news.viewCount) }} 浏览</span>
                      <span>·</span>
                      <span>{{ news.likes }} 点赞</span>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-1">
                      <span
                        v-for="tag in news.tags.slice(0, 3)"
                        :key="tag"
                        class="badge badge-outline badge-sm"
                        >{{ tag }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="collapse-content">
                <p class="text-base-content/70 mb-3">{{ news.summary }}</p>
                <div class="card-actions justify-end">
                  <button
                    class="btn btn-sm btn-primary"
                    @click.stop="goToNews(news.id)"
                  >
                    阅读更多
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 网格视图（Card + Collapse） -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="news in paginatedNews"
          :key="news.id"
          class="card bg-base-100 shadow tech-card"
        >
          <figure class="relative">
            <img
              :src="news.imageUrl"
              :alt="news.title"
              class="w-full h-48 object-cover"
            />
            <span
              v-if="news.isHot"
              class="badge badge-error badge-sm absolute top-2 right-2"
              >热门</span
            >
          </figure>
          <div class="card-body">
            <h3 class="card-title text-base-content line-clamp-2">
              {{ news.title }}
            </h3>
            <div
              class="text-sm text-base-content/60 flex items-center justify-between"
            >
              <span>{{ news.author }}</span>
              <span>{{ formatRelativeTime(news.publishTime) }}</span>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in news.tags.slice(0, 2)"
                :key="tag"
                class="badge badge-outline badge-sm"
                >{{ tag }}</span
              >
            </div>
            <div
              class="mt-2 collapse collapse-arrow border border-base-300 rounded-box"
            >
              <input type="checkbox" />
              <div class="collapse-title p-0 text-sm text-base-content/70">
                展开摘要
              </div>
              <div class="collapse-content p-0 pt-2">
                <p class="text-sm text-base-content/70 line-clamp-3">
                  {{ news.summary }}
                </p>
                <div class="card-actions justify-end mt-3">
                  <button
                    class="btn btn-sm btn-primary"
                    @click.stop="goToNews(news.id)"
                  >
                    阅读更多
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页（DaisyUI） -->
      <div
        v-if="newsStore.filteredNews.length > pageSize"
        class="flex items-center justify-center gap-4 mt-8"
      >
        <div class="join">
          <button
            class="btn btn-sm join-item"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            上一页
          </button>
          <button
            v-for="p in pageNumbers"
            :key="p"
            class="btn btn-sm join-item"
            :class="{ 'btn-active btn-primary': p === currentPage }"
            @click="handlePageChange(p)"
          >
            {{ p }}
          </button>
          <button
            class="btn btn-sm join-item"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            下一页
          </button>
        </div>
        <div class="text-sm text-base-content/60">共 {{ totalPages }} 页</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useNewsStore } from "../stores/news";
import { NEWS_CATEGORIES } from "../utils/constants";
import { formatRelativeTime, formatNumber } from "../utils/formatUtils";

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

const totalPages = computed(() =>
  Math.max(1, Math.ceil(newsStore.filteredNews.length / pageSize.value))
);

const pageNumbers = computed(() => {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages.value; i += 1) pages.push(i);
  return pages;
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
  if (page < 1 || page > totalPages.value) return;
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