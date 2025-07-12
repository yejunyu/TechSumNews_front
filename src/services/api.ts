import axios from "axios";
import type { NewsItem, NewsResponse, FilterOptions } from "@/types/news";
import type { TimelineEvent, TimelineFilter } from "@/types/timeline";
import type { HighlightEvent } from "@/types/highlights";
import type { EventGroup } from "@/types/events";
import { API_CONFIG } from "@/utils/constants";

// 创建axios实例
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
          break;
        case 403:
          console.error("访问被拒绝");
          break;
        case 404:
          console.error("请求的资源不存在");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        default:
          console.error(
            "请求失败:",
            error.response.data?.message || error.message
          );
      }
    } else if (error.request) {
      console.error("网络错误，请检查网络连接");
    } else {
      console.error("请求配置错误:", error.message);
    }
    return Promise.reject(error);
  }
);

// 新闻相关API
export class NewsAPI {
  // 获取新闻列表
  static async getNews(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    keyword?: string;
    sortBy?: string;
  }): Promise<NewsResponse> {
    return api.get("/news", { params });
  }

  // 获取新闻详情
  static async getNewsDetail(id: string): Promise<NewsItem> {
    return api.get(`/news/${id}`);
  }

  // 搜索新闻
  static async searchNews(params: {
    keyword: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<NewsResponse> {
    return api.get("/news/search", { params });
  }

  // 获取热门新闻
  static async getHotNews(limit?: number): Promise<NewsItem[]> {
    return api.get("/news/hot", { params: { limit } });
  }

  // 获取分类新闻
  static async getNewsByCategory(
    category: string,
    params?: {
      page?: number;
      pageSize?: number;
    }
  ): Promise<NewsResponse> {
    return api.get(`/news/category/${category}`, { params });
  }

  // 获取相关新闻
  static async getRelatedNews(
    newsId: string,
    limit?: number
  ): Promise<NewsItem[]> {
    return api.get(`/news/${newsId}/related`, { params: { limit } });
  }

  // 点赞新闻
  static async likeNews(newsId: string): Promise<{ success: boolean }> {
    return api.post(`/news/${newsId}/like`);
  }

  // 收藏新闻
  static async favoriteNews(newsId: string): Promise<{ success: boolean }> {
    return api.post(`/news/${newsId}/favorite`);
  }

  // 获取新闻统计
  static async getNewsStats(): Promise<{
    totalNews: number;
    todayNews: number;
    hotNews: number;
    categories: Record<string, number>;
  }> {
    return api.get("/news/stats");
  }
}

// Timeline相关API
export class TimelineAPI {
  // 获取Timeline事件
  static async getTimelineEvents(params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    importance?: string[];
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: TimelineEvent[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return api.get("/timeline", { params });
  }

  // 获取Timeline事件详情
  static async getTimelineEventDetail(id: string): Promise<TimelineEvent> {
    return api.get(`/timeline/${id}`);
  }

  // 获取Timeline统计
  static async getTimelineStats(): Promise<{
    totalEvents: number;
    highImportance: number;
    mediumImportance: number;
    lowImportance: number;
    categoriesCount: Record<string, number>;
  }> {
    return api.get("/timeline/stats");
  }
}

// 用户相关API
export class UserAPI {
  // 用户登录
  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<{
    token: string;
    user: any;
  }> {
    return api.post("/auth/login", credentials);
  }

  // 用户注册
  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    return api.post("/auth/register", userData);
  }

  // 获取用户信息
  static async getUserInfo(): Promise<any> {
    return api.get("/user/profile");
  }

  // 获取用户收藏
  static async getUserFavorites(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<NewsResponse> {
    return api.get("/user/favorites", { params });
  }

  // 获取阅读历史
  static async getReadingHistory(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<NewsResponse> {
    return api.get("/user/history", { params });
  }
}

// 系统配置API
export class SystemAPI {
  // 获取系统配置
  static async getSystemConfig(): Promise<any> {
    return api.get("/system/config");
  }

  // 获取分类列表
  static async getCategories(): Promise<any[]> {
    return api.get("/system/categories");
  }

  // 提交反馈
  static async submitFeedback(feedback: {
    type: string;
    content: string;
    email?: string;
  }): Promise<{ success: boolean }> {
    return api.post("/system/feedback", feedback);
  }
}

// Events API
export class EventsAPI {
  static async getEvents(): Promise<EventGroup[]> {
    const response = await axios.get(
      `https://techsum-server-production.up.railway.app/techsum/api/v2/events`
    );
    return response.data;
  }
}

// Highlights API
export class HighlightsAPI {
  static async getHighlights(category: string): Promise<EventGroup[]> {
    // Note: The base URL for this specific API is different.
    const response = await axios.get(
      `https://techsum-server-production.up.railway.app/techsum/api/v2/highlights/${category}`
    );
    return response.data;
  }
}

export default api;
