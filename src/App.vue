<template>
  <div id="app" :class="appStore.themeClass">
    <!-- 全局加载指示器 -->
    <div
      v-if="appStore.globalLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- 全局错误提示 -->
    <div
      v-if="appStore.error"
      class="alert alert-error fixed top-4 right-4 z-40 max-w-md"
    >
      <span>{{ appStore.error }}</span>
      <button
        @click="appStore.clearMessages"
        class="btn btn-sm btn-circle btn-ghost"
      >
        ✕
      </button>
    </div>

    <!-- 全局成功提示 -->
    <div
      v-if="appStore.message"
      class="alert alert-success fixed top-4 right-4 z-40 max-w-md"
    >
      <span>{{ appStore.message }}</span>
      <button
        @click="appStore.clearMessages"
        class="btn btn-sm btn-circle btn-ghost"
      >
        ✕
      </button>
    </div>

    <!-- 网络状态提示 -->
    <div
      v-if="!appStore.isOnline"
      class="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50"
    >
      <Connection class="w-4 h-4 mr-2 inline" />
      网络连接已断开，请检查您的网络设置
    </div>

    <!-- 应用主体 -->
    <div class="app-container min-h-screen flex flex-col">
      <!-- 头部导航 -->
      <AppHeader />

      <!-- 主要内容区域 -->
      <main class="flex-1 bg-gray-50">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores/app";
import AppHeader from "@/components/AppHeader.vue";
import { WifiIcon as Connection } from "@heroicons/vue/24/outline";

const appStore = useAppStore();

// 窗口大小变化处理
const handleResize = () => {
  appStore.handleResize();
};

// 生命周期钩子
onMounted(async () => {
  // 初始化应用
  await appStore.initializeApp();

  // 监听窗口大小变化
  window.addEventListener("resize", handleResize);

  // 应用初始主题
  document.documentElement.classList.toggle("dark", appStore.isDarkMode);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
/* 全局样式 */
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 暗色主题样式 */
.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .bg-white {
  background-color: #2d2d2d !important;
}

.dark .bg-gray-50 {
  background-color: #1a1a1a !important;
}

.dark .bg-gray-100 {
  background-color: #2d2d2d !important;
}

.dark .text-gray-900 {
  color: #ffffff !important;
}

.dark .text-gray-600 {
  color: #a0a0a0 !important;
}

.dark .text-gray-500 {
  color: #808080 !important;
}

.dark .border-gray-200 {
  border-color: #404040 !important;
}

.dark .shadow-card {
  box-shadow: 0 1px 3px 0 rgba(255, 255, 255, 0.1),
    0 1px 2px 0 rgba(255, 255, 255, 0.06);
}

.dark .shadow-card-hover:hover {
  box-shadow: 0 10px 15px -3px rgba(255, 255, 255, 0.1),
    0 4px 6px -2px rgba(255, 255, 255, 0.05);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Element Plus 组件自定义样式 */
.el-loading-mask {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.el-alert {
  border-radius: 8px !important;
}

.el-button {
  border-radius: 6px !important;
}

.el-input__wrapper {
  border-radius: 6px !important;
}

.el-card {
  border-radius: 8px !important;
}

/* 工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
