import { defineStore } from "pinia";
import { STORAGE_KEYS, DEFAULT_CONFIG } from "@/utils/constants";

interface AppState {
  // 主题配置
  theme: "light" | "dark";
  // 语言配置
  language: string;
  // 侧边栏状态
  sidebarCollapsed: boolean;
  // 移动端侧边栏状态
  mobileSidebarOpen: boolean;
  // 加载状态
  globalLoading: boolean;
  // 错误信息
  error: string | null;
  // 成功消息
  message: string | null;
  // 用户偏好设置
  preferences: {
    pageSize: number;
    autoRefresh: boolean;
    refreshInterval: number;
    showImages: boolean;
    compactMode: boolean;
    notifications: boolean;
  };
  // 搜索历史
  searchHistory: string[];
  // 阅读历史
  readingHistory: string[];
  // 收藏列表
  favorites: string[];
  // 网络状态
  isOnline: boolean;
  // 设备信息
  device: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    theme: "light",
    language: "en-US",
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    globalLoading: false,
    error: null,
    message: null,
    preferences: {
      pageSize: DEFAULT_CONFIG.PAGE_SIZE,
      autoRefresh: DEFAULT_CONFIG.AUTO_REFRESH,
      refreshInterval: DEFAULT_CONFIG.REFRESH_INTERVAL,
      showImages: DEFAULT_CONFIG.SHOW_IMAGES,
      compactMode: DEFAULT_CONFIG.COMPACT_MODE,
      notifications: true,
    },
    searchHistory: [],
    readingHistory: [],
    favorites: [],
    isOnline: navigator.onLine,
    device: {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    },
  }),

  getters: {
    // 获取当前主题类名
    themeClass(): string {
      return this.theme === "dark" ? "dark" : "";
    },

    // 检查是否为暗色模式
    isDarkMode(): boolean {
      return this.theme === "dark";
    },

    // 检查是否为移动设备
    isMobileDevice(): boolean {
      return this.device.isMobile;
    },

    // 检查是否显示侧边栏
    shouldShowSidebar(): boolean {
      return this.device.isDesktop || this.mobileSidebarOpen;
    },

    // 获取搜索历史（去重并限制数量）
    recentSearches(): string[] {
      return [...new Set(this.searchHistory)].slice(0, 10);
    },

    // 获取阅读历史（限制数量）
    recentReading(): string[] {
      return this.readingHistory.slice(0, 20);
    },
  },

  actions: {
    // 初始化应用状态
    async initializeApp() {
      this.loadUserPreferences();
      this.detectDevice();
      this.setupNetworkListener();
      this.loadUserData();
    },

    // 加载用户偏好设置
    loadUserPreferences() {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (saved) {
          const preferences = JSON.parse(saved);
          this.theme = preferences.theme || DEFAULT_CONFIG.THEME;
          this.language = preferences.language || DEFAULT_CONFIG.LANGUAGE;
          this.preferences = {
            ...this.preferences,
            ...preferences.preferences,
          };
          this.sidebarCollapsed = preferences.sidebarCollapsed || false;
        }
      } catch (error) {
        console.error("Failed to load user preferences:", error);
      }
    },

    // 保存用户偏好设置
    saveUserPreferences() {
      try {
        const preferences = {
          theme: this.theme,
          language: this.language,
          preferences: this.preferences,
          sidebarCollapsed: this.sidebarCollapsed,
        };
        localStorage.setItem(
          STORAGE_KEYS.USER_PREFERENCES,
          JSON.stringify(preferences)
        );
      } catch (error) {
        console.error("Failed to save user preferences:", error);
      }
    },

    // 加载用户数据
    loadUserData() {
      try {
        // 加载搜索历史
        const searchHistory = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
        if (searchHistory) {
          this.searchHistory = JSON.parse(searchHistory);
        }

        // 加载阅读历史
        const readingHistory = localStorage.getItem(
          STORAGE_KEYS.READING_HISTORY
        );
        if (readingHistory) {
          this.readingHistory = JSON.parse(readingHistory);
        }

        // 加载收藏列表
        const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITE_NEWS);
        if (favorites) {
          this.favorites = JSON.parse(favorites);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    },

    // 检测设备类型
    detectDevice() {
      const width = window.innerWidth;
      this.device = {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      };
    },

    // 设置网络状态监听
    setupNetworkListener() {
      window.addEventListener("online", () => {
        this.isOnline = true;
      });
      window.addEventListener("offline", () => {
        this.isOnline = false;
      });
    },

    // 切换主题
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      this.saveUserPreferences();

      // 应用主题到HTML元素
      document.documentElement.classList.toggle("dark", this.theme === "dark");
    },

    // 设置主题
    setTheme(theme: "light" | "dark") {
      this.theme = theme;
      this.saveUserPreferences();
      document.documentElement.classList.toggle("dark", theme === "dark");
    },

    // 切换侧边栏状态
    toggleSidebar() {
      if (this.device.isMobile) {
        this.mobileSidebarOpen = !this.mobileSidebarOpen;
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        this.saveUserPreferences();
      }
    },

    // 关闭移动端侧边栏
    closeMobileSidebar() {
      this.mobileSidebarOpen = false;
    },

    // 设置全局加载状态
    setGlobalLoading(loading: boolean) {
      this.globalLoading = loading;
    },

    // 显示错误消息
    showError(error: string) {
      this.error = error;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },

    // 显示成功消息
    showMessage(message: string) {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },

    // 清除消息
    clearMessages() {
      this.error = null;
      this.message = null;
    },

    // 添加搜索历史
    addSearchHistory(keyword: string) {
      if (!keyword.trim()) return;

      // 移除重复项并添加到开头
      this.searchHistory = [
        keyword,
        ...this.searchHistory.filter((item) => item !== keyword),
      ];

      // 限制历史记录数量
      if (this.searchHistory.length > 50) {
        this.searchHistory = this.searchHistory.slice(0, 50);
      }

      // 保存到本地存储
      localStorage.setItem(
        STORAGE_KEYS.SEARCH_HISTORY,
        JSON.stringify(this.searchHistory)
      );
    },

    // 清除搜索历史
    clearSearchHistory() {
      this.searchHistory = [];
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    },

    // 添加阅读历史
    addReadingHistory(newsId: string) {
      // 移除重复项并添加到开头
      this.readingHistory = [
        newsId,
        ...this.readingHistory.filter((id) => id !== newsId),
      ];

      // 限制历史记录数量
      if (this.readingHistory.length > 100) {
        this.readingHistory = this.readingHistory.slice(0, 100);
      }

      // 保存到本地存储
      localStorage.setItem(
        STORAGE_KEYS.READING_HISTORY,
        JSON.stringify(this.readingHistory)
      );
    },

    // 切换收藏状态
    toggleFavorite(newsId: string) {
      const index = this.favorites.indexOf(newsId);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(newsId);
      }

      // 保存到本地存储
      localStorage.setItem(
        STORAGE_KEYS.FAVORITE_NEWS,
        JSON.stringify(this.favorites)
      );
    },

    // 检查是否已收藏
    isFavorite(newsId: string): boolean {
      return this.favorites.includes(newsId);
    },

    // 更新用户偏好
    updatePreferences(newPreferences: Partial<AppState["preferences"]>) {
      this.preferences = { ...this.preferences, ...newPreferences };
      this.saveUserPreferences();
    },

    // 窗口大小变化处理
    handleResize() {
      this.detectDevice();
      if (this.device.isDesktop) {
        this.mobileSidebarOpen = false;
      }
    },
  },
});
