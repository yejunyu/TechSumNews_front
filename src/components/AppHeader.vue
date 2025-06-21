<template>
  <header class="app-header bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo和品牌 -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">T</span>
            </div>
            <span class="text-xl font-bold text-gray-900">TechSum</span>
          </router-link>
        </div>

        <!-- 导航菜单 -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link text-gray-600 hover:text-blue-600 font-medium transition-colors"
            active-class="text-blue-600"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- 搜索和用户操作 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索框 -->
          <div class="hidden sm:block">
            <el-input
              v-model="searchKeyword"
              placeholder="Search..."
              @keyup.enter="handleSearch"
              class="w-48"
              size="small"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 主题切换 -->
          <el-button
            @click="toggleTheme"
            :icon="appStore.isDarkMode ? Sunny : Moon"
            circle
            size="small"
            class="theme-toggle"
          />

          <!-- 移动端菜单按钮 -->
          <el-button
            @click="toggleMobileMenu"
            :icon="Menu"
            circle
            size="small"
            class="md:hidden"
          />
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <div
        v-show="showMobileMenu"
        class="md:hidden border-t border-gray-200 py-4"
      >
        <div class="flex flex-col space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-blue-600 bg-blue-50"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- 移动端搜索 -->
        <div class="mt-4 px-4">
          <el-input
            v-model="searchKeyword"
            placeholder="Search news, events..."
            @keyup.enter="handleSearch"
            size="small"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { Search, Menu, Moon, Sunny } from "@element-plus/icons-vue";

const router = useRouter();
const appStore = useAppStore();

// 响应式数据
const searchKeyword = ref("");
const showMobileMenu = ref(false);

// 导航菜单项
const navItems = [
  { name: "TechSum", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Highlights", path: "/highlights" },
];

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`);
    searchKeyword.value = "";
    closeMobileMenu();
  }
};

const toggleTheme = () => {
  appStore.toggleTheme();
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};
</script>

<style scoped>
.nav-link {
  position: relative;
}

.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 1px;
}

.theme-toggle:hover {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.app-header {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}
</style>