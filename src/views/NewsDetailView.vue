<template>
  <div class="news-detail-view">
    <div v-if="loading" class="flex justify-center py-12">
      <el-loading />
    </div>

    <div v-else-if="!news" class="text-center py-12">
      <el-empty description="新闻不存在" />
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>

    <div v-else class="container mx-auto px-6 py-8 max-w-4xl">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="mb-6">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${news.category}` }">
          {{ getCategoryName(news.category) }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ news.title }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 文章主体 -->
      <article class="bg-white rounded-lg shadow-card p-8">
        <!-- 文章头部 -->
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {{ news.title }}
          </h1>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ news.author }}</span>
              <span>·</span>
              <span>{{ formatDateTime(news.publishTime) }}</span>
              <span>·</span>
              <span>{{ formatNumber(news.viewCount) }} 浏览</span>
            </div>

            <div class="flex items-center space-x-2">
              <el-button
                :icon="isFavorite ? 'StarFilled' : 'Star'"
                :type="isFavorite ? 'primary' : 'default'"
                @click="toggleFavorite"
              >
                {{ isFavorite ? "已收藏" : "收藏" }}
              </el-button>
              <el-button :icon="'Share'" @click="shareArticle">
                分享
              </el-button>
            </div>
          </div>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="category-tag" :class="`category-tag-${news.category}`">
              {{ getCategoryName(news.category) }}
            </span>
            <el-tag
              v-for="tag in news.tags"
              :key="tag"
              type="info"
              class="cursor-pointer"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>

          <!-- 摘要 -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-gray-700 text-lg leading-relaxed">
              {{ news.summary }}
            </p>
          </div>
        </header>

        <!-- 文章图片 -->
        <div v-if="news.imageUrl" class="mb-8">
          <img
            :src="news.imageUrl"
            :alt="news.title"
            class="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <!-- 文章内容 -->
        <div class="prose prose-lg max-w-none">
          <div
            v-html="formattedContent"
            class="text-gray-800 leading-relaxed"
          ></div>
        </div>

        <!-- 文章底部 -->
        <footer class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <el-button
                :icon="'ThumbUp'"
                :type="isLiked ? 'primary' : 'default'"
                @click="toggleLike"
              >
                {{ news.likes }} 点赞
              </el-button>
              <span class="text-sm text-gray-500"
                >阅读量: {{ formatNumber(news.viewCount) }}</span
              >
            </div>

            <div class="text-sm text-gray-500">
              <span v-if="news.sourceUrl">
                来源:
                <a
                  :href="news.sourceUrl"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800"
                >
                  {{ news.author }}
                </a>
              </span>
            </div>
          </div>
        </footer>
      </article>

      <!-- 相关新闻 -->
      <section v-if="relatedNews.length > 0" class="mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">相关新闻</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="relatedItem in relatedNews"
            :key="relatedItem.id"
            class="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer"
            @click="goToNews(relatedItem.id)"
          >
            <img
              :src="relatedItem.imageUrl"
              :alt="relatedItem.title"
              class="w-full h-32 object-cover"
            />
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                {{ relatedItem.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-2 line-clamp-2">
                {{ relatedItem.summary }}
              </p>
              <div
                class="flex items-center justify-between text-xs text-gray-500"
              >
                <span>{{ relatedItem.author }}</span>
                <span>{{ formatRelativeTime(relatedItem.publishTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
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
  formatDateTime,
  formatRelativeTime,
  formatNumber,
} from "@/utils/formatUtils";
import { getRelatedNews } from "@/services/mockData";
import type { NewsItem } from "@/types/news";

const route = useRoute();
const router = useRouter();
const newsStore = useNewsStore();
const appStore = useAppStore();

// Props
const props = defineProps<{
  id: string;
}>();

// 响应式数据
const loading = ref(true);
const news = ref<NewsItem | null>(null);
const relatedNews = ref<NewsItem[]>([]);
const isLiked = ref(false);

// 计算属性
const isFavorite = computed(() => appStore.isFavorite(props.id));

const formattedContent = computed(() => {
  if (!news.value) return "";

  // 将换行符转换为HTML段落
  return news.value.content
    .split("\n\n")
    .map(
      (paragraph) => `<p class="mb-4">${paragraph.replace(/\n/g, "<br>")}</p>`
    )
    .join("");
});

// 方法
const loadNewsDetail = async () => {
  loading.value = true;
  try {
    const newsDetail = await newsStore.fetchNewsDetail(props.id);
    if (newsDetail) {
      news.value = newsDetail;
      // 添加到阅读历史
      appStore.addReadingHistory(props.id);
      // 加载相关新闻
      relatedNews.value = await getRelatedNews(props.id, 3);
    }
  } catch (error) {
    console.error("Failed to load news detail:", error);
    appStore.showError("加载新闻详情失败");
  } finally {
    loading.value = false;
  }
};

const getCategoryName = (categorySlug: string): string => {
  const category = NEWS_CATEGORIES.find((cat) => cat.slug === categorySlug);
  return category?.name || categorySlug;
};

const toggleFavorite = () => {
  appStore.toggleFavorite(props.id);
  appStore.showMessage(isFavorite.value ? "已收藏" : "已取消收藏");
};

const toggleLike = async () => {
  if (!news.value) return;

  try {
    await newsStore.likeNews(props.id);
    isLiked.value = !isLiked.value;
    appStore.showMessage("点赞成功");
  } catch (error) {
    appStore.showError("点赞失败");
  }
};

const shareArticle = () => {
  if (navigator.share && news.value) {
    navigator.share({
      title: news.value.title,
      text: news.value.summary,
      url: window.location.href,
    });
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href);
    appStore.showMessage("链接已复制到剪贴板");
  }
};

const searchByTag = (tag: string) => {
  router.push(`/search?q=${encodeURIComponent(tag)}`);
};

const goToNews = (newsId: string) => {
  router.push(`/news/${newsId}`);
};

const goBack = () => {
  router.back();
};

// 监听路由参数变化
watch(
  () => props.id,
  () => {
    loadNewsDetail();
  },
  { immediate: true }
);

// 生命周期
onMounted(() => {
  loadNewsDetail();
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
  @apply inline-block px-3 py-1 text-sm font-medium rounded-full;
}

.category-tag-ai {
  @apply bg-blue-100 text-blue-800;
}

.category-tag-blockchain {
  @apply bg-purple-100 text-purple-800;
}

.category-tag-internet {
  @apply bg-green-100 text-green-800;
}

.category-tag-hardware {
  @apply bg-orange-100 text-orange-800;
}

.category-tag-software {
  @apply bg-indigo-100 text-indigo-800;
}

.category-tag-mobile {
  @apply bg-cyan-100 text-cyan-800;
}

.category-tag-cloud {
  @apply bg-lime-100 text-lime-800;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem 0;
  color: #1f2937;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  color: #374151;
}

.prose ul,
.prose ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.5rem 0;
}

.prose strong {
  font-weight: 600;
  color: #1f2937;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
</style>