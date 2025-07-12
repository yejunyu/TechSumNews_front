<template>
  <footer class="app-footer bg-gray-900 text-white">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌信息 -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">T</span>
            </div>
            <span class="text-xl font-bold">TechSum</span>
          </div>
          <p class="text-gray-400 mb-4 max-w-md">
            Professional tech news aggregation platform providing you with the
            latest and most comprehensive technology trends and industry
            analysis.
          </p>
          <div class="flex space-x-4">
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <el-icon size="20"><Platform /></el-icon>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <el-icon size="20"><Message /></el-icon>
            </a>
            <a
              href="#"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <el-icon size="20"><Share /></el-icon>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="text-gray-400 hover:text-white transition-colors"
              >
                TechSum
              </router-link>
            </li>
            <li>
              <router-link
                to="/highlights"
                class="text-gray-400 hover:text-white transition-colors"
              >
                Highlights
              </router-link>
            </li>
            <li>
              <router-link
                to="/events"
                class="text-gray-400 hover:text-white transition-colors"
              >
                Events
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 分类链接 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Popular Categories</h3>
          <ul class="space-y-2">
            <li v-for="category in popularCategories" :key="category.slug">
              <router-link
                :to="`/category/${category.slug}`"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; {{ currentYear }} TechSum. All rights reserved.</p>
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" class="hover:text-white transition-colors"
              >Privacy Policy</a
            >
            <a href="#" class="hover:text-white transition-colors"
              >Terms of Service</a
            >
            <a href="#" class="hover:text-white transition-colors"
              >Contact Us</a
            >
            <a href="#" class="hover:text-white transition-colors">About Us</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <div
        v-show="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 z-50"
      >
        <el-icon><ArrowUp /></el-icon>
      </div>
    </transition>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { NEWS_CATEGORIES } from "@/utils/constants";
import {
  DevicePhoneMobileIcon as Platform,
  ChatBubbleLeftEllipsisIcon as Message,
  ShareIcon as Share,
  ArrowUpIcon as ArrowUp,
} from "@heroicons/vue/24/outline";

// 响应式数据
const showBackToTop = ref(false);

// 计算属性
const currentYear = computed(() => new Date().getFullYear());

const popularCategories = computed(
  () => NEWS_CATEGORIES.slice(1, 6) // 排除"全部"分类，取前5个
);

// 方法
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// 生命周期
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}
</style>