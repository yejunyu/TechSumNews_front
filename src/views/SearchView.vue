<template>
  <div class="search-view">
    <!-- 搜索头部 -->
    <div class="page-header">
      <div class="container mx-auto px-6 py-4">
        <h1 class="text-3xl font-bold text-gray-900">搜索结果</h1>
        <p class="text-gray-600 mt-2">
          <span v-if="searchKeyword">关键词: "{{ searchKeyword }}"</span>
          <span v-if="filteredResults.length > 0"
            >，找到 {{ filteredResults.length }} 条结果</span
          >
        </p>
      </div>
    </div>

    <!-- 搜索栏和筛选器 -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="join w-full">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search class="w-5 h-5 text-gray-400" />
                </span>
                <input
                  v-model="searchInput"
                  type="text"
                  placeholder="搜索新闻、事件..."
                  @keyup.enter="handleSearch"
                  class="input input-bordered input-lg w-full join-item pl-12"
                />
              </div>
              <button
                @click="handleSearch"
                class="tech-btn-primary btn-lg join-item"
              >
                搜索
              </button>
            </div>
          </div>

          <div class="flex gap-2">
            <select
              v-model="selectedCategory"
              @change="handleFilter"
              class="select select-sm w-32"
            >
              <option value="all">全部</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.slug"
              >
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="sortBy"
              @change="handleSort"
              class="select select-sm w-32"
            >
              <option value="relevance">相关性</option>
              <option value="publishTime">最新</option>
              <option value="viewCount">热门</option>
              <option value="likes">点赞</option>
            </select>
          </div>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0 && !searchKeyword" class="mt-4">
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-sm text-gray-600">搜索历史:</span>
            <button
              class="btn btn-link btn-sm text-error"
              @click="clearHistory"
            >
              清除
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="keyword in searchHistory.slice(0, 10)"
              :key="keyword"
              class="badge badge-outline badge-sm cursor-pointer"
              @click="searchFromHistory(keyword)"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="container mx-auto px-6 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else-if="filteredResults.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <p class="text-gray-600 text-lg">没有找到相关结果</p>
        <div class="mt-4">
          <p class="text-gray-600 mb-4">尝试以下建议:</p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li>• 检查拼写是否正确</li>
            <li>• 尝试使用更通用的关键词</li>
            <li>• 减少关键词数量</li>
            <li>• 尝试不同的分类筛选</li>
          </ul>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="item in paginatedResults"
          :key="item.id"
          class="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow cursor-pointer"
          @click="goToNews(item.id)"
        >
          <div class="flex space-x-4">
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-24 h-18 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                v-html="highlightKeyword(item.title, searchKeyword)"
              ></h3>
              <p
                class="text-gray-600 mb-3 line-clamp-2"
                v-html="highlightKeyword(item.summary, searchKeyword)"
              ></p>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 text-sm text-gray-500">
                  <span>{{ item.author }}</span>
                  <span>·</span>
                  <span>{{ formatRelativeTime(item.publishTime) }}</span>
                  <span>·</span>
                  <span>{{ formatNumber(item.viewCount) }} 浏览</span>
                </div>

                <div class="flex items-center space-x-2">
                  <span
                    class="category-tag"
                    :class="`category-tag-${item.category}`"
                  >
                    {{ getCategoryName(item.category) }}
                  </span>

                  <div
                    class="flex items-center space-x-1 text-sm text-gray-500"
                  >
                    <Star class="w-4 h-4" />
                    <span>{{ item.likes }}</span>
                  </div>
                </div>
              </div>

              <!-- 匹配的标签 -->
              <div v-if="getMatchingTags(item).length > 0" class="mt-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in getMatchingTags(item)"
                    :key="tag"
                    class="badge badge-success badge-sm"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div
          v-if="filteredResults.length > pageSize"
          class="flex justify-center mt-8"
        >
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredResults.length"
            layout="prev, pager, next, total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNewsStore } from "@/stores/news";
import { useAppStore } from "@/stores/app";
import { NEWS_CATEGORIES } from "@/utils/constants";
import {
  formatRelativeTime,
  formatNumber,
  highlightKeyword,
} from "@/utils/formatUtils";
import {
  MagnifyingGlassIcon as Search,
  StarIcon as Star,
} from "@heroicons/vue/24/outline";
import type { NewsItem } from "@/types/news";

const route = useRoute();
const router = useRouter();
const newsStore = useNewsStore();
const appStore = useAppStore();

