import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { MotionPlugin } from "@vueuse/motion";

import App from "./App.vue";
import router from "./router";
import { useThemeStore } from "./stores/theme";
// import { clerkPlugin } from "@clerk/vue";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(MotionPlugin);

// 初始化主题系统
const themeStore = useThemeStore();
themeStore.initTheme();

// app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
app.mount("#app");
