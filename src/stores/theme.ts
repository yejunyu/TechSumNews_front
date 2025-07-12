import { ref, computed, readonly } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  // 主题状态
  const currentTheme = ref<"fantasy" | "dark">("fantasy");

  // 计算属性
  const isDark = computed(() => currentTheme.value === "dark");
  const themeIcon = computed(() => (isDark.value ? "sunny" : "moon"));

  // 初始化主题
  const initTheme = () => {
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem("tech-sum-theme") as
      | "fantasy"
      | "dark"
      | null;

    if (savedTheme) {
      currentTheme.value = savedTheme;
    } else {
      // 根据系统偏好设置默认主题
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      currentTheme.value = prefersDark ? "dark" : "fantasy";
    }

    // 应用主题到DOM
    applyTheme();
  };

  // 应用主题到DOM
  const applyTheme = () => {
    const html = document.documentElement;
    html.setAttribute("data-theme", currentTheme.value);

    // 保存到localStorage
    localStorage.setItem("tech-sum-theme", currentTheme.value);
  };

  // 切换主题
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "fantasy" ? "dark" : "fantasy";
    applyTheme();
  };

  // 设置指定主题
  const setTheme = (theme: "fantasy" | "dark") => {
    currentTheme.value = theme;
    applyTheme();
  };

  return {
    currentTheme: readonly(currentTheme),
    isDark,
    themeIcon,
    initTheme,
    toggleTheme,
    setTheme,
  };
});
