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

// ================= External Timeline (from Railway) =================
// These types describe the structure returned by
// GET https://web-production-136f4.up.railway.app/timelines/{id}

export interface ExternalTimelineEvent {
  url: string;
  title: string;
  source: string;
  publishedAt: string; // ISO string, e.g. 2025-07-17T10:31:10Z
}

export interface ExternalTimelinePayload {
  events: ExternalTimelineEvent[];
}

export interface ExternalTimelineResponse {
  id: number;
  group_id: number;
  status: string; // expect "COMPLETED" when ready
  generated_at: string; // ISO string
  timeline_data?: ExternalTimelinePayload;
}
