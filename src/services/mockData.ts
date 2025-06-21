import type { NewsItem } from "@/types/news";
import type { TimelineEvent } from "@/types/timeline";

// 从JSON文件加载新闻数据
export const loadNewsData = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch("/data/news.json");
    const data = await response.json();

    // 转换日期字符串为Date对象
    return data.news.map((item: any) => ({
      ...item,
      publishTime: new Date(item.publishTime),
    }));
  } catch (error) {
    console.error("Failed to load news data:", error);
    return [];
  }
};

// 从JSON文件加载Timeline数据
export const loadTimelineData = async (): Promise<TimelineEvent[]> => {
  try {
    const response = await fetch("/data/timeline.json");
    const data = await response.json();

    // 转换日期字符串为Date对象
    return data.events.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));
  } catch (error) {
    console.error("Failed to load timeline data:", error);
    return [];
  }
};

// 获取新闻分类统计
export const getNewsStats = async () => {
  const newsData = await loadNewsData();

  const stats = {
    totalNews: newsData.length,
    todayNews: newsData.filter((item) => {
      const today = new Date();
      const publishDate = new Date(item.publishTime);
      return publishDate.toDateString() === today.toDateString();
    }).length,
    hotNews: newsData.filter((item) => item.isHot).length,
    categories: {} as Record<string, number>,
  };

  // 统计各分类新闻数量
  newsData.forEach((item) => {
    stats.categories[item.category] =
      (stats.categories[item.category] || 0) + 1;
  });

  return stats;
};

// 获取Timeline统计
export const getTimelineStats = async () => {
  const timelineData = await loadTimelineData();

  const stats = {
    totalEvents: timelineData.length,
    highImportance: timelineData.filter((item) => item.importance === "high")
      .length,
    mediumImportance: timelineData.filter(
      (item) => item.importance === "medium"
    ).length,
    lowImportance: timelineData.filter((item) => item.importance === "low")
      .length,
    categoriesCount: {} as Record<string, number>,
  };

  // 统计各分类事件数量
  timelineData.forEach((item) => {
    stats.categoriesCount[item.category] =
      (stats.categoriesCount[item.category] || 0) + 1;
  });

  return stats;
};

// 搜索新闻
export const searchNews = async (
  keyword: string,
  category?: string
): Promise<NewsItem[]> => {
  const newsData = await loadNewsData();

  return newsData.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.summary.toLowerCase().includes(keyword.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(keyword.toLowerCase())
      );

    const matchesCategory =
      !category || category === "all" || item.category === category;

    return matchesKeyword && matchesCategory;
  });
};

// 获取热门新闻
export const getHotNews = async (limit: number = 5): Promise<NewsItem[]> => {
  const newsData = await loadNewsData();

  return newsData
    .filter((item) => item.isHot)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

// 获取相关新闻
export const getRelatedNews = async (
  newsId: string,
  limit: number = 3
): Promise<NewsItem[]> => {
  const newsData = await loadNewsData();
  const currentNews = newsData.find((item) => item.id === newsId);

  if (!currentNews) return [];

  return newsData
    .filter(
      (item) =>
        item.id !== newsId &&
        (item.category === currentNews.category ||
          item.tags.some((tag) => currentNews.tags.includes(tag)))
    )
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

// 按分类获取新闻
export const getNewsByCategory = async (
  category: string,
  limit?: number
): Promise<NewsItem[]> => {
  const newsData = await loadNewsData();

  const filtered =
    category === "all"
      ? newsData
      : newsData.filter((item) => item.category === category);

  const sorted = filtered.sort(
    (a, b) =>
      new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  );

  return limit ? sorted.slice(0, limit) : sorted;
};

// 获取最新新闻
export const getLatestNews = async (
  limit: number = 10
): Promise<NewsItem[]> => {
  const newsData = await loadNewsData();

  return newsData
    .sort(
      (a, b) =>
        new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
    )
    .slice(0, limit);
};