// 响应式数据
const loading = ref(false);
const searchInput = ref("");
const searchKeyword = ref("");
const selectedCategory = ref("all");
const sortBy = ref("relevance");
const searchResults = ref<NewsItem[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性
const categories = computed(() =>
  NEWS_CATEGORIES.filter((cat) => cat.id !== "all")
);

const searchHistory = computed(() => appStore.recentSearches);

const filteredResults = computed(() => {
  let results = [...searchResults.value];

  // 分类筛选
  if (selectedCategory.value !== "all") {
    results = results.filter(
      (item) => item.category === selectedCategory.value
    );
  }

  // 排序
  switch (sortBy.value) {
    case "publishTime":
      results.sort(
        (a, b) =>
          new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
      );
      break;
    case "viewCount":
      results.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "likes":
      results.sort((a, b) => b.likes - a.likes);
      break;
    case "relevance":
    default:
      // 相关性排序：标题匹配 > 摘要匹配 > 标签匹配
      results.sort((a, b) => {
        const aScore = getRelevanceScore(a);
        const bScore = getRelevanceScore(b);
        return bScore - aScore;
      });
      break;
  }

  return results;
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredResults.value.slice(start, end);
});

// 方法
const getRelevanceScore = (item: NewsItem): number => {
  if (!searchKeyword.value) return 0;

  const keyword = searchKeyword.value.toLowerCase();
  let score = 0;

  // 标题匹配权重最高
  if (item.title.toLowerCase().includes(keyword)) {
    score += 10;
  }

  // 摘要匹配
  if (item.summary.toLowerCase().includes(keyword)) {
    score += 5;
  }

  // 标签匹配
  const matchingTags = item.tags.filter((tag) =>
    tag.toLowerCase().includes(keyword)
  );
  score += matchingTags.length * 3;

  // 热门程度加分
  if (item.isHot) {
    score += 2;
  }

  return score;
};

const getMatchingTags = (item: NewsItem): string[] => {
  if (!searchKeyword.value) return [];

  const keyword = searchKeyword.value.toLowerCase();
  return item.tags.filter((tag) => tag.toLowerCase().includes(keyword));
};

const handleSearch = async () => {
  if (!searchInput.value.trim()) return;

  searchKeyword.value = searchInput.value.trim();
  loading.value = true;

  try {
    // 添加到搜索历史
    appStore.addSearchHistory(searchKeyword.value);

    // 执行搜索
    await newsStore.searchNews(searchKeyword.value);
    searchResults.value = newsStore.newsList;

    // 重置分页
    currentPage.value = 1;

    // 更新URL
    router.replace({
      path: "/search",
      query: { q: searchKeyword.value },
    });
  } catch (error) {
    console.error("Search failed:", error);
    appStore.showError("搜索失败，请重试");
  } finally {
    loading.value = false;
  }
};

const handleFilter = () => {
  currentPage.value = 1;
};

const handleSort = () => {
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const searchFromHistory = (keyword: string) => {
  searchInput.value = keyword;
  handleSearch();
};

const clearHistory = () => {
  appStore.clearSearchHistory();
};

const getCategoryName = (categorySlug: string): string => {
  const category = NEWS_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.name || categorySlug;
};

const goToNews = (newsId: string) => {
  router.push(`/news/${newsId}`);
};

// 监听路由查询参数
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === "string") {
      searchInput.value = newQuery;
      searchKeyword.value = newQuery;
      handleSearch();
    }
  },
  { immediate: true }
);

// 生命周期
onMounted(async () => {
  // 如果URL中有查询参数，执行搜索
  const query = route.query.q;
  if (query && typeof query === "string") {
    searchInput.value = query;
    searchKeyword.value = query;
    await handleSearch();
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

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
}

.category-tag-ai {
  background-color: #dbeafe;
  color: #1e40af;
}

.category-tag-blockchain {
  background-color: #e9d5ff;
  color: #7c3aed;
}

.category-tag-internet {
  background-color: #dcfce7;
  color: #166534;
}

.category-tag-hardware {
  background-color: #fed7aa;
  color: #ea580c;
}

.category-tag-software {
  background-color: #e0e7ff;
  color: #4338ca;
}

.category-tag-mobile {
  background-color: #cffafe;
  color: #0891b2;
}

.category-tag-cloud {
  background-color: #ecfccb;
  color: #65a30d;
}
</style>