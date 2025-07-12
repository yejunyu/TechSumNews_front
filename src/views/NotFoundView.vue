<template>
  <div
    class="not-found-view min-h-screen flex items-center justify-center bg-gray-50"
  >
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <div class="text-4xl font-bold text-gray-700 mb-4">页面不存在</div>
        <p class="text-gray-600 mb-8 max-w-md">
          抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页浏览其他内容。
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center space-x-4">
          <button class="btn btn-primary btn-lg" @click="goHome">
            <House class="w-5 h-5 mr-2" />
            返回首页
          </button>
          <button class="btn btn-lg" @click="goBack">
            <ArrowLeft class="w-5 h-5 mr-2" />
            返回上页
          </button>
        </div>

        <div class="text-sm text-gray-500">或者尝试搜索您需要的内容</div>

        <div class="max-w-md mx-auto">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索新闻、事件..."
            @keyup.enter="handleSearch"
            size="large"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <button class="btn" @click="handleSearch">搜索</button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 推荐链接 -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          您可能感兴趣的内容
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <router-link
            to="/"
            class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div class="text-blue-600 text-2xl mb-2">📰</div>
            <div class="font-medium text-gray-900">最新资讯</div>
            <div class="text-sm text-gray-600">浏览最新科技新闻</div>
          </router-link>

          <router-link
            to="/timeline"
            class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div class="text-green-600 text-2xl mb-2">⏰</div>
            <div class="font-medium text-gray-900">热点时间轴</div>
            <div class="text-sm text-gray-600">追踪重要事件</div>
          </router-link>

          <router-link
            to="/highlights"
            class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div class="text-purple-600 text-2xl mb-2">⭐</div>
            <div class="font-medium text-gray-900">精选内容</div>
            <div class="text-sm text-gray-600">编辑推荐文章</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  HomeIcon as House,
  ArrowLeftIcon as ArrowLeft,
  MagnifyingGlassIcon as Search,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const searchKeyword = ref("");

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`);
  }
};
</script>

<style scoped>
.not-found-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.not-found-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
}

.not-found-view > div {
  position: relative;
  z-index: 1;
}
</style>