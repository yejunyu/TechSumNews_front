<template>
  <header class="app-header bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo和品牌 -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-2">
            <img
              src="/image.png"
              alt="TechSum Logo"
              class="w-8 h-8 rounded-lg"
            />
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
            <div class="relative flex items-center">
              <Search class="w-4 h-4 text-gray-400 search-icon" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="Search..."
                @keyup.enter="handleSearch"
                class="input input-bordered input-sm w-48 pl-8"
              />
            </div>
          </div>

          <!-- 主题切换 -->
          <button
            @click="themeStore.toggleTheme"
            class="btn btn-circle btn-sm theme-toggle"
            :title="themeStore.isDark ? '切换到浅色模式' : '切换到深色模式'"
          >
            <component :is="themeStore.isDark ? Sunny : Moon" class="w-4 h-4" />
          </button>

          <!-- <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div> -->
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useThemeStore } from "@/stores/theme";

import {
  MagnifyingGlassIcon as Search,
  Bars3Icon as Menu,
  MoonIcon as Moon,
  SunIcon as Sunny,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const appStore = useAppStore();
const themeStore = useThemeStore();

// 响应式数据
const searchKeyword = ref("");
const showMobileMenu = ref(false);

// 导航菜单项
const navItems = [
  { name: "Highlights", path: "/" },
  { name: "Events", path: "/events" },
  { name: "TechSum", path: "/techsum" },
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
  themeStore.toggleTheme();
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
  background-color: hsla(var(--b1) / 0.95);
}
</style>