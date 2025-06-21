import { defineStore } from "pinia";
import type {
  NewsItem,
  Category,
  FilterOptions,
  NewsStats,
} from "@/types/news";
import {
  loadNewsData,
  searchNews,
  getHotNews,
  getNewsByCategory,
  getNewsStats,
} from "@/services/mockData";
import { NEWS_CATEGORIES } from "@/utils/constants";

interface NewsState {
  newsList: NewsItem[];
  categories: Category[];
  currentNews: NewsItem | null;
  hotNews: NewsItem[];
  loading: boolean;
  searchKeyword: string;
  currentCategory: string;
  filter: FilterOptions;
  stats: NewsStats | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export const useNewsStore = defineStore("news", {
  state: (): NewsState => ({
    newsList: [],
    categories: NEWS_CATEGORIES,
    currentNews: null,
    hotNews: [],
    loading: false,
    searchKeyword: "",
    currentCategory: "all",
    filter: {},
    stats: null,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
  }),

  getters: {
    // 过滤后的新闻列表
    filteredNews(): NewsItem[] {
      let filtered = [...this.newsList];

      // 按分类过滤
      if (this.currentCategory && this.currentCategory !== "all") {
        filtered = filtered.filter(
          (item) => item.category === this.currentCategory
        );
      }

      // 按搜索关键词过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.summary.toLowerCase().includes(keyword) ||
            item.tags.some((tag) => tag.toLowerCase().includes(keyword))
        );
      }

      // 按标签过滤
      if (this.filter.tags && this.filter.tags.length > 0) {
        filtered = filtered.filter((item) =>
          this.filter.tags!.some((tag) => item.tags.includes(tag))
        );
      }

      // 按时间范围过滤
      if (this.filter.dateRange) {
        const { start, end } = this.filter.dateRange;
        filtered = filtered.filter((item) => {
          const publishTime = new Date(item.publishTime);
          return publishTime >= start && publishTime <= end;
        });
      }

      return filtered;
    },

    // 分页后的新闻列表
    paginatedNews(): NewsItem[] {
      const filtered = this.filteredNews;
      const start = (this.pagination.page - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return filtered.slice(start, end);
    },

    // 获取指定分类的新闻数量
    getCategoryCount(): (category: string) => number {
      return (category: string): number => {
        if (category === "all") return this.newsList.length;
        return this.newsList.filter((item) => item.category === category)
          .length;
      };
    },

    // 获取热门标签
    popularTags(): { name: string; count: number }[] {
      const tagCount: Record<string, number> = {};

      this.newsList.forEach((item) => {
        item.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });

      return Object.entries(tagCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
    },
  },

  actions: {
    // 加载新闻数据
    async fetchNews() {
      this.loading = true;
      try {
        const newsData = await loadNewsData();
        this.newsList = newsData;
        this.pagination.total = newsData.length;
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        this.loading = false;
      }
    },

    // 加载热门新闻
    async fetchHotNews(limit: number = 5) {
      try {
        this.hotNews = await getHotNews(limit);
      } catch (error) {
        console.error("Failed to fetch hot news:", error);
      }
    },

    // 加载新闻统计
    async fetchNewsStats() {
      try {
        this.stats = await getNewsStats();
      } catch (error) {
        console.error("Failed to fetch news stats:", error);
      }
    },

    // 搜索新闻
    async searchNews(keyword: string) {
      this.loading = true;
      this.searchKeyword = keyword;
      try {
        const results = await searchNews(keyword, this.currentCategory);
        this.newsList = results;
        this.pagination.total = results.length;
        this.pagination.page = 1;
      } catch (error) {
        console.error("Failed to search news:", error);
      } finally {
        this.loading = false;
      }
    },

    // 按分类获取新闻
    async fetchNewsByCategory(category: string) {
      this.loading = true;
      this.currentCategory = category;
      try {
        const newsData = await getNewsByCategory(category);
        this.newsList = newsData;
        this.pagination.total = newsData.length;
        this.pagination.page = 1;
      } catch (error) {
        console.error("Failed to fetch news by category:", error);
      } finally {
        this.loading = false;
      }
    },

    // 获取新闻详情
    async fetchNewsDetail(id: string): Promise<NewsItem | null> {
      try {
        const newsData = await loadNewsData();
        const news = newsData.find((item) => item.id === id);
        if (news) {
          this.currentNews = news;
          // 增加浏览量
          news.viewCount += 1;
        }
        return news || null;
      } catch (error) {
        console.error("Failed to fetch news detail:", error);
        return null;
      }
    },

    // 设置筛选条件
    setFilter(filter: Partial<FilterOptions>) {
      this.filter = { ...this.filter, ...filter };
      this.pagination.page = 1;
    },

    // 清除筛选条件
    clearFilter() {
      this.filter = {};
      this.searchKeyword = "";
      this.currentCategory = "all";
      this.pagination.page = 1;
    },

    // 设置分页
    setPagination(page: number, pageSize?: number) {
      this.pagination.page = page;
      if (pageSize) {
        this.pagination.pageSize = pageSize;
      }
    },

    // 点赞新闻
    async likeNews(newsId: string) {
      try {
        const news = this.newsList.find((item) => item.id === newsId);
        if (news) {
          news.likes += 1;
        }
        // 这里可以调用API
        // await NewsAPI.likeNews(newsId)
      } catch (error) {
        console.error("Failed to like news:", error);
      }
    },

    // 收藏新闻
    async favoriteNews(newsId: string) {
      try {
        // 这里可以调用API
        // await NewsAPI.favoriteNews(newsId)
        console.log("News favorited:", newsId);
      } catch (error) {
        console.error("Failed to favorite news:", error);
      }
    },
  },
});
