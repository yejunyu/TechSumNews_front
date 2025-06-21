// Timeline事件结构
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
  importance: "high" | "medium" | "low" | "normal";
  relatedNews: string[];
  tags: string[];
  imageUrl?: string;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
  impact?: string;
  viewCount?: number;
  commentCount?: number;
}

// Timeline筛选条件
export interface TimelineFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  category?: string;
  importance?: ("high" | "medium" | "low" | "normal")[];
  tags?: string[];
}

// 处理后的Timeline事件
export interface ProcessedTimelineEvent extends TimelineEvent {
  relativeTime: string;
  formattedDate: string;
  position: number;
}

// Timeline统计信息
export interface TimelineStats {
  totalEvents: number;
  highImportance: number;
  mediumImportance: number;
  lowImportance: number;
  categoriesCount: Record<string, number>;
}

// 时间段预设选项
export interface TimeRangeOption {
  label: string;
  value: string;
  range: {
    start: Date;
    end: Date;
  };
}
