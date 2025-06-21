// 新闻数据结构
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishTime: Date;
  author: string;
  tags: string[];
  imageUrl?: string;
  sourceUrl?: string;
  isHot: boolean;
  viewCount: number;
  likes: number;
  commentCount?: number;
  hasTimeline?: boolean; // 是否有时间线
  timelineId?: string; // 关联的时间线ID
}

// 分类定义
export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
}

// 筛选条件
export interface FilterOptions {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchKeyword?: string;
}

// API响应结构
export interface NewsResponse {
  data: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

// 新闻统计信息
export interface NewsStats {
  totalNews: number;
  todayNews: number;
  hotNews: number;
  categories: Record<string, number>;
}
