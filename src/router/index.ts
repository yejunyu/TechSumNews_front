import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/stores/app";
import EventDetailView from "@/views/EventDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "highlights",
      component: () => import("../views/HighlightsView.vue"),
      meta: {
        title: "首页 - Highlights",
        keepAlive: true,
      },
    },
    {
      path: "/techsum",
      name: "techsum",
      component: () => import("../views/HomeView.vue"),
      meta: {
        title: "TechSum - 精选内容",
        keepAlive: true,
      },
    },
    {
      path: "/events",
      name: "events",
      component: () => import("../views/EventsView.vue"),
      meta: {
        title: "科技事件 - TechSum",
        keepAlive: true,
      },
    },
    {
      path: "/events/:group_title",
      name: "EventDetail",
      component: EventDetailView,
    },
    {
      path: "/news/:id",
      name: "news-detail",
      component: () => import("../views/NewsDetailView.vue"),
      meta: {
        title: "新闻详情 - TechSum",
      },
      props: true,
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchView.vue"),
      meta: {
        title: "搜索结果 - TechSum",
      },
    },
    {
      path: "/category/:category",
      name: "category",
      component: () => import("../views/CategoryView.vue"),
      meta: {
        title: "分类浏览 - TechSum",
      },
      props: true,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "关于我们 - TechSum",
      },
    },
    {
      path: "/404",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "页面不存在 - TechSum",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的滚动位置，恢复它
    if (savedPosition) {
      return savedPosition;
    }
    // 如果有锚点，滚动到锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    // 否则滚动到顶部
    return { top: 0 };
  },
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const appStore = useAppStore();

  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // 关闭移动端侧边栏
  if (appStore.device.isMobile) {
    appStore.closeMobileSidebar();
  }

  // 清除错误和消息
  appStore.clearMessages();

  next();
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 页面切换完成后的处理
  console.log(`Route changed from ${from.path} to ${to.path}`);
});

export default router;
